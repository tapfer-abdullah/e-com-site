// import { connectDB } from "@/app/helper/db";
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const calculateOrderAmount = (items) => {
    return 20000;
};

export const POST = async (request) => {
    const { items } = await request.json();
    // console.log(items)

    // if (!amount) {
    //     return NextResponse.json({ error: true, message: "price not found!" })
    // }

    console.log(items)
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        }
    });

    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    });

}

