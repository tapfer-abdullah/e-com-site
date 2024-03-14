import { NextResponse } from 'next/server';

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};



const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET,
        ).toString("base64");
        const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

const orderItems = (dataForBxGy, shipping, tips) => {
    let cartArray = [];

    let data = {
        reference_id: dataForBxGy[0].sku,
        description: dataForBxGy[0].name || "Product",
        amount: {
            currency_code: "USD",
            value: dataForBxGy[0].price + shipping + tips,
            breakdown: {
                item_total: {
                    currency_code: "USD",
                    value: dataForBxGy[0].price,
                },
                shipping: {
                    currency_code: "USD",
                    value: shipping,
                },
                discount: {
                    currency_code: "USD",
                    value: "0.00",
                },
                handling: {
                    currency_code: "USD",
                    value: tips, // Handling fee (tips)
                },
            },
        },
        // shipping: {
        //     name: {
        //         full_name: "ajkldjflk",

        //     },
        //     address: {
        //         address_line_1: "123 Shipping St",
        //         admin_area_1: "State",
        //         admin_area_2: "City",
        //         postal_code: "12345",
        //         country_code: "US",
        //     },
        // }
    };
    cartArray.push(data);



    for (let i = 1; i < dataForBxGy.length; i++) {
        let item = dataForBxGy[i];

        let data = {
            reference_id: item.sku,
            description: item.name,
            amount: {
                currency_code: "USD",
                value: item.price,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: item.price,
                    },
                    shipping: {
                        currency_code: "USD",
                        value: "0.00",
                    },
                    discount: {
                        currency_code: "USD",
                        value: "0.00",
                    },
                    handling: {
                        currency_code: "USD",
                        value: "0.00", // Handling fee (tips)
                    },
                },
            }
        };
        cartArray.push(data);

    }

    // dataForBxGy.forEach((item) => {
    //     let data = {
    //         reference_id: item.sku,
    //         description: item.name,
    //         amount: {
    //             currency_code: "USD",
    //             value: item.price + 10.0,
    //             breakdown: {
    //                 item_total: {
    //                     currency_code: "USD",
    //                     value: item.price,
    //                 },
    //                 shipping: {
    //                     currency_code: "USD",
    //                     value: "10.00",
    //                 },
    //                 discount: {
    //                     currency_code: "USD",
    //                     value: "0.00",
    //                 },
    //                 handling: {
    //                     currency_code: "USD",
    //                     value: "0.00", // Handling fee (tips)
    //                 },
    //             },
    //         },
    //         address: {
    //             address_line_1: "123 Shipping St",
    //             admin_area_2: "City",
    //             admin_area_1: "State",
    //             postal_code: "12345",
    //             country_code: "US",
    //         },
    //     };
    //     cartArray.push(data);
    // });

    return cartArray;
};


async function createOrder(dataForBxGy, shipping, tips) {
    const cartArray = orderItems(dataForBxGy, shipping, tips);
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
                purchase_units: cartArray,
                application_context: {
                    shipping_preference: "GET_FROM_FILE",
                    user_action: "PAY_NOW",
                    brand_name: "ODBHOOTSTORE",
                    return_url: `https://odbhootstore.vercel.app/Payment/success.html?orderNumber=${'ff00'}`,
                    cancel_url: "https://example.com/cancel",
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create order: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}


export const POST = async (request) => {
    try {
        const { dataForBxGy, shipping, tips } = await request.json();
        // console.log("Received request:", dataForBxGy, shipping, tips);

        // Create order
        const order = await createOrder(dataForBxGy, shipping, tips);
        console.log("Created order:", order);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error(error);
    }
};
