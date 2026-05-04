import stripe from "../config/stripe.js";
import { PLANS } from "../config/plans.js";
import User from "../models/user.model.js";

export const billing = async (req, res) => {
  try {
    const { planType } = req.body;

    // Validate authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    const userId = req.user._id;

    // Validate selected plan
    const plan = PLANS[planType];

    if (!plan) {
      return res.status(400).json({
        message: "Invalid plan type",
      });
    }

    // Prevent free plan from going to Stripe
    if (plan.price === 0) {
      return res.status(400).json({
        message: "Free plan does not require payment",
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              // FIXED: Use planType instead of undefined plan.name
              name: `${planType.toUpperCase()} plan for GenWeb.ai`,
            },
            // Stripe amount is in paise
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        userId: userId.toString(),
        credits: String(plan.credits),
        plan: planType,
      },

      // FIXED: Redirect to dashboard after success
      success_url: `${process.env.FRONTEND_URL}/billing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing-failed`,
    });

    // Ensure Stripe returned a valid URL
    if (!session.url) {
      return res.status(500).json({
        message: "Stripe session URL not generated",
      });
    }

    return res.status(200).json({
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Billing error:", error);

    return res.status(500).json({
      message: `Billing error: ${error.message}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user._id;

    if (!sessionId) {
      return res.status(400).json({
        message: "Session ID is required",
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Retrieved session:", {
      sessionId,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    // Check if payment was successful
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment not completed",
        payment_status: session.payment_status,
      });
    }

    // Verify the session belongs to this user
    if (session.metadata.userId !== userId.toString()) {
      return res.status(403).json({
        message: "This payment does not belong to you",
      });
    }

    const credits = Number(session.metadata.credits);
    const plan = session.metadata.plan;

    // Update user with new credits and plan
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { credits },
        plan: plan,
      },
      { new: true }
    );

    console.log("User updated successfully:", {
      userId,
      newCredits: updatedUser.credits,
      newPlan: updatedUser.plan,
    });

    return res.status(200).json({
      message: "Payment verified and credits added",
      user: {
        credits: updatedUser.credits,
        plan: updatedUser.plan,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      message: "Payment verification failed",
      details: error.message,
    });
  }
};
