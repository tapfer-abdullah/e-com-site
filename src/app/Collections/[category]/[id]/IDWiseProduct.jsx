import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const IDWiseProduct = ({ imageData, rightSlider, leftSlider, imgIndex, setImgIndex, handleSku, selectedSize }) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-2 top-[50%]">
          <IoIosArrowDropleft
            className={`${imageData?.length < 2 ? "hidden" : ""} text-white font-semibold text-4xl cursor-pointer hover:text-black hover:bg-white rounded-full transition-all duration-300`}
            onClick={leftSlider}
          />
        </div>
        <div>
          <img src={imageData?.[imgIndex]?.imageUrl} alt="img" className="!h-[400px] !w-full" />
        </div>
        <div className="absolute right-2 top-[50%]">
          <IoIosArrowDropright
            className={`${imageData?.length < 2 ? "hidden" : ""} text-white font-semibold text-4xl cursor-pointer hover:text-black hover:bg-white rounded-full transition-all duration-300`}
            onClick={rightSlider}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {imageData?.map((i, index) => (
          <img
            onClick={() => {
              setImgIndex(index);
              handleSku(selectedSize, index);
            }}
            src={i?.imageUrl}
            alt="slide img"
            className={`w-20 h-20 cursor-pointer border-[3px] p-[1px] ${index == imgIndex ? " border-black" : "border-white"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default IDWiseProduct;
