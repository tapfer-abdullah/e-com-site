import { OrderStateProvider } from "@/Components/State/OrderState";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { MdOutlineEuroSymbol } from "react-icons/md";

const IDWiseDetails = ({ singleProduct, selectedSKU, imgIndex, setImgIndex, handleSku, selectedSize, setSelectedSize }) => {
  const { title, price, comparePrice, size, colors } = singleProduct || {};
  const [sizes, setSize] = React.useState(0);

  const { changeCartData, setChangeCartData } = useContext(OrderStateProvider);

  const handleSize = (event, newSize) => {
    setSize(newSize);
  };
  const [selectedItems, setSelectedItems] = useState(1);

  const handleAddToCart = (id) => {
    let selectedColor = singleProduct?.colors?.[imgIndex]?.name;
    let sku = selectedSKU || singleProduct?.colors?.[0]?.allSKU?.[0]?.sku;
    let img = colors?.[imgIndex]?.imageUrl;

    const data = {
      id: id,
      name: singleProduct?.title,
      category: singleProduct?.category?.[0]?.value,
      price: price,
      color: selectedColor,
      size: selectedSize,
      quantity: selectedItems,
      sku: sku,
      img: img,
    };

    let storedData = JSON.parse(localStorage.getItem("obs-cart")) || [];
    let storedDataXY = JSON.parse(localStorage.getItem("obs-cart-xy")) || [];
    const newDataXY = [...storedDataXY, data];
    localStorage.setItem("obs-cart-xy", [JSON.stringify(newDataXY)]);

    if (storedData.length > 0) {
      let newData = [];
      let item = 0;

      for (let i = 0; i < storedData.length; i++) {
        if (storedData?.[i]?.id == id && storedData?.[i]?.size == data.size && storedData?.[i]?.color == data.color) {
          item++;
          newData.push({
            id: id,
            name: singleProduct?.title,
            category: singleProduct?.category?.[0]?.value,
            price: price,
            color: selectedColor,
            size: selectedSize,
            quantity: selectedItems,
            sku: sku,
            img: img,
          });
        } else {
          newData.push(storedData[i]);
        }
      }

      if (item == 0) {
        newData.push(data);
        localStorage.setItem("obs-cart", [JSON.stringify(newData)]);
      } else {
        localStorage.setItem("obs-cart", [JSON.stringify(newData)]);
      }
    } else {
      storedData.push(data);
      localStorage.setItem("obs-cart", [JSON.stringify(storedData)]);
    }

    setChangeCartData(changeCartData + 1);
  };

  return (
    <div>
      <div className="details-modal-content space-y-5 p-3">
        <div>
          <Link href={"/"} className="uppercase font-medium">
            Odbhootstore
          </Link>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-green-500">In Stock</span>
          <span>Type: {singleProduct?.type ? singleProduct?.type[0]?.label : ""}</span>
          <span>SKU: {selectedSKU || singleProduct?.colors?.[0]?.allSKU?.[0]?.sku}</span>
        </div>
        {/* <div className="flex justify-between items-center"> */}
        <div className="space-y-3">
          <div className="text-2xl font-bold flex items-center justify-start gap-1">
            <MdOutlineEuroSymbol />
            <span>{price}</span>
            <small className=" line-through">{comparePrice}</small>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-start text-lg text-black font-medium gap-2">
              <h2>Colors:</h2>
              <h2>{singleProduct?.colors?.[imgIndex]?.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {singleProduct?.colors?.map((color, index) => (
                <div
                  key={color._id}
                  onClick={() => {
                    setImgIndex(index);
                    handleSku(selectedSize, index);
                  }}
                  className={`border-[3px] p-[1px] ${index == imgIndex ? " border-black" : "border-white"}`}
                >
                  <img src={color?.imageUrl} className="w-10 h-10 cursor-pointer" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold w-full">Size: {selectedSize}</p>

          <ToggleButtonGroup
            value={sizes}
            exclusive
            onChange={() => {
              handleSize();
            }}
            aria-label="sizes"
            className="w-full flex-wrap"
          >
            {size?.map((s) => (
              <ToggleButton
                key={s?._id}
                onClick={(e) => {
                  setSelectedSize(e.target.value);
                  handleSku(e.target.value, imgIndex);
                }}
                className={`${s?.label === selectedSize ? "!bg-black !text-white" : "!bg-white !text-black"} !px-4 !py-2   !text-lg !font-medium !w-auto border !border-2`}
                value={s?.label}
                aria-label={s?.label}
              >
                {s?.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xl font-bold mt-10">
            <div className="text-xl font-bold">
              <button
                onClick={() => {
                  if (selectedItems != 1) {
                    setSelectedItems(selectedItems - 1);
                  }
                }}
                className="py-2 px-5 bg-slate-300 mx-[1px]"
              >
                -
              </button>
              <button className="py-2 px-5 bg-slate-100 mx-[1px]">{selectedItems}</button>
              <button
                onClick={() => {
                  setSelectedItems(selectedItems + 1);
                }}
                className="py-2 px-5 bg-slate-300 mx-[1px]"
              >
                +
              </button>
            </div>
            <div className="flex-grow">
              <button
                onClick={() => handleAddToCart(singleProduct?._id)}
                className="py-2 px-5 bg-black text-white hover:bg-[#363634] transition-all duration-300 hover:shadow-lg mx-[1px] uppercase w-full"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={"/checkout"} className="block text-center py-2 px-5 bg-[#FFC520] hover:bg-[#ffd558] transition-all duration-300 hover:shadow-md text-black mx-[1px] w-full font-bold uppercase">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IDWiseDetails;
