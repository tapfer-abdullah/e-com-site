import { TypesSchema } from "@/app/models/types";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    const { id } = params;
    try {
        const data = await TypesSchema.findById(id);
        return NextResponse.json(data)
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Unable to fetch data!", status: false });
    }
}

export const PUT = async (request, { params }) => {
    const { id } = params;
    const newData = await request.json();

    try {
        const result = await TypesSchema.findByIdAndUpdate(id, newData);
        return NextResponse.json({ message: "Updated successfully!", status: true, data: result });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update!", status: false });
    }

}


export const DELETE = async (request, { params }) => {
    const { id } = params;

    try {
        const result = await TypesSchema.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully!", status: true, data: result });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete!", status: false });
    }
}

