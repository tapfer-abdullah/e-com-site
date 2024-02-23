import Image from "next/image";
import React from "react";

const DashboardNavbar = () => {
  return (
    <div className="fixed z-40 w-[83.33%]">
      <div className="bg-[#6AB187] py-3 px-10 flex justify-between items-center ">
        <h1>Admin dashboard</h1>
        <Image src="https://i.ibb.co/VYpHS8P/AK.png" width={40} height={40} alt="img" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};

export default DashboardNavbar;
