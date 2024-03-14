import { transporter } from "@/config/nodeMailer";
import { NextResponse } from "next/server";



function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

const htmlData = (cart, shipping, tips) => {
    let emailContent = `
        <h2>Thank you for your order!</h2>
        <p>Items:</p>
        <div>
    `;

    cart.forEach(item => {
        emailContent += `
            <div
            style="width: 100%; max-width: 800px; display: flex; align-items: center; justify-content: start; margin: 5px auto;">
            <img src="${item.img}" alt="${item.name}" style="max-width: 100px; height: auto;">
            <div
                style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin: 5px 0px;">
                <div style="margin: 0 5px;">
                    <p>Name: ${item.name}</p>
                    <p>Price: $${item.price}</p>
                </div>
                <div style="margin: 0 5px;">
                    <p>Color: ${item.color}</p>
                    <p>Size: ${item.size}</p>
                </div>
                <div style="margin: 0 5px;">
                    <p>Quantity: ${item.quantity}</p>
                    <p>SKU: ${item.sku}</p>
                </div>
            </div>
        </div>
        `;
    });

    const totalPrice = calculateTotal(cart);

    emailContent += `
        </div>
        <p>Sub total: $${totalPrice}</p>
        <p>Tips: $${tips}</p>
        <p>Shipping: $${totalPrice + shipping + tips}</p>
        <p>Total Price: $${totalPrice + shipping + tips}</p>
    `;

    return emailContent;
}




export const POST = async (request) => {
    const { dataForBxGy, shipping, tips } = await request.json();
    console.log({ dataForBxGy })

    const message = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        // replyTo: data.email,
        subject: "Thanks for your order",
        text: "Order confirmation mail from ODBHOOTSTORE",
        html: htmlData(dataForBxGy, shipping, tips),
    };

    try {
        const result = await transporter.sendMail(message);
        console.log({ result });
        return NextResponse.json({ status: true, message: "Mail sended successfully", data: result });
    }
    catch (error) {
        console.log({ error })
        return NextResponse.json({ status: true, message: "Unable to send mail", data: error });
    }
    return NextResponse.json({ status: true, message: "Unable to send mail", data: "error" });

}