
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
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

export const POST = async (request) => {
    const data = await request.json();
    console.log("clicked......")

    NextResponse.json({ data: "clicked.." });

    // try {
    //     const existingCode = await DiscountSchema.findOne({ title: { $regex: new RegExp(`^${discountData?.title}$`, "i") } }).select('title');
    //     if (existingCode) {
    //         return NextResponse.json({ message: "Discount code already exist. Change the title!", status: false });
    //     }
    //     const data = new DiscountSchema(discountData);
    //     const result = await data.save();
    //     return NextResponse.json({ message: "Discount code created successfully", status: true, data: result })
    // }
    // catch (error) {
    //     console.log(error)
    //     return NextResponse.json({ message: "Failed to create discount code!", status: false });
    // }
}