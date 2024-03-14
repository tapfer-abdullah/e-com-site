import { transporter } from "@/config/nodeMailer";
import { NextResponse } from "next/server";


const htmlData = (data) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact mail from ODBHOOTSTORE</title>
    </head>
    
    <body>
        <div style="padding: 10px;">
            <h2 style="text-align: center;">Contact mail from ODBHOOTSTORE</h2>
            <p style="font-size: medium; font-weight: 600;">Name: <span style="font-weight: 400;">${data.name}</span></p>
            <p style="font-size: medium; font-weight: 600;">Email: <span style="font-weight: 400;">${data.email}</p>
            <p style="font-size: medium; font-weight: 600;">Message: <span style="font-weight: 400;">${data.message}</span></p>
        </div>
    </body>
    
    </html>`;

    return html;
}

export const POST = async (request) => {
    const data = await request.json();
    console.log({ data })

    if (!data.name || !data.email || !data.subject || !data.message) {
        return NextResponse.json({ status: false, message: "Form is incomplete!" });
    }

    // const mailOptions = {
    //     from: process.env.EMAIL_ADDRESS,
    //     to: process.env.EMAIL_ADDRESS
    // }

    const message = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        replyTo: data.email,
        subject: data.subject,
        text: "Contact mail from ODBHOOTSTORE",
        html: htmlData(data),
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

}