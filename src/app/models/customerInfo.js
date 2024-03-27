const { default: mongoose } = require("mongoose");


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
    about: String,
    orderID: String
})


export const CustomerSchema = mongoose.models.allCustomers || mongoose.model("allCustomers", customerSchema);