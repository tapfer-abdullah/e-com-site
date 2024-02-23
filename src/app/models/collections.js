import mongoose, { Schema } from "mongoose";


export const collectionsSchema = new Schema({
    title: {
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
    type: {
        type: String,
    }
})

export const CollectionsSchema = mongoose.models.allCollections || mongoose.model("allCollections", collectionsSchema);