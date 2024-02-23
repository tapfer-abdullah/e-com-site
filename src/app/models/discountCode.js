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
const optionValueSchema = new mongoose.Schema({
    option: String,
    value: String
})
const optionValueBooleanSchema = new mongoose.Schema({
    option: Boolean,
    value: String
})
const labelValueSchema = new mongoose.Schema({
    label: String,
    value: String
})

const selectOptionSchema = new mongoose.Schema({
    label: String,
    value: String,
    imageUrl: String
})

const optionValueArraySchema = new mongoose.Schema({
    option: String,
    value: [selectOptionSchema]
})


// no 1 2 3 4 
const BxGySchema = new mongoose.Schema({
    Buy: optionValueArraySchema,
    Get: optionValueArraySchema,
    BxGyType: String,
    CusBuyAmount: String,
    CusGetAmount: String,
    DiscountedType: optionValueSchema,
    MaxUser: optionValueBooleanSchema
})
const AOffPSchema = new mongoose.Schema({
    DiscountedType: optionValueSchema,
    ApplyTo: optionValueArraySchema
})
const AOffOSchema = new mongoose.Schema({
    DiscountedType: optionValueSchema,
})
const FSSchema = new mongoose.Schema({
    freeShipping: optionValueArraySchema,
    shippingRate: optionValueBooleanSchema,
})


// additional Data Schema
const additionalDataSchema = new mongoose.Schema({
    BxGy: BxGySchema,
    AOffP: AOffPSchema,
    AOffO: AOffOSchema,
    FS: FSSchema
})

// Discount Schema 
const discountSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product title is required!"]
    },
    discountCodeType: String,
    status: labelValueSchema,
    used: {
        type: Number,
        default: 0
    },
    eligibility: optionValueSchema,
    limitDisOnePerUse: Boolean,
    maxDisCodeUse: optionValueBooleanSchema,
    minPurRequirement: optionValueSchema,
    isEndTime: Boolean,
    startDate: dateSchema,
    EndDate: dateSchema,
    startTime: timeSchema,
    EndTime: timeSchema,
    additionalData: additionalDataSchema

})


export const DiscountSchema = mongoose.models.allDiscountCodes || mongoose.model("allDiscountCodes", discountSchema);