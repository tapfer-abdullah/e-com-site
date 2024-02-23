import { PagesSchema } from "@/app/models/pages";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
    try {
        const result = await PagesSchema.find({
            $and: [
                {
                    position: { $regex: new RegExp("Header", "i") },
                    visibility: { $regex: new RegExp("Visible", "i") }
                }
            ]
        }).select({ title: 1, url: 1, _id: 1 });

        return NextResponse.json(result);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch pages data!", status: false });
    }

}