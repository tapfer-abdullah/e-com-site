import { connectDB } from "@/app/helper/db";
import { Products } from "@/app/models/products";
import DiscountCodeChecker from "@/Hooks/DiscountCodeChecker/DiscountCodeChecker";
import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

connectDB();

const calculateOrderAmount = (data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract) => {
    let sum = 0;
    data.forEach(item => {
        sum += (item?.price - item?.discount);
    })

    sum += (shipping + tips - moneyToBeSubtract || 0);

    console.log({ sum })
    return sum;
};

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
    const receivedData = await request.json();
    const { dataForBxGy, shipping, tips, discountCode, email, selectedCountry, personalInfo } = receivedData;
    console.log({ personalInfo })

    let disAdditionalType = "";
    let isDiscounted = false;
    let moneyToBeSubtract = 0;
    let data = dataForBxGy;

    let totalAmount = 0;

    if (discountCode) {
        const response = await DiscountCodeChecker(receivedData);
        const result = resultOfDiscountCode(response, shipping, dataForBxGy);

        disAdditionalType = result.disAdditionalType;
        isDiscounted = result.isDiscounted;
        moneyToBeSubtract = result?.moneyToBeSubtract || 0;
        data = result.data;

        totalAmount = calculateOrderAmount(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
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

        totalAmount = calculateOrderAmount(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
    }


    if (!personalInfo?.email) {
        return NextResponse.json({ message: "Email is required!", status: false });
    }

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
        description: `Payment for order ${personalInfo?.orderID}`,
    });

    // console.log({ paymentIntent })


    return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
    });
    // return NextResponse.json({
    // });

}

