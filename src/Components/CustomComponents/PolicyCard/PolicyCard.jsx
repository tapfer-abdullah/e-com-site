"use client";

const PolicyCard = ({ title, subTitle, img }) => {
  return (
    <div>
      <div className="space-y-3 text-center my-5 p-10 bg-gray-100 bg-opacity-60 rounded-lg">
        <img src={img} alt="policy img" className="w-[100px] mx-auto hover:scale-110 transition-all duration-300" />
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p>{subTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyCard;
