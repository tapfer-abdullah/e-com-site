"use client";
import { axiosHttp } from "@/app/helper/axiosHttp";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";

const ContactPage = () => {
  const [sending, setSending] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const data = { name, email, subject, message };
    const response = await axiosHttp.post("/contact", data);

    if (response.data?.status) {
      toast.success("Message sended successfully!");
      form.reset();
      setSending(false);
    }
  };

  return (
    <div className="pt-[68px] max-w-7xl mx-auto min-h-[70vh]">
      <div className="lg:grid grid-cols-12 p-5 gap-14 items-start">
        <div className="col-span-6 col-start-1 p-5">
          <div>
            <h1 className="text-2xl font-semibold mb-3 mt-1">Get In Touch With Us</h1>
            <p>Here are Us contract Information. Feel free to contract with us or send message by this contract form.</p>
          </div>

          <div className="mt-10 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-700 p-3 text-white rounded-lg">
                <FaLocationDot className="text-5xl" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Our Location</h3>
                <p>
                  2 FREDERICK STREETKINGS CROSS <br />
                  LONDON
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-blue-700 p-3 text-white rounded-lg">
                <FaPhoneVolume className="text-5xl" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Phone Number</h3>
                <p>0123333454565</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-blue-700 p-3 text-white rounded-lg">
                <MdOutlineMail className="text-5xl" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Email Address</h3>
                <p>contact.odbhootstore@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-blue-700 p-3 text-white rounded-lg">
                <LuInstagram className="text-5xl" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Stay Connected</h3>
                <p className="font-semibold pb-[2px]">@odbhootstore</p>
                <p>DM Us for any query</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 col-start-7 p-5">
          <h1 className="text-2xl font-semibold my-1">Contact Us</h1>
          <p>Have a question but are not sure who to contact? Get in touch and a member of our team will reach out to you.</p>
          <form onSubmit={handleSendEmail}>
            <input required placeholder="Your Name" className="border border-blue-500 w-full p-2 rounded-lg my-3 outline-1 outline-blue-500" type="text" name="name" id="name" />
            <input required placeholder="Your Email" className="border border-blue-500 w-full p-2 rounded-lg my-3 outline-1 outline-blue-500" type="email" name="email" id="email" />
            <input required placeholder="Subject" className="border border-blue-500 w-full p-2 rounded-lg my-3 outline-1 outline-blue-500" type="text" name="subject" id="subject" />
            <textarea required placeholder="Your Message" className="border border-blue-500 w-full p-2 rounded-lg my-3 outline-1 outline-blue-500" name="message" id="message" rows="5"></textarea>
            <input
              disabled={sending}
              className={`${sending && "bg-opacity-50"} text-lg font-semibold text-white border bg-blue-600 w-full p-2 rounded-lg hover:bg-blue-500 cursor-pointer transition-all duration-300`}
              type="submit"
              value={sending ? "Sending..." : "Send Message"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
