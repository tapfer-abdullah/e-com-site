const { default: mongoose } = require("mongoose");

// const dateSchema = new mongoose.Schema({
//     year: String,
//     month: String,
//     Day: String
// })
// const timeSchema = new mongoose.Schema({
//     hour: String,
//     min: String
// })

const singleCartProduct = new mongoose.Schema({
    productID: {
        required: true,
        type: String,
    },
    sku: {
        required: true,
        type: String,
    },
    quantity: {
        type: Number,
        min: 0
    },
    discountAmount: Number
})

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    discountCode: String,
    shipping: Number,
    tips: {
        type: Number,
        default: 0,
        min: 0
    },
    status: String,
    orderNumber: String,
    date: String,
    time: String,
    cart: [singleCartProduct]
})


export const OrderSchema = mongoose.models.allOrders || mongoose.model("allOrders", orderSchema);