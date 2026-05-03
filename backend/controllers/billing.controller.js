import stripe from "../config/stripe.js";
import { PLANS } from "../config/plans.js";

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
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`,
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