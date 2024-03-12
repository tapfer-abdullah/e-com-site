// import { connectDB } from "@/app/helper/db";
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const calculateOrderAmount = (items) => {
    return 20000;
};

export const POST = async (request) => {
    const { personalInfo, cart } = await request.json();

    // console.log({ personalInfo, cart })

    const customer = await stripe.customers.create({
        name: personalInfo?.firstName + " " + personalInfo?.lastName,
        email: personalInfo?.email,
        address: {
            line1: personalInfo?.address,
            city: personalInfo?.city,
            postal_code: personalInfo?.postalCode,
            country: personalInfo?.country,
        },
        phone: "+1234567890",
        // id: "bd03"
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: "eur",
        payment_method_types: ["card"],
        customer: customer.id,
        receipt_email: personalInfo?.email || null,
        description: "Payment for order #1004",
    });


    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    });
    // return NextResponse.json({
    // });

}

