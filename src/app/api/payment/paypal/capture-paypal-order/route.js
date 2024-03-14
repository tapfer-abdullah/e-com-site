
// For a working example, see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
import { NextResponse } from 'next/server';
import { parse } from 'url';

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};


export const POST = async (request, { params }) => {
    const { orderID } = await request.json();

    const captureData = await capturePayment(orderID);

    // if(captureData.status == "COMPLETED"){

    // }

    return NextResponse.json(captureData);

}

//////////////////////
// PayPal API helpers
//////////////////////

// Use the orders API to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

// Generate an access token using client ID and app secret
async function generateAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString("base64")
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    return data.access_token;
}
