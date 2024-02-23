import { connectDB } from "@/app/helper/db";
import { PagesSchema } from "@/app/models/pages";
import { NextResponse } from "next/server";

connectDB();

export const GET = async (request, { params }) => {
    const url = params?.url;

    try {
        const page = await PagesSchema.findOne({ url: { $regex: new RegExp(url, "i") } });
        return NextResponse.json(page);

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch data!", status: false });
    }
}

export const PUT = async (request, { params }) => {
    const id = params?.url;
    const newData = await request.json();

    try {
        const result = await PagesSchema.findByIdAndUpdate(id, newData, { new: true });
        return NextResponse.json({ message: "Updated Successfully!", status: true, data: result });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update page data!", status: false });
    }
}


export const DELETE = async (request, { params }) => {
    const id = params?.url;

    try {
        const result = await PagesSchema.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted Successfully!", status: true, data: result });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete page!", status: false });
    }
}