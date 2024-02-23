import Link from "next/link";
import React from "react";

const Collections = ({ singleCollection }) => {
  return (
    <div>
      <Link href={`/Collections${singleCollection?.url}`} className="relative border-2 flex justify-center overflow-hidden">
        <img src={singleCollection?.img} alt="" className="w-full h-full hover:scale-x-110 transition-all duration-300" />
        <Link href={`/Collections${singleCollection?.url}`} className="p-3 py-1 bg-white absolute bottom-3 m-0">
          {singleCollection?.title}
        </Link>
      </Link>
    </div>
  );
};

export default Collections;
