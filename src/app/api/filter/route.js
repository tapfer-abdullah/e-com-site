import { connectDB } from "@/app/helper/db";
import { Products } from "@/app/models/products";
import { TypesSchema } from "@/app/models/types";
import { NextResponse } from "next/server";

connectDB();

export const GET = async (request) => {
    const url = request.url;
    const { query } = parse(url, true);

    const searchParams = new URLSearchParams(query);
    // const status = searchParams.get('status');
    const type = searchParams.get('type');
    console.log(type)

    try {
        const product = await Products.find();
        console.log(product)
        const collections = await TypesSchema.find();
        console.log(collections)
    }
    catch (error) {
        console.log(error)
    }


    return NextResponse.send({ message: "get", status: true })

}