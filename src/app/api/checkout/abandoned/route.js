import { CustomerSchema } from "@/app/models/customerInfo";
import { DiscountSchema } from "@/app/models/discountCode";
import { OrderSchema } from "@/app/models/order";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
    return NextResponse.json({ message: "abandoned........!", status: false });
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



const calculateOrderAmount = (items, otherAmount = 0) => {

    const sum = items.reduce((accumulator, currentItem) => {
        return accumulator + ((currentItem.price - currentItem.discount) * currentItem.quantity);
    }, otherAmount);

    return sum;
};

export const POST = async (request) => {
    function generateRandomOrderNumber() {
        const randomComponent = Math.floor(Math.random() * 10000);
        const timestamp = new Date().getTime();
        const orderID = `${timestamp}${randomComponent}`;
        return orderID;
    }

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    let orderID = generateRandomOrderNumber();

    const { cusInfo, cart } = await request.json();
    const { discountCode, tips, shipping, country, email, discountedAmount } = cusInfo;

    let otherAmount = (tips + shipping);
    let totalAmount = calculateOrderAmount(cart, otherAmount);


    let cartProduct = [];
    cart?.forEach(element => {
        cartProduct.push({ productID: element?.id, sku: element?.sku, quantity: element?.quantity, discountAmount: element?.discount || 0 });
    });

    let orderData = {
        email: cusInfo?.email,
        discountCode: cusInfo?.discountCode || "",
        shipping: cusInfo?.shipping || 0,
        tips: cusInfo?.tips || 0,
        status: "abandoned",
        date: formattedDate,
        time: formattedTime,
        orderID: `A${orderID}`,
        orderNumber: `#1001`,
        orderTrackingNumber: "",
        cart: cartProduct,
        totalPaid: totalAmount,
        moneyToBeSubtract: discountedAmount || 0,
        payment_method: "",
        last_four_digit: "",
    }

    let personalInfo = {
        firstName: cusInfo?.firstName,
        lastName: cusInfo?.lastName,
        email: cusInfo?.email,
        phoneNumber: cusInfo?.phoneNumber,
        country: cusInfo?.country,
        city: cusInfo?.city,
        address: cusInfo?.address,
        apartment: cusInfo?.apartment,
        postalCode: cusInfo?.postalCode,
        orderID: `A${orderID}`
    }

    let orderIDOfDB = `A${orderID}`;
    try {
        let result1;
        if (cusInfo?.cardID !== 'undefined') {
            const existingCart = await OrderSchema.findById(cusInfo?.cardID).select('-cart');
            if (existingCart) {
                orderID = existingCart?.orderID;
                orderIDOfDB = existingCart?.orderID;
                personalInfo.orderID = orderID;
                orderData.orderID = orderID;

                result1 = await OrderSchema.findByIdAndUpdate(cusInfo?.cardID, orderData, { new: true });
            }
            else {
                const data = new OrderSchema(orderData);
                result1 = await data.save();
            }
        } else {
            const data = new OrderSchema(orderData);
            result1 = await data.save();
        }


        const existingUser = await CustomerSchema.findOne({
            $and: [
                { email: email },
                { orderID: orderID }
            ]
        });

        if (existingUser) {
            personalInfo.orderID = existingUser?.orderID || orderID;
            const result2 = await CustomerSchema.updateOne({ $and: [{ email: email }, { orderID: orderID }] }, personalInfo, { new: true });
            return NextResponse.json({ message: "Customer added & card created", status: true, data: { result2, result1, orderIDOfDB } })
        }
        else {
            const data2 = new CustomerSchema(personalInfo);
            const result2 = await data2.save();
            return NextResponse.json({ message: "Customer added & card created", status: true, data: { result2, result1, orderIDOfDB } })
        }


    }

    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Customer & card unable to add!", status: false });
    }
    // return NextResponse.json({ message: "Abandoned unable to add!", status: false });
}