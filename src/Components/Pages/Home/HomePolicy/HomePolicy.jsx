"use client";
import PolicyCard from "@/Components/CustomComponents/PolicyCard/PolicyCard";
import React from "react";

const HomePolicy = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
      <PolicyCard title={"FREE SHIPPING"} subTitle={"Free shipping on all orders"} img={"https://i.ibb.co/tLQNdCz/Eiffel-Tower-Day-1200x834.jpg"} />
      <PolicyCard title={"FREE SHIPPING"} subTitle={"Free shipping on all orders"} img={"https://i.ibb.co/tLQNdCz/Eiffel-Tower-Day-1200x834.jpg"} />
      <PolicyCard title={"FREE SHIPPING"} subTitle={"Free shipping on all orders"} img={"https://i.ibb.co/tLQNdCz/Eiffel-Tower-Day-1200x834.jpg"} />
      <PolicyCard title={"FREE SHIPPING"} subTitle={"Free shipping on all orders"} img={"https://i.ibb.co/tLQNdCz/Eiffel-Tower-Day-1200x834.jpg"} />
    </div>
  );
};

export default HomePolicy;
