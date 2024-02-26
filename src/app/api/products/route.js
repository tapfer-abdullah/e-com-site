import { Products } from "@/app/models/products";
import { NextResponse } from "next/server";
import { parse } from 'url';

const { connectDB } = require("@/app/helper/db");


connectDB();

export const GET = async (request) => {
    const url = request.url;
    const { query } = parse(url, true);

    const searchParams = new URLSearchParams(query);
    const status = searchParams.get('status');
    const priceLevel = searchParams.get('priceLevel');
    const highestSelling = searchParams.get('highestSelling');
    const time = searchParams.get('time');
    const category = searchParams.get('category');
    const title = searchParams.get('title');

    const sortOrder = priceLevel === 'asc' ? 1 : -1;
    let allProducts = [];

    // console.log({ time, highestSelling, priceLevel, status, category });

    try {
        if (title == "yes") {
            allProducts = await Products.find().select({ title: 1, _id: 1, imageUrl: 1 });

        }
        else if (status == null && category == null) {
            allProducts = await Products.find().select("-description");

        }
        else if (status == "All") {
            allProducts = await Products.find({ 'category.label': { $regex: new RegExp(`^${category}$`, 'i') } }).select("-description");

        }
        else if (highestSelling == 'true' && priceLevel) {
            allProducts = await Products.find({
                $and: [
                    {
                        'category.label': { $regex: new RegExp(`^${category}$`, 'i') }
                    },
                    {
                        'status.label': { $regex: new RegExp(`^${status}$`, 'i') }
                    }
                ]
            }).select("-description").sort({ price: sortOrder, sellQuantity: -1 });

        }
        else if (priceLevel) {
            allProducts = await Products.find({
                $and: [
                    {
                        'category.label': { $regex: new RegExp(`^${category}$`, 'i') }
                    },
                    {
                        'status.label': { $regex: new RegExp(`^${status}$`, 'i') }
                    }
                ]
            }).select("-description").sort({ price: sortOrder });

        }
        else if (highestSelling == 'true') {
            allProducts = await Products.find({
                $and: [
                    {
                        'category.label': { $regex: new RegExp(`^${category}$`, 'i') }
                    },
                    {
                        'status.label': { $regex: new RegExp(`^${status}$`, 'i') }
                    }
                ]
            }).select("-description").sort({ sellQuantity: -1 });

        }
        else if (status && category) {
            allProducts = await Products.find({
                $and: [
                    {
                        'category.label': { $regex: new RegExp(`^${category}$`, 'i') }
                    },
                    {
                        'status.label': { $regex: new RegExp(`^${status}$`, 'i') }
                    }
                ]
            }).select("-description");


        }

        if (time == "-1") {
            const reverseProductArray = allProducts.reverse();
            return NextResponse.json(reverseProductArray);
        }
        else {
            return NextResponse.json(allProducts);
        }

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to fetch data!", status: false });
    }
}


export const POST = async (request) => {
    const productData = await request.json();

    try {
        const newProduct = new Products(productData);
        const result = await newProduct.save();
        return NextResponse.json({ message: "Product added successfully", status: true, data: result })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to add product!", status: false });
    }
}
