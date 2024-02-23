
import { DiscountSchema } from "@/app/models/discountCode";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request, { params }) => {
    const id = params?.id;

    try {
        const discountCode = await DiscountSchema.findById(id);
        return NextResponse.json(discountCode);

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch data!", status: false });
    }
}

export const PUT = async (request, { params }) => {
    const id = params?.id;
    const newData = await request.json();

    try {
        const result = await DiscountSchema.findByIdAndUpdate(id, newData, { new: true });
        return NextResponse.json({ message: "Updated successfully!", status: true, data: result });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed update!", status: false });
    }
}

export const DELETE = async (request, { params }) => {
    const id = params?.id;

    try {
        const result = await DiscountSchema.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully!", status: true, data: result });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete!", status: false });
    }
}
