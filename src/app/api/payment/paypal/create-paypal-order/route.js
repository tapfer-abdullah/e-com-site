import DiscountCodeChecker from '@/Hooks/DiscountCodeChecker/DiscountCodeChecker';
import { connectDB } from '@/app/helper/db';
import { Products } from '@/app/models/products';
import { NextResponse } from 'next/server';
connectDB();

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

const orderItems = (dataForBxGy, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract) => {
    console.log({ dataForBxGy, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract });
    // return NextResponse.json({ dataForBxGy, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract });

    let cartArray = [];

    let data = {
        reference_id: dataForBxGy?.[0]?.sku + "OBS0",
        description: dataForBxGy?.[0]?.name || "Product",
        amount: {
            currency_code: "USD",
            value: dataForBxGy?.[0]?.price - dataForBxGy?.[0]?.discount + shipping + tips - moneyToBeSubtract || 0,
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
                    value: dataForBxGy?.[0]?.discount + moneyToBeSubtract,
                },
                handling: {
                    currency_code: "USD",
                    value: tips, // Handling fee (tips)
                },
            },
        },
    };
    cartArray.push(data);



    for (let i = 1; i < dataForBxGy.length; i++) {
        let item = dataForBxGy?.[i];

        let data = {
            reference_id: item?.sku + `OBS${i}`,
            description: item?.name,
            amount: {
                currency_code: "USD",
                value: item?.price - item?.discount,
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: item?.price,
                    },
                    shipping: {
                        currency_code: "USD",
                        value: "0.00",
                    },
                    discount: {
                        currency_code: "USD",
                        value: item?.discount,
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

    // console.log({ cartArray });
    return cartArray;
};


async function createOrder(dataForBxGy, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract) {
    const cartArray = orderItems(dataForBxGy, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
    // console.log({ cartArray });

    // return cartArray;
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
                    shipping_preference: 'GET_FROM_FILE',
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

const resultOfDiscountCode = (response, shipping, dataForBxGy) => {
    // console.log({ response });
    let disAdditionalType = response?.discountType;

    if (response.issue == "invalid") {
        return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
    }

    switch (response?.discountType) {
        case "BxGy": {
            if (response?.issue == "passed") {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: true };
            } else {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "AOffP": {
            if (response?.issue == "passed") {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: true };
            } else {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "AOffO": {
            if (response?.issue == "passed") {
                if (response.data.type == "Percentage") {
                    let moneyToBeSubtract = subTotal * (parseInt(response.data.amount) / 100);
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract, isDiscounted: true };
                }
                else if (response.data.type == "Fixed") {
                    let moneyToBeSubtract = parseInt(response.data.amount);
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract, isDiscounted: true };
                }
                else {
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
                }
            }
            else {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "FS": {
            if (response?.issue == "passed") {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: shipping, isDiscounted: true };
            }
            else {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
    }

}


export const POST = async (request) => {
    try {
        const receivedData = await request.json();
        const { dataForBxGy, shipping, tips, discountCode, email, selectedCountry } = receivedData;

        let disAdditionalType = "";
        let isDiscounted = false;
        let moneyToBeSubtract = 0;
        let data = dataForBxGy;

        if (discountCode) {
            const response = await DiscountCodeChecker(receivedData);
            const result = resultOfDiscountCode(response, shipping, dataForBxGy);

            disAdditionalType = result.disAdditionalType;
            isDiscounted = result.isDiscounted;
            moneyToBeSubtract = result?.moneyToBeSubtract || 0;
            data = result.data;

            const order = await createOrder(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
            // console.log("Created order:", order);
            return NextResponse.json(order);
        }
        else {
            //extracting ids from cart
            const allProductIDs = data.map(p => p.id);
            //Getting price form DB
            const allProductData = await Products.find({ _id: { $in: allProductIDs } }).select({ price: 1, _id: 1 });
            let priceObject = {};
            for (let i = 0; i < allProductData.length; i++) {
                priceObject[allProductData[i]._id.toString()] = allProductData[i].price;
            }

            // updating price from database
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.price !== priceObject[d.id]) {
                    d.price = priceObject[d.id];
                }
            }

            const order = await createOrder(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
            // console.log("Created order:", order);
            return NextResponse.json(order);
        }

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error(error);
    }
};
