// import { connectDB } from "@/app/helper/db";
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const calculateOrderAmount = (items, shipping = 0) => {

    const sum = items.reduce((accumulator, currentItem) => {
        return accumulator + (currentItem.price * currentItem.quantity);
    }, shipping);

    return sum;
};

export const POST = async (request) => {
    const { personalInfo, cart, amount } = await request.json();

    // console.log({ personalInfo, cart })

    let totalAmount = 0;

    if (!personalInfo?.email) {
        return NextResponse.json({ message: "Email is required!", status: false });
    }

    if (personalInfo?.discountCode) {
        // to do: discount code validate and calculation 
        totalAmount = amount;
    }
    else {
        totalAmount = calculateOrderAmount(cart, personalInfo?.shipping || 0)
        totalAmount += personalInfo?.tips;
        // console.log({ totalAmount })
    }

    // return NextResponse.json({ message: "Checking..!", status: false });

    const customer = await stripe.customers.create({
        name: personalInfo?.firstName + " " + personalInfo?.lastName,
        email: personalInfo?.email,
        address: {
            line1: personalInfo?.address || "",
            city: personalInfo?.city || "",
            postal_code: personalInfo?.postalCode || "",
            country: personalInfo?.country || "",
        },
        phone: personalInfo?.phoneNumber || "",
        // id: "bd03"
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
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

