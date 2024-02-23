
import { CollectionsSchema } from "@/app/models/collections";
import { TypesSchema } from "@/app/models/types";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request, { params }) => {
    const id = params?.id;

    try {
        const product = await CollectionsSchema.findById(id);
        return NextResponse.json(product);

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
        const type = await CollectionsSchema.findById(id)?.select({ type: 1, _id: 0 });

        if (type?.type == newData?.type) {
            const result = await CollectionsSchema.findByIdAndUpdate(id, newData, { new: true });
            return NextResponse.json({ message: "Updated successfully!", status: true, data: result });
        }
        else {

            const collData = await TypesSchema.findOne({ title: { $regex: new RegExp(type?.type, 'i') } })?.select({ collections: 1, _id: 0 });
            const newTypeArray = collData?.collections.filter(c => c != type?.type);
            //deleting from old type collections
            const resultOfType = await TypesSchema.updateOne({ title: type?.type }, { $set: { collections: newTypeArray } });

            // adding to new type 
            const newCollData = await TypesSchema.findOne({ title: { $regex: new RegExp(newData?.type, 'i') } })?.select({ collections: 1, _id: 0 });
            if (!newCollData?.collections.includes(newData?.type)) {//checking if type is already exist
                const resultOfType2 = await TypesSchema.updateOne({ title: newData?.type }, { $set: { collections: [...newCollData?.collections, newData?.type] } });
            }

            const result = await CollectionsSchema.findByIdAndUpdate(id, newData, { new: true });
            return NextResponse.json({ message: "Updated successfully!", status: true, data: result });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed update!", status: false });
    }
}

export const DELETE = async (request, { params }) => {
    const id = params?.id;

    try {
        const type = await CollectionsSchema.findById(id).select({ type: 1, title: 1, _id: 0 });
        const collData = await TypesSchema.findOne({ title: { $regex: new RegExp(type?.type, 'i') } }).select({ collections: 1, _id: 0 });
        const newTypeArray = collData?.collections.filter(c => c != type?.title);
        const resultOfType = await TypesSchema.updateOne({ title: type?.type }, { $set: { collections: newTypeArray } });

        const result = await CollectionsSchema.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully!", status: true, data: result });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete!", status: false });
    }
}
