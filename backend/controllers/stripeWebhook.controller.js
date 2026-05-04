import stripe from "../config/stripe.js";
import User from "../models/user.model.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).json({
      message: "Invalid webhook signature",
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const credits = session.metadata.credits;
      const plan = session.metadata.plan;

      console.log("Processing payment for:", { userId, credits, plan });

      if (!userId || !credits || !plan) {
        console.error("Missing metadata in session:", { userId, credits, plan });
        return res.status(400).json({
          message: "Missing required metadata",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { credits: Number(credits) },
          plan: plan,
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error("User not found or update failed:", userId);
        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log("User updated successfully:", {
        userId,
        newCredits: updatedUser.credits,
        newPlan: updatedUser.plan,
      });
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({
      message: "Webhook processing failed",
      details: error.message,
    });
  }
};
