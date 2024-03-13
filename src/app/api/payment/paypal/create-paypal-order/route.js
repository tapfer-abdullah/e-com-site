import { NextResponse } from 'next/server';

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};

export const POST = async (request) => {
    try {
        const data = await request.json();
        console.log("Received request:", data);
        console.log({ PAYPAL_CLIENT_ID, PAYPAL_SECRET })

        // Create order
        const order = await createOrder();
        console.log("Created order:", order);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error(error);
    }
};

// Use the Orders API to create an order
async function createOrder() {
    try {
        const accessToken = await generateAccessToken();

        const url = `${baseURL.sandbox}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "5.00", // Replace with your order value
                        },
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

// Generate an access token using client ID and app secret
async function generateAccessToken() {
    try {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
        const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });



        if (!response.ok) {
            throw new Error(`Failed to generate access token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw error;
    }
}
