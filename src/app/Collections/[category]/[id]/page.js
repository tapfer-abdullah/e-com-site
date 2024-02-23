"use client"
import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import IDWIseDescriptions from './IDWIseDescriptions';
import IDWiseDetails from './IDWiseDetails';
import IDWiseProduct from './IDWiseProduct';
import RelatedProducts from './RelatedProducts';


const page = () => {
    const pathname = usePathname()
    const resultArray = pathname.split("/").filter(Boolean);

    const [singleProduct, setSingleProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState({});
    const [isLoading, setLoading] = useState(true);

    const [imgIndex, setImgIndex] = useState(0);
    // console.log(singleProduct)

    useEffect(() => {
        setLoading(true);
        axiosHttp.get(`/products/${resultArray[2]}`).then(res => {
            setSingleProduct(res.data);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        setLoading(true);
        axiosHttp.get(`/products?category=${resultArray[1]}&status=Active`).then((res) => {
            setRelatedProducts(res.data);
        });
    }, []);

    const [selectedSize, setSelectedSize] = useState(singleProduct?.size?.[0]?.label || "One Size");
    const [selectedSKU, setSelectedSKU] = useState(singleProduct?.colors?.[imgIndex]?.allSKU?.[0]?.sku);
    const handleSku = (size, imgIndex) => {
        const sku = singleProduct?.colors?.[imgIndex]?.allSKU?.find((s) => s?.size == size);
        setSelectedSKU(sku?.sku);
        // console.log(size, imgIndex, sku)

    };

    // left btn 
    const leftSlider = () => {

        if (imgIndex - 1 < 0) {
            handleSku("S", singleProduct?.colors?.length - 1);
            setImgIndex(singleProduct?.colors?.length - 1);
        }
        else {
            handleSku("S", imgIndex - 1);
            setImgIndex(imgIndex - 1);
        }

    }

    // right btn 
    const rightSlider = () => {

        if (imgIndex + 1 == singleProduct?.colors?.length) {
            handleSku("S", imgIndex + 1);
            setImgIndex(0);
        }
        else {
            handleSku("S", imgIndex + 1);
            setImgIndex(imgIndex + 1);
        }

    }



    if (isLoading) {
        return <div className='pt-[68px] mt-20'>
            <Loader />
        </div>
    }

    return (
        <div className='pt-20 max-w-7xl mx-auto'>
            <div className="text-lg font-semibold flex items-center space-x-1 my-2 p-2 bg-[#e9e9e9]">
                <Link href={"/"}>Home</Link>
                <IoIosArrowForward />
                <Link href={"/Collections"}>Collections</Link>
                <IoIosArrowForward />
                <Link href={`/Collections/${resultArray[1].toLowerCase()}`}>{resultArray[1].toUpperCase()}</Link>
                <IoIosArrowForward />
                <h4>{singleProduct?.title}</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div className="w-full">
                    <IDWiseProduct imageData={singleProduct?.colors} handleSku={handleSku} selectedSize={selectedSize} setImgIndex={setImgIndex} rightSlider={rightSlider} leftSlider={leftSlider} imgIndex={imgIndex} />
                </div>
                <div className="">
                    <IDWiseDetails selectedSize={selectedSize} setSelectedSize={setSelectedSize} handleSku={handleSku} selectedSKU={selectedSKU} singleProduct={singleProduct} setImgIndex={setImgIndex} imgIndex={imgIndex} />
                </div>
            </div>

            <IDWIseDescriptions description={singleProduct?.description} />
            <RelatedProducts title={"Related Products"} allProductsData={relatedProducts} />
            {/* <RelatedProducts title={"Recommended Products"} allProductsData={relatedProducts} /> */}
        </div>
    );
};

export default page;