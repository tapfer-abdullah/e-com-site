import { connectDB } from "@/app/helper/db";
import { DiscountSchema } from "@/app/models/discountCode";
import { Products } from "@/app/models/products";
connectDB();


const DiscountCodeChecker = async (CART) => {
    const { dataForBxGy, shipping, tips, discountCode, email, selectedCountry } = CART;
    // console.log({ dataForBxGy, shipping, tips, discountCode })

    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let hour = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    let valid = false;
    // console.log(discountCode?.discountCodeType, { discountData })

    try {
        const result = await DiscountSchema.findOne({ title: { $regex: new RegExp(`^${discountCode}$`, "i") } });
        // console.log({ result })

        // checking is active/valid or not 
        if (result?.status?.label == "Active") {
            const SD = result?.startDate;
            const ST = result?.startTime;
            const ED = result?.EndDate;
            const ET = result?.EndTime;
            const isEndTime = result?.isEndTime;

            let currentMinutes = ((((day * 24) + hour) * 60) + minutes);
            let startingMinutes = ((((parseInt(SD?.Day) * 24) + parseInt(ST?.hour)) * 60) + parseInt(ST?.min));
            let endingMinutes = ((((parseInt(ED?.Day) * 24) + parseInt(ET?.hour)) * 60) + parseInt(ET?.min));

            // checking is valid this time or not 
            if (isEndTime) {
                if (parseInt(SD?.year) > year && year > parseInt(ED?.year)) {
                    valid = false;
                    return { message: "Not usable yet!", status: false, issue: "time" };
                }
                else if (parseInt(SD?.year) < year && year < parseInt(ED?.year)) {
                    valid = true;
                }
                else {
                    if (parseInt(SD?.month) <= month && parseInt(startingMinutes) <= currentMinutes && parseInt(ED?.month) >= month && parseInt(endingMinutes) >= currentMinutes) {

                        valid = true;
                    }
                    else {
                        valid = false;
                        return { message: "Not usable yet!", status: false, issue: "time" };
                    }
                }
            }
            else {
                if (parseInt(SD?.year) > year) {
                    valid = false;
                    return { message: "Not usable yet!", status: false, issue: "time" };
                }
                else if (parseInt(SD?.year) < year) {
                    valid = true;
                }
                else {
                    if (parseInt(SD?.month) < month) {
                        valid = true;
                    }
                    else if (parseInt(SD?.month) == month && parseInt(startingMinutes) <= currentMinutes) {
                        valid = true;
                    }
                    else {
                        return { message: "Not usable yet!", status: false, issue: "time" };
                    }
                }
            }

        }
        else {
            valid = false;
            return { message: "Invalid discount code!", status: false, issue: "invalid" };
        }

        // after time valid 
        if (valid) {
            const cardLength = dataForBxGy.length;
            //extracting ids from cart
            const allProductIDs = dataForBxGy.map(p => p.id);
            //Getting price form DB
            const allProductData = await Products.find({ _id: { $in: allProductIDs } }).select({ price: 1, _id: 1 });
            let priceObject = {};
            for (let i = 0; i < allProductData.length; i++) {
                priceObject[allProductData[i]._id.toString()] = allProductData[i].price;
            }

            // updating price from database
            for (let i = 0; i < cardLength; i++) {
                let data = dataForBxGy[i];
                if (data.price !== priceObject[data.id]) {
                    data.price = priceObject[data.id];
                }
            }

            // calculating subtotal & quantity 
            const subTotal = dataForBxGy.reduce((sum, currentValue) => {
                return sum + currentValue.price;
            }, 0);
            const quantity = dataForBxGy.reduce((sum, currentValue) => {
                return sum + currentValue.quantity;
            }, 0);

            const eligibilityOption = result?.eligibility.option;
            const eligibilityValue = result?.eligibility.value;
            const limitDisOnePerUse = result?.limitDisOnePerUse;
            const maxDisCodeUseOption = result?.maxDisCodeUse.option;
            const maxDisCodeUseValue = result?.maxDisCodeUseValue;
            const minPurRequirementOption = result?.minPurRequirementOption;
            const minPurRequirementValue = result?.minPurRequirementValue;

            // checking eligibility 
            if (eligibilityOption != "all") {
                // to do
            }

            // checking limitDisOnePerUse: how many time a person can use it
            if (limitDisOnePerUse) {
                if (!email) {
                    return { status: false, message: "Email require!", issue: "email" };
                } else {
                    // to do validate if he/she used the code before
                }
            }

            // How many time a discount code can use 
            if (maxDisCodeUseOption) {
                // to do
            }

            if (minPurRequirementOption != "no") {
                if (minPurRequirementOption == "amount" && parseInt(minPurRequirementValue) > subTotal) {
                    return { status: false, message: `Subtotal must be more than € ${minPurRequirementValue}`, issue: "subTotal" };
                }
                else if (minPurRequirementOption == "items" && parseInt(minPurRequirementValue) > quantity) {
                    return { status: false, message: `Items must be more than ${minPurRequirementValue}`, issue: "items" };
                }
            }


            //****************************************************************************** */
            //------------- providing discount code category wise discount-------------------/
            //******************************************************************************/
            switch (result?.discountCodeType) {
                //******** Buy x Get y ********/
                case "BxGy": {
                    const discountData = result?.additionalData?.BxGy;
                    const BxGyType = discountData.BxGyType;
                    const CusBuyAmount = parseInt(discountData.CusBuyAmount);
                    const CusGetAmount = parseInt(discountData.CusGetAmount);
                    const DiscountedTypeOption = discountData.DiscountedType.option;
                    const DiscountedTypeValue = parseInt(discountData.DiscountedType.value);
                    const MaxUserOption = discountData.MaxUser.option;
                    const MaxUserValue = parseInt(discountData.MaxUser.value);

                    const buyOption = discountData.Buy.option;
                    const buyValue = discountData.Buy.value;
                    const GetOption = discountData.Get.option;
                    const GetValue = discountData.Get.value;

                    // solutions
                    let approvedBuyValues = [];
                    let approvedGetValues = [];

                    let totalProductsID = [];
                    let approvedBuyArray = [];
                    let approvedGetArrayOfIDs = [];
                    let approvedGetArray = [];
                    const totallyUncommonBuy = [];


                    // Approved buy
                    if (buyOption == "category") {
                        buyValue.forEach(item => approvedBuyValues.push(item?.label));
                        dataForBxGy.forEach(product => {
                            if (approvedBuyValues.some(element => element.toLowerCase() === product?.category.toLowerCase())) {
                                approvedBuyArray.push(product);
                                totalProductsID.push(product.id);
                            }
                        })

                    }
                    else {
                        buyValue.forEach(item => approvedBuyValues.push(item?.value));
                        dataForBxGy.forEach(product => {
                            if (approvedBuyValues.some(element => element === product?.id)) {
                                approvedBuyArray.push(product);
                                totalProductsID.push(product.id);
                            }
                        })
                    }

                    // Approved get
                    if (GetOption == "category") {
                        GetValue.forEach(item => approvedGetValues.push(item?.label));
                        dataForBxGy.forEach(product => {
                            if (approvedGetValues.some(element => element.toLowerCase() === product?.category.toLowerCase())) {
                                approvedGetArray.push(product);
                                totalProductsID.push(product.id);
                                approvedGetArrayOfIDs.push(product.id);
                            }
                        })
                    }
                    else {
                        GetValue.forEach(item => approvedGetValues.push(item?.value));
                        dataForBxGy.forEach(product => {
                            if (approvedGetValues.some(element => element === product?.id)) {
                                approvedGetArray.push(product);
                                totalProductsID.push(product.id);
                                approvedGetArrayOfIDs.push(product.id);
                            }
                        })
                    }

                    // common
                    const commonArray = [];
                    const commonArrayOfIDs = [];
                    for (let i = 0; i < approvedBuyArray.length; i++) {
                        for (let j = 0; j < approvedGetArray.length; j++) {
                            if (approvedBuyArray[i].id == approvedGetArray[j].id) {
                                commonArray.push(approvedBuyArray[i]);
                                commonArrayOfIDs.push(approvedBuyArray[i].id);
                                break;
                            }
                        }
                    }

                    // Uncommon 
                    const uncommonBuyArray = [];
                    approvedBuyArray.filter(value => {
                        if (!commonArrayOfIDs.includes(value.id)) {
                            uncommonBuyArray.push(value)
                        }
                    });
                    const uncommonGetArray = [];
                    approvedGetArray.filter(value => {
                        if (!commonArrayOfIDs.includes(value.id)) {
                            uncommonGetArray.push(value)
                        }
                    });


                    // console.log({ CusBuyAmount, CusGetAmount })
                    // console.log({ approvedGetArrayOfIDs })
                    // console.log({ discountCode, totallyUncommonBuy, totalProductsID, CusBuyAmount, CusGetAmount, commonArrayOfIDs })
                    // console.log({ commonArray: commonArray.length, uncommonBuyArray: uncommonBuyArray.length, uncommonGetArray: uncommonGetArray.length, approvedBuyArray: approvedBuyArray.length, approvedGetArray: approvedGetArray.length })


                    // determining free and buy items
                    let free = 0;
                    let buy = 0;
                    let commonQuantity = commonArray.length;
                    let aBuyQuantity = approvedBuyArray.length - commonQuantity;
                    let aGetQuantity = approvedGetArray.length - commonQuantity;


                    // Buy more than get-----------------------------|||->
                    if (CusBuyAmount >= CusGetAmount) {
                        for (let i = 0; i < aGetQuantity; i++) {
                            if ((aBuyQuantity >= CusBuyAmount) && (aGetQuantity >= CusGetAmount)) {
                                free += CusGetAmount;
                                buy += CusBuyAmount;
                                aGetQuantity -= CusGetAmount;
                                aBuyQuantity -= CusBuyAmount;
                            }
                        }

                        // checking for common values 
                        while (commonQuantity) {
                            let commonNeedForBuy = CusBuyAmount - aBuyQuantity;
                            let commonNeedForGet = CusGetAmount - aGetQuantity;

                            if (commonNeedForBuy == 0 && commonNeedForGet == 0 && (commonQuantity >= (CusBuyAmount + aGetQuantity))) {
                                commonQuantity -= (CusBuyAmount + aGetQuantity);
                            }
                            else if (aBuyQuantity >= CusBuyAmount) {
                                if (commonNeedForBuy < 0) {
                                    commonNeedForBuy = 0;
                                    if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                        commonQuantity -= commonNeedForGet;
                                        aBuyQuantity -= CusBuyAmount;
                                        buy += CusBuyAmount;
                                        free += CusGetAmount;
                                    }
                                    else {
                                        commonQuantity -= (commonNeedForGet + commonNeedForBuy);
                                        buy += CusBuyAmount;
                                        free += CusGetAmount;
                                    }
                                }

                            }
                            else if (aGetQuantity >= CusGetAmount) {
                                commonNeedForGet = 0;
                                if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                    commonQuantity -= commonNeedForGet;
                                    aGetQuantity -= CusGetAmount;
                                    buy += CusBuyAmount;
                                    free += CusGetAmount;
                                }
                                else {
                                    commonQuantity -= (commonNeedForGet + commonNeedForBuy);
                                    buy += CusBuyAmount;
                                    free += CusGetAmount;
                                }
                            }
                            else {
                                if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                    commonQuantity -= (commonNeedForGet + commonNeedForBuy);
                                    buy += CusBuyAmount;
                                    free += CusGetAmount;
                                }
                                else {
                                    buy += commonQuantity;
                                    commonQuantity = 0;
                                }
                            }
                        }

                        if ((buy + free) < cardLength) {
                            buy += (cardLength - (buy + free));
                        }
                    }
                    // Get more than buy-----------------------------|||->
                    else {
                        for (let i = 0; i < aBuyQuantity; i++) {

                            if ((aBuyQuantity >= CusBuyAmount) && (aGetQuantity >= CusGetAmount)) {
                                free += CusGetAmount;
                                buy += CusBuyAmount;
                                aGetQuantity -= CusGetAmount;
                                aBuyQuantity -= CusBuyAmount;
                            }
                        }


                        // checking for common values 
                        while (commonQuantity) {
                            let commonNeedForBuy = CusBuyAmount - aBuyQuantity;
                            let commonNeedForGet = CusGetAmount - aGetQuantity;

                            if (commonNeedForBuy == 0 && commonNeedForGet == 0 && (commonQuantity >= (CusBuyAmount + aGetQuantity))) {
                                commonQuantity -= (CusBuyAmount + aGetQuantity);
                            }
                            else if (aBuyQuantity >= CusBuyAmount) {
                                if (commonNeedForBuy < 0) {
                                    commonNeedForBuy = 0;

                                    if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                        commonQuantity -= commonNeedForGet;
                                        aBuyQuantity -= CusBuyAmount;
                                        buy += CusBuyAmount;
                                        free += CusGetAmount;
                                    }
                                    else if (commonQuantity >= (commonNeedForBuy + 1)) {
                                        aBuyQuantity -= CusBuyAmount;
                                        buy += CusBuyAmount;
                                        free += commonQuantity;
                                        commonQuantity = 0;
                                    }

                                }

                            }
                            else if (aGetQuantity >= CusGetAmount) {
                                commonNeedForGet = 0;
                                if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                    commonQuantity -= commonNeedForGet;
                                    aGetQuantity -= CusGetAmount;
                                    buy += CusBuyAmount;
                                    free += CusGetAmount;
                                }
                            }
                            else {
                                if (commonQuantity >= (commonNeedForBuy + commonNeedForGet)) {
                                    commonQuantity -= (commonNeedForGet + commonNeedForBuy);
                                    aGetQuantity = 0;
                                    aBuyQuantity = 0;
                                    buy += CusBuyAmount;
                                    free += CusGetAmount;
                                }
                                else if (commonQuantity >= (commonNeedForBuy + 1)) {
                                    aGetQuantity = 0;
                                    aBuyQuantity = 0;
                                    buy += CusBuyAmount;
                                    free += commonQuantity - CusBuyAmount;
                                    commonQuantity = 0;
                                }
                                else {
                                    buy += commonQuantity;
                                    commonQuantity = 0;
                                }

                            }
                        }

                        // uncommon not remaining 
                        for (let i = 0; i < aBuyQuantity; i++) {
                            if ((aBuyQuantity >= CusBuyAmount) && (aGetQuantity >= 1)) {
                                free += aGetQuantity;
                                buy += CusBuyAmount;
                                aGetQuantity = 0;
                                aBuyQuantity -= CusBuyAmount;
                            }
                        }

                        if (free == 0 && aGetQuantity > 0) {
                            if (aGetQuantity <= CusGetAmount && (aGetQuantity + buy) <= cardLength) {
                                free = aGetQuantity;
                                buy = cardLength - free;
                            }
                        }

                        if ((buy + free) < cardLength) {
                            buy += (cardLength - (buy + free));
                        }
                    }

                    // console.log({ discountCode, aGetQuantity, aBuyQuantity })
                    // console.log({ free, buy });
                    // Adjusting maximum time the discount code can be use in a single order
                    if (MaxUserOption && (free > MaxUserValue)) {
                        let diff = (free - MaxUserValue);
                        free = MaxUserValue;
                        buy += diff;
                    }
                    // console.log({ discountCode })
                    // console.log({ free, buy });

                    // Making the final array with free and buy quantity
                    dataForBxGy.sort((a, b) => a.price - b.price);
                    let freeGiven = 0;
                    let finalArray = [];
                    if (DiscountedTypeOption == "free") {
                        for (let i = 0; i < cardLength; i++) {
                            if (freeGiven < free && approvedGetArrayOfIDs.includes(dataForBxGy[i].id)) {
                                let obj = dataForBxGy[i];
                                obj.discount = obj.price;
                                finalArray.push(obj);
                                freeGiven += 1;
                            }
                            else {
                                let obj = dataForBxGy[i];
                                obj.discount = 0.0;
                                finalArray.push(obj);
                            }
                        }
                    }
                    else if (DiscountedTypeOption == "amount") {
                        for (let i = 0; i < cardLength; i++) {
                            if (freeGiven < free && approvedGetArrayOfIDs.includes(dataForBxGy[i].id)) {
                                let obj = dataForBxGy[i];
                                if (DiscountedTypeValue > obj.price) {
                                    obj.discount = obj.price;
                                }
                                else {
                                    obj.discount = DiscountedTypeValue;
                                }
                                finalArray.push(obj);
                                freeGiven += 1;
                            }
                            else {
                                let obj = dataForBxGy[i];
                                obj.discount = 0.0;
                                finalArray.push(obj);
                            }
                        }
                    }
                    else if (DiscountedTypeOption == "percentage") {
                        for (let i = 0; i < cardLength; i++) {
                            if (freeGiven < free && approvedGetArrayOfIDs.includes(dataForBxGy[i].id)) {
                                let obj = dataForBxGy[i];
                                obj.discount = (obj.price * (DiscountedTypeValue / 100.0)).toFixed(2);
                                finalArray.push(obj);
                                freeGiven += 1;
                            }
                            else {
                                let obj = dataForBxGy[i];
                                obj.discount = 0.0;
                                finalArray.push(obj);
                            }
                        }
                    }

                    // console.log({ finalArray });
                    return { status: true, message: "Discount operation done", data: finalArray, issue: "passed", discountType: "BxGy" };
                }
                //******** Amount off on Products  ********/
                case "AOffP": {
                    const data = result?.additionalData?.AOffP;
                    const DiscountedTypeOption = data.DiscountedType.option;
                    const DiscountedTypeValue = parseInt(data.DiscountedType.value);
                    const ApplyToOption = data?.ApplyTo.option;
                    const ApplyToValue = data?.ApplyTo.value;

                    let eligibleIDsArray = [];
                    if (ApplyToOption == "category") {
                        for (let d of ApplyToValue) {
                            eligibleIDsArray.push(d?.label?.toLowerCase());
                        }
                    } else {
                        for (let d of ApplyToValue) {
                            eligibleIDsArray.push(d?.value);
                        }
                    }

                    let finalArray = [];
                    if (ApplyToOption == "category") {
                        if (DiscountedTypeOption == "Fixed") {
                            for (let i = 0; i < cardLength; i++) {
                                if (eligibleIDsArray.includes(dataForBxGy[i].category.toLowerCase())) {
                                    if (dataForBxGy[i].price < DiscountedTypeValue) {
                                        let obj = dataForBxGy[i];
                                        obj.discount = obj.price;
                                        finalArray.push(obj);
                                    }
                                    else {
                                        let obj = dataForBxGy[i];
                                        obj.discount = DiscountedTypeValue;
                                        finalArray.push(obj);
                                    }

                                }
                                else {
                                    let obj = dataForBxGy[i];
                                    obj.discount = 0.0;
                                    finalArray.push(obj);
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < cardLength; i++) {
                                if (eligibleIDsArray.includes(dataForBxGy[i].id)) {
                                    let obj = dataForBxGy[i];
                                    obj.discount = dataForBxGy[i].price * (DiscountedTypeValue / 100);
                                    finalArray.push(obj);
                                }
                                else {
                                    let obj = dataForBxGy[i];
                                    obj.discount = 0.0;
                                    finalArray.push(obj);
                                }
                            }
                        }
                    }
                    else {
                        if (DiscountedTypeOption == "Fixed") {
                            for (let i = 0; i < cardLength; i++) {
                                if (eligibleIDsArray.includes(dataForBxGy[i].id)) {
                                    if (dataForBxGy[i].price < DiscountedTypeValue) {
                                        let obj = dataForBxGy[i];
                                        obj.discount = obj.price;
                                        finalArray.push(obj);
                                    }
                                    else {
                                        let obj = dataForBxGy[i];
                                        obj.discount = DiscountedTypeValue;
                                        finalArray.push(obj);
                                    }

                                }
                                else {
                                    let obj = dataForBxGy[i];
                                    obj.discount = 0.0;
                                    finalArray.push(obj);
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < cardLength; i++) {
                                if (eligibleIDsArray.includes(dataForBxGy[i].id)) {
                                    let obj = dataForBxGy[i];
                                    obj.discount = dataForBxGy[i].price * (DiscountedTypeValue / 100);
                                    finalArray.push(obj);
                                }
                                else {
                                    let obj = dataForBxGy[i];
                                    obj.discount = 0.0;
                                    finalArray.push(obj);
                                }
                            }
                        }
                    }

                    // let finalArray = [];
                    // if (DiscountedTypeOption == "Fixed") {
                    //     for (let i = 0; i < cardLength; i++) {
                    //         if (eligibleIDsArray.includes(dataForBxGy[i].id)) {
                    //             if (dataForBxGy[i].price < DiscountedTypeValue) {
                    //                 let obj = dataForBxGy[i];
                    //                 obj.discount = obj.price;
                    //                 finalArray.push(obj);
                    //             }
                    //             else {
                    //                 let obj = dataForBxGy[i];
                    //                 obj.discount = DiscountedTypeValue;
                    //                 finalArray.push(obj);
                    //             }

                    //         }
                    //         else {
                    //             let obj = dataForBxGy[i];
                    //             obj.discount = 0.0;
                    //             finalArray.push(obj);
                    //         }
                    //     }
                    // }
                    // else {
                    //     for (let i = 0; i < cardLength; i++) {
                    //         if (eligibleIDsArray.includes(dataForBxGy[i].id)) {
                    //             let obj = dataForBxGy[i];
                    //             obj.discount = dataForBxGy[i].price * (DiscountedTypeValue / 100);
                    //             finalArray.push(obj);
                    //         }
                    //         else {
                    //             let obj = dataForBxGy[i];
                    //             obj.discount = 0.0;
                    //             finalArray.push(obj);
                    //         }
                    //     }
                    // }
                    return { status: true, message: "Discount operation done", data: finalArray, issue: "passed", discountType: "AOffP" };
                }
                //******** Amount off on Order  ********/
                case "AOffO": {
                    let response = {};
                    const data = result?.additionalData?.AOffO.DiscountedType;
                    if (data?.option == "Fixed" || data?.option == "Percentage") {
                        response = { status: true, message: "Discount operation done", data: { type: data?.option, amount: data?.value }, issue: "passed", discountType: "AOffO" };
                    }
                    else {
                        response = { status: false, message: "Unable to perform discount operation", data: {}, issue: "failed", discountType: "AOffO" };
                    }
                    return response;
                }
                //******** Free Shipping  ********/
                case "FS": {
                    const data = result?.additionalData?.FS;
                    const shippingRateOption = data?.shippingRate?.option;
                    const shippingRateValue = parseInt(data?.shippingRate?.value);

                    if (data?.freeShipping?.option == "all")
                        return { status: true, message: `Congratulation! You got free shipping.`, data: {}, issue: "passed", discountType: "FS" };

                    if (shippingRateOption && (subTotal <= shippingRateValue)) {
                        return { status: false, message: `Spend at least €${shippingRateValue} to receive free shipping`, data: {}, issue: "failed", discountType: "FS" };
                    }

                    if (data?.freeShipping?.option == "specific") {
                        if (!selectedCountry) {
                            return { status: false, message: `Country is required for "${discountCode}" discount code.`, data: {}, issue: "!country", discountType: "FS" };
                        }
                        else {
                            let isFree = 0;
                            for (let country of data?.freeShipping?.value) {
                                if (selectedCountry?.label == country?.label) {
                                    isFree++;
                                    break;
                                }
                            }

                            if (isFree > 0) {
                                return { status: true, message: `Congratulation! You got free shipping.`, data: {}, issue: "passed", discountType: "FS" };

                            } else {
                                return { status: false, message: `Free shipping is not available in your country!`, data: {}, issue: "failed", discountType: "FS" };
                            }
                        }
                    }
                    else {
                        return { status: true, message: `Congratulation! You got free shipping.`, data: {}, issue: "passed", discountType: "FS" };
                    }
                }
            }
        }
        else {
            return { message: "Invalid discount code!", status: false, issue: "invalid" };
        }
    }
    catch (error) {
        console.log(error)
        return { message: "Unable to process your request", status: false, issue: "invalid", message: error };
    }
};

export default DiscountCodeChecker;