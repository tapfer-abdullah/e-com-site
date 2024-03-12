const { default: mongoose } = require("mongoose");

const dateSchema = new mongoose.Schema({
    year: String,
    month: String,
    Day: String
})
const timeSchema = new mongoose.Schema({
    hour: String,
    min: String
})

const orderSchema = new mongoose.Schema({
    orderNumber: String,
    status: String
})


const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    phoneNumber: String,
    country: String,
    city: String,
    address: String,
    apartment: String,
    postalCode: String,
    firstVisitedDate: dateSchema,
    firstVisitedTime: timeSchema,
    about: String,
    orders: [orderSchema]
})


export const CustomerSchema = mongoose.models.allCustomers || mongoose.model("allCustomers", customerSchema);