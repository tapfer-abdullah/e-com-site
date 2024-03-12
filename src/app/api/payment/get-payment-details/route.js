// api/get-payment-details.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";
import { parse } from 'url';

export const GET = async (request, { params }) => {
    const url = request.url;

    const { query } = parse(url, true);

    // Accessing the 'name' parameter value
    const searchParams = new URLSearchParams(query);
    const clientSecret = searchParams.get('client_secret');
    // const clientSecret = request.query?.client_secret;
    console.log({ clientSecret })

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
        return NextResponse.json(paymentIntent);
    } catch (error) {
        console.error('Error retrieving payment details from Stripe:', error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}
