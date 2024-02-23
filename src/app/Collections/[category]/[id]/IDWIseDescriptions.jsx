import React from "react";
import ReactHtmlParser from "react-html-parser";

const IDWIseDescriptions = ({ description }) => {
  return (
    <div className="my-10">
      <div className="flex mb-5">
        <h4 className="text-lg font-bold border-2 py-2 px-4 inline-block border-b-0">Product Details</h4>
        <div className="border-b-2 flex-grow"></div>
      </div>

      <p>{ReactHtmlParser(description)} </p>
    </div>
  );
};

export default IDWIseDescriptions;
