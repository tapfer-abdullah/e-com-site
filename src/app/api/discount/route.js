import { DiscountSchema } from "@/app/models/discountCode";
import { NextResponse } from "next/server";

const { connectDB } = require("@/app/helper/db");

connectDB();

export const GET = async (request) => {
    try {
        // const result = await DiscountSchema.find().select({ title: 1, _id: 1, used: 1, status: 1 });
        const result = await DiscountSchema.find();
        return NextResponse.json(result)
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to fetch discount codes!", status: false });
    }
}

export const POST = async (request) => {
    const discountData = await request.json();
    // console.log(discountData);

    try {
        const existingCode = await DiscountSchema.findOne({ title: { $regex: new RegExp(`^${discountData?.title}$`, "i") } }).select('title');
        if (existingCode) {
            return NextResponse.json({ message: "Discount code already exist. Change the title!", status: false });
        }
        const data = new DiscountSchema(discountData);
        const result = await data.save();
        return NextResponse.json({ message: "Discount code created successfully", status: true, data: result })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to create discount code!", status: false });
    }
}

// for validate discount code :-> find discount code by name 
export const PATCH = async (request) => {
    const code = await request.json();

    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let hour = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    // for checking exactly same in case insensitive way 
    // `^${code?.title}$`, "i"

    try {
        const result = await DiscountSchema.findOne({ title: { $regex: new RegExp(`^${code?.title}$`, "i") } });
        if (result?.status?.label == "Active") {
            const SD = result?.startDate;
            const ST = result?.startTime;
            const ED = result?.EndDate;
            const ET = result?.EndTime;
            const isEndTime = result?.isEndTime;

            let currentMinutes = ((((day * 24) + hour) * 60) + minutes);
            let startingMinutes = ((((parseInt(SD?.Day) * 24) + parseInt(ST?.hour)) * 60) + parseInt(ST?.min));
            let endingMinutes = ((((parseInt(ED?.Day) * 24) + parseInt(ET?.hour)) * 60) + parseInt(ET?.min));


            if (isEndTime) {
                if (parseInt(SD?.year) > year && year > parseInt(ED?.year)) {
                    return NextResponse.json({ message: "Not usable yet!", status: false });
                }
                else if (parseInt(SD?.year) < year && year < parseInt(ED?.year)) {
                    return NextResponse.json({ data: result, status: true });
                }
                else {
                    if (parseInt(SD?.month) <= month && parseInt(startingMinutes) <= currentMinutes && parseInt(ED?.month) >= month && parseInt(endingMinutes) >= currentMinutes) {

                        return NextResponse.json({ data: result, status: true });
                    }
                    else {
                        return NextResponse.json({ message: "Not usable yet!", status: false });
                    }
                }
            }
            else {
                if (parseInt(SD?.year) > year) {
                    return NextResponse.json({ message: "Not usable yet!", status: false });
                }
                else if (parseInt(SD?.year) < year) {
                    return NextResponse.json({ data: result, status: true });
                }
                else {
                    if (parseInt(SD?.month) < month) {
                        return NextResponse.json({ data: result, status: true });
                    }
                    else if (parseInt(SD?.month) == month && parseInt(startingMinutes) <= currentMinutes) {
                        return NextResponse.json({ data: result, status: true });
                    }
                    else {
                        return NextResponse.json({ message: "Not usable yet!", status: false });
                    }
                }
            }

        }
        else {
            return NextResponse.json({ message: "Invalid discount code!", status: false });
        }
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Invalid discount code!", status: false });
    }
}