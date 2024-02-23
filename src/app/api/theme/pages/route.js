import { PagesSchema } from "@/app/models/pages";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
    try {
        const result = await PagesSchema.find().select("-content");
        return NextResponse.json(result)
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to fetch pages!", status: false });
    }
}

export const POST = async (request) => {
    const pageData = await request.json();
    // console.log(pageData);

    try {
        const existingPage = await PagesSchema.findOne({ title: { $regex: new RegExp(pageData?.title, 'i') } }).select('title');
        if (existingPage) {
            return NextResponse.json({ message: "Page already exist. Change the title!", status: false });
        }
        const data = new PagesSchema(pageData);
        const result = await data.save();
        return NextResponse.json({ message: "pages created successfully", status: true, data: result })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to create pages!", status: false });
    }
}