import { CustomerSchema } from "@/app/models/customerInfo";
import { OrderSchema } from "@/app/models/order";
import { NextResponse } from "next/server";
import { parse } from 'url';
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
    console.log('received......')
    return NextResponse.json({ message: "received........!", status: false });
    // try {
    //     // const result = await DiscountSchema.find().select({ title: 1, _id: 1, used: 1, status: 1 });
    //     const result = await DiscountSchema.find();
    //     return NextResponse.json(result)
    // }
    // catch (error) {
    //     console.log(error)
    //     return NextResponse.json({ message: "Failed to fetch discount codes!", status: false });
    // }

}


// Payment success for stripe 
export const POST = async (request, { params }) => {
    const url = request.url;
    const { email, orderID, cardID, payment_method } = await request.json();
    const { query } = parse(url, true);

    const searchParams = new URLSearchParams(query);
    const clientSecret = searchParams.get('client_secret');
    // console.log({ clientSecret, email, orderID, cardID, payment_method })



    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
        // console.log({ paymentIntent });

        if (paymentIntent?.status == "succeeded") {

            const paymentMethodId = paymentIntent.payment_method;
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

            let cardBrand = payment_method;
            let cardLast4 = null;
            if (paymentMethod && paymentMethod.card) {
                cardBrand = paymentMethod.card.brand;
                cardLast4 = paymentMethod.card.last4;
                console.log("Card Brand:", cardBrand);
                console.log("Card Last 4 Digits:", cardLast4);
            }


            const newData = orderID.replace(/^A/i, 'S');
            const result = await CustomerSchema.findOneAndUpdate(
                { email: email, orderID: orderID },
                { $set: { orderID: newData } },
                { new: true }
            );

            const update = {
                $set: {
                    orderID: newData,
                    status: "paid",
                    payment_method: cardBrand || "Unable to detect!",
                    last_four_digit: cardLast4 || "Unable to detect!"
                },
            };

            const result1 = await OrderSchema.findByIdAndUpdate(cardID, update, { new: true });
            // console.log({ result1 })
            return NextResponse.json({ result1, paymentIntent });
        }
    } catch (error) {
        console.error('Error retrieving payment details from Stripe:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}



// Payment success for PayPal 
export const PATCH = async (request, { params }) => {
    const { email, orderID, cardID, payment_method } = await request.json();

    // console.log({ email, orderID, cardID, payment_method })

    try {
        const newData = orderID.replace(/^A/i, 'S');

        const result = await CustomerSchema.findOneAndUpdate(
            { email: email, orderID: orderID },
            { $set: { orderID: newData } },
            { new: true }
        );

        const update = {
            $set: {
                orderID: newData,
                status: "paid",
                payment_method: payment_method || "Unable to detect!"
            },
        };

        const result1 = await OrderSchema.findByIdAndUpdate(cardID, update, { new: true });
        // console.log({ result1 })
        return NextResponse.json(result1);

    } catch (error) {
        console.error('Error retrieving payment details from Stripe:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}