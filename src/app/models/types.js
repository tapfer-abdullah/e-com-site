import mongoose, { Schema } from "mongoose";

export const typesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    collections: [String]
})


export const TypesSchema = mongoose.models.allTypes || mongoose.model("allTypes", typesSchema);