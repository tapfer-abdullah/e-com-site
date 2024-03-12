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

export const POST = async (request, { params }) => {
    const url = request.url;
    const { email, orderNumber } = await request.json();

    const { query } = parse(url, true);

    const searchParams = new URLSearchParams(query);
    const clientSecret = searchParams.get('client_secret');
    console.log({ clientSecret, email, orderNumber })

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
        if (paymentIntent?.status == "succeeded") {
            const newData = orderNumber.replace(/^abn/i, 'scs');

            const update = {
                $set: {
                    orderNumber: newData,
                    status: "paid",
                    // Add more fields as needed
                },
            };

            const result1 = await OrderSchema.findOneAndUpdate({ orderNumber: orderNumber }, update, { new: true });
            console.log({ result1 })
            return NextResponse.json(result1);
        }
    } catch (error) {
        console.error('Error retrieving payment details from Stripe:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}