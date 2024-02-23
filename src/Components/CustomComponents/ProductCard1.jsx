"use client";

import React, { useState } from "react";
import { AiOutlineShopping } from "react-icons/ai";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdOutlineEuroSymbol } from "react-icons/md";

import Link from "next/link";
import "./CustomComponents.css";
import QuickAddToCartModal from "./ProductModals/QuickAddToCartModal";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ProductDetailsModal from "./ProductModals/ProductDetailsModal";

const ProductCard1 = ({ singleProduct }) => {
  const [QuickShop, SetQuickShop] = useState("-top-[1000px]");
  const { imageUrl, price, title, _id, category } = singleProduct;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div>
        <Modal className=" relative" open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={{ border: "none" }} className="bg-transparent w-2/3 mx-auto p-0">
            <ProductDetailsModal singleProduct={singleProduct} handleClose={handleClose} />
          </Box>
        </Modal>
      </div>

      <div className="product-card m-2 space-y-3">
        <div className="Image-cart overflow-hidden relative">
          <Link href={`/Collections/${category[0]?.label.toLowerCase()}/${_id}`} className="image-container transition-all">
            <img src={imageUrl[0]} alt="Product Image1" className="default-image transition-all duration-300" />
            <img src={imageUrl[1]} alt="Product Image2" className="hover-image transition-all duration-700" />
          </Link>
          <div className="flex justify-center">
            <div className="product-details transition-all duration-700">
              <div className="flex justify-center items-center gap-5">
                <AiOutlineShopping
                  onClick={() => {
                    SetQuickShop("top-0");
                  }}
                  title="Add to cart"
                  className="text-3xl bg-white rounded-full p-1 cursor-pointer"
                />
                <HiOutlineViewfinderCircle onClick={handleOpen} title="View Details" className="text-3xl bg-white rounded-full p-1 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className={`absolute z-30 ${QuickShop} transition-all duration-500 left-0 right-0 w-[300px] h-[420px]`}>
            <QuickAddToCartModal singleProduct={singleProduct} QuickShop={QuickShop} SetQuickShop={SetQuickShop}></QuickAddToCartModal>
          </div>
        </div>
        <div className="text-center">
          <Link href={`/Collections/${category[0]?.label.toLowerCase()}/${_id}`}>{title}</Link>
          <p className="flex items-center justify-center gap-1">
            <MdOutlineEuroSymbol />
            <span>{price}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard1;
