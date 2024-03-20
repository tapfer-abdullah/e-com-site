import DiscountCodeChecker from "@/Hooks/DiscountCodeChecker/DiscountCodeChecker";
import { DiscountSchema } from "@/app/models/discountCode";
import { Products } from "@/app/models/products";
import { transporter } from "@/config/nodeMailer";
import { NextResponse } from "next/server";



function calculateTotal(cart) {
    return cart.reduce((total, item) => total + ((item.price - item.discount) * item.quantity), 0);
}
function calculateSubTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// const htmlData = (cart, shipping, tips) => {
const htmlData = (cart, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract) => {
    let emailContent = ``;
    // emailContent += `<!DOCTYPE html>
    // <html lang="en">

    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Contact mail from ODBHOOTSTORE</title>
    // </head>
    // <body>`;

    emailContent += `<div style="width: 99%; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p style="font-size: 20px; font-weight:600;">Order Summary</p>
    `;

    cart.forEach(item => {
        emailContent += `
        
<div style="width:100%; margin: 5px auto; border-bottom: 1px solid #A0AEC0; padding:12px 5px;">
    <table style="width:100%;" cellspacing="0" cellpadding="0">
        <tr style="vertical-align: middle;">
            <td style="vertical-align: middle; padding-right: 10px;">
                <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 80px; border: 1px solid #A0AEC0; border-radius: 0.375rem;">
            </td>
            <td style="width: 100%; vertical-align: middle;">
                    <p style="font-weight: bold; padding: 3px; margin: 0;">${item.name} x ${item.quantity}</p>
                    <p style="padding: 3px; margin: 0;">${item.color} / ${item.size}</p>
                    ${item.discount > 0 ? `
                        <div style="padding: 3px; margin: 0; font-size: 16px; font-weight: normal; color: #9c9c9c;">
                            <img src="https://i.ibb.co/bNgKp1R/tag.png" alt="discount icon" style="padding:0; margin: 0; height: 15px;  margin-right: 5px; opacity: 60%";/>
                            <span style="text-transform: uppercase;">${discountCode}</span>
                            <span>${item.discount !== item.price ? `(- €${(item.discount * item.quantity).toFixed(2)})` : `(Free)`}</span>
                        </div>` : ''
            }
            </td>
            <td style="width: 100%; vertical-align: middle;">
                <div style="text-align: right; padding: 3px; margin: 0">
                    ${item.discount > 0 ? `
                    <p style="text-decoration: line-through; color: #ff0000;  white-space: nowrap; padding: 2px 0; margin: 0;">€ ${item.price.toFixed(2)}</p>
                     ${item.discount !== item.price ? `<p style="white-space: nowrap; padding: 0; margin: 0; font-weight: bold;">€ ${((item.price - item.discount) * item.quantity).toFixed(2)}</p>` : `<p style="color: #34D399;">Free</p>`}`
                :
                `<p style="text-align: right; white-space: nowrap; padding: 0; margin: 0; font-weight: bold;">€ ${item.price * item.quantity}</p>`
            }
                </div>
            </td>
        </tr>
    </table>
</div>

        `;
    });

    const totalPrice = calculateTotal(cart);
    const subtotal = calculateSubTotal(cart);

    emailContent += `
            <div style="max-width: 300px; margin-left: auto; margin-top:10px;">
            <table style="width:100%;" cellspacing="0" cellpadding="0">
                <tr style="vertical-align: middle;">
                    <td style="text-align: left;">SUBTOTAL:</td>
                    <td style="text-align: right;">
                        <p style="padding: 3px; margin: 0;">€ ${subtotal}</p>
                    </td>
                </tr>
                <tr style="vertical-align: middle;">
                    <td style="text-align: left;">Shipping:</td>
                    <td style="text-align: right;">`;

    if (disAdditionalType == "FS" && shipping == moneyToBeSubtract) {
        emailContent += `<p style="text-decoration: line-through; color: #EF4444; font-weight: 500; padding: 2px; margin: 0">€ ${shipping}</p>
                         <p style="color: #34D399; font-weight: 500;">Free</p>
                    </td>`
    }
    else {
        emailContent += `
            <p style="text-align: right; padding: 3px; margin: 0">€ ${shipping}</p>
        </td>`
    }

    emailContent += `</tr>`


    if (tips > 0) {
        emailContent += `<tr style="vertical-align: middle;">
                            <td style="text-align: left;">Tips:</td>
                            <td style="width:100%; text-align: right;">
                                <p style="padding: 3px; margin: 0;">€ ${tips}</p>
                            </td>
                        </tr>`
    }
    if (discountCode) {
        emailContent += `<tr style="text-align: right; vertical-align: middle;">
                            <td style="text-align: left; color: #9c9c9c;">
                            <img src="https://i.ibb.co/bNgKp1R/tag.png" alt="discount icon" style="padding:0; margin: 0; height: 15px;  margin-right: 5px; opacity: 60%";/>
                            <span style="text-transform: uppercase;">${discountCode}:</span>
                            </td>
                            <td style="text-align: right; font-weight: 500;">`


        if (disAdditionalType == "FS") {
            emailContent += `<p style="padding: 3px; margin: 0;">- € ${shipping}</p>
                            </td>
                        </tr>`
        }
        else {
            emailContent += `<p style="padding: 3px; margin: 0;">- € ${subtotal - totalPrice}</p>
                            </td>
                        </tr> </table>`
        }
    }

    emailContent += `<p style="border-bottom: 2px solid #A0AEC0; padding: 10px 0; margin: 0;"></p>
    <table>
    <tr style="font-size: 1.25rem; font-weight: bold; vertical-align: middle;">
                        <td style="text-align: left;">Total:</td>
                        <td style="width:100%; text-align: right;">
                            <p style="padding: 3px; margin: 0;">€ `

    if (disAdditionalType == "FS") {
        emailContent += `${totalPrice + tips}</p></td>
        </tr>` }
    else {
        emailContent += `${totalPrice - moneyToBeSubtract + tips + shipping}</p></td>
        </tr>` }

    emailContent += `
    </table>
            </div >
            `;

    return emailContent;
}




