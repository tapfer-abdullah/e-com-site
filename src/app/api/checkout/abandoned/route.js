import { CustomerSchema } from "@/app/models/customerInfo";
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



const calculateOrderAmount = (items, shipping = 0) => {

    const sum = items.reduce((accumulator, currentItem) => {
        return accumulator + (currentItem.price * currentItem.quantity);
    }, shipping);

    return sum;
};

export const POST = async (request) => {
    function generateRandomOrderNumber() {
        const randomComponent = Math.floor(Math.random() * 10000);
        const timestamp = new Date().getTime();
        const orderNumber = `${timestamp}${randomComponent}`;
        return orderNumber;
    }

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    let orderNumber = generateRandomOrderNumber();



    const { cusInfo, cart, amount } = await request.json();
    // console.log("clicked......", cusInfo)

    let totalAmount = 0;
    if (cusInfo?.discountCode) {
        // to do: discount code validate and calculation 
        totalAmount = amount;
    }
    else {
        totalAmount = calculateOrderAmount(cart, cusInfo?.shipping || 0);
        totalAmount += cusInfo?.tips;
        // console.log({ totalAmount })
    }

    let cartProduct = [];
    cart?.forEach(element => {
        cartProduct.push({ productID: element?.id, sku: element?.sku, quantity: element?.quantity, discountAmount: element?.discountAmount || 0 });
    });

    let orderData = {
        email: cusInfo?.email,
        discountCode: cusInfo?.discountCode || "",
        shipping: cusInfo?.shipping || 0,
        tips: cusInfo?.tips || 0,
        status: "abandoned",
        date: formattedDate,
        time: formattedTime,
        orderNumber: `abn${orderNumber}`,
        cart: cartProduct,
        totalPaid: amount
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
        firstVisitedDate: cusInfo?.formattedDate,
        firstVisitedTime: cusInfo?.formattedTime,
        about: "",
        orders: [{ orderNumber: `abn${orderNumber}`, status: "abandoned" }]
    }

    let orderNumberOfDB = `abn${orderNumber}`;
    try {
        let result1;
        if (cusInfo?.cardID !== 'undefined') {
            const existingCart = await OrderSchema.findById(cusInfo?.cardID).select('-cart');
            if (existingCart) {
                orderNumber = existingCart?.orderNumber;
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


        const existingUser = await CustomerSchema.findOne({ email: cusInfo?.email });
        if (existingUser) {
            personalInfo.firstVisitedDate = existingUser?.formattedDate || cusInfo?.formattedDate;
            personalInfo.firstVisitedTime = existingUser?.formattedTime || cusInfo?.formattedTime;
            personalInfo.about = existingUser?.about || "";

            const result2 = await CustomerSchema.updateOne({ email: cusInfo?.email }, personalInfo, { new: true });
            return NextResponse.json({ message: "Customer added & card created", status: true, data: { result2, result1, orderNumberOfDB } })
        }
        else {
            const data2 = new CustomerSchema(personalInfo);
            const result2 = await data2.save();
            return NextResponse.json({ message: "Customer added & card created", status: true, data: { result2, result1, orderNumberOfDB } })
        }


    }
    // try {
    //     const existingCart = await OrderSchema.findOne({ email: cusInfo?.email }).select('-cart');
    //     if (existingCart) {
    //         orderNumber = existingCart?.orderNumber;
    //         // orderData.date = formattedDate;
    //         // orderData.time = formattedTime;

    //         const result = await OrderSchema.updateOne({ email: cusInfo?.email }, orderData, { new: true })
    //     }
    //     else {
    //         const data = new OrderSchema(orderData);
    //         const result = await data.save();
    //     }


    //     const existingUser = await CustomerSchema.findOne({ email: cusInfo?.email });
    //     if (existingUser) {
    //         personalInfo.firstVisitedDate = existingUser?.formattedDate || cusInfo?.formattedDate;
    //         personalInfo.firstVisitedTime = existingUser?.formattedTime || cusInfo?.formattedTime;
    //         personalInfo.about = existingUser?.about || "";

    //         const result = await CustomerSchema.updateOne({ email: cusInfo?.email }, personalInfo, { new: true });
    //         return NextResponse.json({ message: "Customer added & card created", status: true, data: { result, orderNumberOfDB } })
    //     }
    //     else {
    //         const data2 = new CustomerSchema(personalInfo);
    //         const result2 = await data2.save();
    //         return NextResponse.json({ message: "Customer added & card created", status: true, data: { result2, orderNumberOfDB } })
    //     }


    // }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Customer & card unable to add!", status: false });
    }
    // return NextResponse.json({ message: "Abandoned unable to add!", status: false });
}