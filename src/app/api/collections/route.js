import { CollectionsSchema } from "@/app/models/collections";
import { TypesSchema } from "@/app/models/types";
import { NextResponse } from "next/server";
import { parse } from 'url';
const { connectDB } = require("@/app/helper/db");


connectDB();

export const GET = async (request) => {
    const url = request?.url;
    const { query } = parse(url, true);

    const searchParams = new URLSearchParams(query);
    const type = searchParams.get('type');
    const imgUrl = searchParams.get('imgUrl');

    try {

        if (imgUrl) {
            const collections = await CollectionsSchema.find({ title: { $regex: new RegExp(imgUrl, "i") } }).select({ title: 1, img: 1, _id: 0 });
            return NextResponse.json(collections)
        }
        else if (type) {
            const collections = await CollectionsSchema.find({ type: type });
            return NextResponse.json(collections)
        }

        const collections = await CollectionsSchema.find();
        return NextResponse.json(collections)
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch type!", status: false });
    }
}

export const POST = async (request) => {
    const data = await request.json();
    const { type } = data;

    const typeData = await TypesSchema.findOne({ title: { $regex: new RegExp(type, 'i') } }).select("collections");
    const collData = await CollectionsSchema.findOne({ title: { $regex: new RegExp(data?.title, 'i') } }).select('title');

    if (collData) {
        return NextResponse.json({ message: "Collection already exist!", status: false });
    }

    try {
        const updatedCollection = [...typeData?.collections, data?.title];
        const resultOfType = await TypesSchema.updateOne({ title: type }, { $set: { collections: updatedCollection } });

        const newCollection = new CollectionsSchema(data);
        const result = await newCollection.save();
        return NextResponse.json({ message: "Collection created successfully", status: true, data: result })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to create collection!", status: false });
    }
}

