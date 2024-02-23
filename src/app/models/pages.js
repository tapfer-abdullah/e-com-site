import mongoose, { Schema } from "mongoose";

const pagesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        default: "/"
    },
    visibility: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    column: {
        type: String,
        default: "none"
    },
    content: {
        type: String,
        required: true
    }
})

export const PagesSchema = mongoose.models.allPages || mongoose.model("allPages", pagesSchema);