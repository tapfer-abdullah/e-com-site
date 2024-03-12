// pages/api/webhook.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const endpointSecret = 'whsec_...'; // Replace with your actual endpoint secret
const endpointSecret = "whsec_129c7972ae8b74313c945832d1da4b64cb8597c32550f5df15a168ca2df0b176";


export default async function handler(req, res) {
    console.log("hi........");
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'] || '',
            endpointSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send('Webhook Error: Signature verification failed');
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).json({ received: true });
}
