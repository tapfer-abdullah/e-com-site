import React from "react";

const DProductsCards = ({ title, amount }) => {
  return (
    <div>
      <div className="bg-white shadow-lg text-center rounded-lg">
        <div className="bg-blue-800 text-white text-3xl font-semibold p-5 rounded-t-lg">
          <p>{amount}</p>
        </div>

        <p className="px-5 py-2 text-lg font-semibold">{title}</p>
      </div>
    </div>
  );
};

export default DProductsCards;
