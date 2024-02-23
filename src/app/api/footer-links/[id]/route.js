import { PagesSchema } from "@/app/models/pages";
import { NextRequest, NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request, { params }) => {
    const id = params?.id;

    try {
        const result = await PagesSchema.findById(id).select({ content: 1, title: 1, _id: 0 });
        return NextResponse.json(result);
    }
    catch (error) {
        console.log(error);
        return NextRequest.json({ message: "Failed to fetch page content!", status: false });
    }
}