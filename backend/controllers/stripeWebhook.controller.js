import stripe from "../config/stripe.js";
import User from "../models/User.model.js";

export const stripeWebhook=async(req,res)=>{
    const sig=req.headers["stripe-signature"];
    let event;
    try {
        event=stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).json({
            message: "Invalid webhook signature",
        });
    }
    if(event.type==="checkout.session.completed"){
        const session=event.data.object;
        const userid=session.metadata.userId;
        const credits=session.metadata.credits;
        const plan=session.metadata.plan;
        await User.findByIdAndUpdate(userid,{
            $inc:{credits:Number(credits)},
            plan:plan,
        });
        console.log("Checkout session completed:", session);
    }
    return res.json({received:true});
}