const resultOfDiscountCode = (response, shipping, dataForBxGy) => {
    // console.log({ response });
    let disAdditionalType = response?.discountType;

    if (response.issue == "invalid") {
        return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
    }

    switch (response?.discountType) {
        case "BxGy": {
            if (response?.issue == "passed") {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: true };
            } else {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "AOffP": {
            if (response?.issue == "passed") {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: true };
            } else {
                return { data: response.data, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "AOffO": {
            if (response?.issue == "passed") {
                if (response.data.type == "Percentage") {
                    let moneyToBeSubtract = subTotal * (parseInt(response.data.amount) / 100);
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract, isDiscounted: true };
                }
                else if (response.data.type == "Fixed") {
                    let moneyToBeSubtract = parseInt(response.data.amount);
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract, isDiscounted: true };
                }
                else {
                    return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
                }
            }
            else {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
        case "FS": {
            if (response?.issue == "passed") {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: shipping, isDiscounted: true };
            }
            else {
                return { data: dataForBxGy, disAdditionalType, moneyToBeSubtract: 0.0, isDiscounted: false };
            }
            break;
        }
    }

}


export const POST = async (request) => {
    // const { dataForBxGy, shipping, tips } = await request.json();
    // const { data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract } = await request.json();

    // const message = {
    //     from: process.env.EMAIL_ADDRESS,
    //     to: process.env.EMAIL_ADDRESS,
    //     // replyTo: data.email,
    //     subject: "Thanks for your order",
    //     text: "Order confirmation mail from ODBHOOTSTORE",
    //     html: htmlData(dataForBxGy, shipping, tips),
    //     html: htmlData(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract),
    // };

    // try {
    //     const result = await transporter.sendMail(message);
    //     console.log({ result });
    //     return NextResponse.json({ status: true, message: "Mail sended successfully", data: result });
    // }
    // catch (error) {
    //     console.log({ error })
    //     return NextResponse.json({ status: false, message: "Unable to send mail", data: error });
    // }


    // return NextResponse.json({ status: false, message: "Unable to send mail", data: "error" });


    const receivedData = await request.json();
    const { dataForBxGy, shipping, tips, discountCode, email, selectedCountry } = receivedData;
    // console.log({ receivedData })

    let disAdditionalType = "";
    let isDiscounted = false;
    let moneyToBeSubtract = 0;
    let data = dataForBxGy;
    let htmlDataForMail = '';

    if (discountCode) {
        const response = await DiscountCodeChecker(receivedData);
        const result = resultOfDiscountCode(response, shipping, dataForBxGy);

        disAdditionalType = result.disAdditionalType;
        isDiscounted = result.isDiscounted;
        moneyToBeSubtract = result?.moneyToBeSubtract || 0;
        data = result.data;

        htmlDataForMail = htmlData(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);

    }
    else {
        //extracting ids from cart
        const allProductIDs = data.map(p => p.id);
        //Getting price form DB
        const allProductData = await Products.find({ _id: { $in: allProductIDs } }).select({ price: 1, _id: 1 });
        let priceObject = {};
        for (let i = 0; i < allProductData.length; i++) {
            priceObject[allProductData[i]._id.toString()] = allProductData[i].price;
        }

        // updating price from database
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            if (d.price !== priceObject[d.id]) {
                d.price = priceObject[d.id];
            }
        }
        htmlDataForMail = htmlData(data, shipping, tips, discountCode, disAdditionalType, moneyToBeSubtract);
    }

    // return NextResponse.json({ htmlDataForMail });


    const message = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        // replyTo: data.email,
        subject: "Thanks for your order",
        text: "Order confirmation mail from ODBHOOTSTORE",
        html: htmlDataForMail,
    };

    try {
        const result = await transporter.sendMail(message);
        console.log({ result });
        return NextResponse.json({ status: true, message: "Mail sended successfully", data: result });
    }
    catch (error) {
        console.log({ error })
        return NextResponse.json({ status: false, message: "Unable to send mail", data: error });
    }

    // return NextResponse.json({ status: false, message: "Unable to send mail", data: "error" });

}