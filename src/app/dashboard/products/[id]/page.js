"use client"
import { TextField, accordionSummaryClasses } from '@mui/material';

import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { IoIosArrowForward } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { RiImageEditLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import "./../add/AddProduct.css";




const sizes = [
    { value: "One Size", label: "One Size" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" }
]

const colors = [
    { value: "Default-color", label: "Default-color" },
    { value: "red", label: "Red" },
    { value: "Gold", label: "Gold" },
    { value: "Rose-Gold", label: "Rose-Gold" },
    { value: "Silver", label: "Silver" },
    { value: "Pink", label: "Pink" },
    { value: "Black", label: "Black" }
]

const status = [
    { value: "Active", label: "Active" },
    { value: "Draft", label: "Draft" }
]

const page = () => {
    const editor = useRef(null);
    const [singleProductData, setSingleProductData] = useState({});
    const [content, setContent] = useState('');
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [comparePrice, setComparePrice] = useState("");
    const [selectedType, setSelectedType] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [img1, setImg1] = useState("https://i.ibb.co/KFjt6Mg/gallery-img.png");
    const [img2, setImg2] = useState("https://i.ibb.co/KFjt6Mg/gallery-img.png");
    const [selectedStatus, setSelectedStatus] = useState({});
    const [imageURL, setImageURL] = useState([]);
    const [category, setCategory] = useState([]);
    const [types, setTypes] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname()
    const resultArray = pathname.split("/").filter(Boolean);

    // console.log(resultArray?.[2]);
    // console.log(singleProductData)

    useEffect(() => {
        axiosHttp.get(`/products/${resultArray[2]}`).then(res => {
            setSingleProductData(res.data);
            setTitle(res.data?.title);
            setContent(res.data?.description);
            setPrice(res.data?.price);
            setComparePrice(res.data?.comparePrice);
            setSelectedType(res.data?.type);
            setSelectedCategory(res.data?.category);
            setSelectedSizes(res.data?.size);
            setSelectedStatus(res.data?.status);
            setImageURL(res.data?.colors);
            setImg1(res.data?.imageUrl?.[0]);
            setImg2(res.data?.imageUrl?.[1]);
        })
    }, [])

    useEffect(() => {
        let typ = [];
        let cat = [];
        axiosHttp.get(`/types`).then(res => {
            res?.data?.map(d => {
                if (!typ.includes({ value: d?.title, label: d?.title })) {
                    typ.push({ value: d?.title, label: d?.title })
                }
            })
            setTypes(typ);
        })
        axiosHttp.get(`/collections`).then(res => {
            res?.data?.map(d => {
                if (!cat.includes({ value: d?.title, label: d?.title })) {
                    cat.push({ value: d?.title, label: d?.title })
                }
            })
            setCategory(cat);
            setLoading(false);
        })
    }, []);



    const CustomOption = ({ innerProps, label, data }) => (
        <div {...innerProps}>
            <div className="flex items-center gap-1 py-1 cursor-pointer hover:bg-blue-200">
                <img src={data.imageUrl} alt={"img"} style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                <p>{label?.length < 15 ? label : <>{label?.substring(0, 15)}..</>}</p>
            </div>
        </div>
    );

    console.log(imageURL)


    const handleColor = (index, image, color) => {

        let updateColorArray = [];

        for (let i = 0; i < imageURL.length; i++) {
            if (i == index) {
                const allSKU = imageURL?.[index]?.allSKU || [];
                updateColorArray.push({ name: color?.value, label: image?.label || color?.value, imageUrl: image?.imageUrl, allSKU })
            }
            else {
                updateColorArray.push(imageURL[i]);
            }
        }

        setImageURL(updateColorArray);
    }

    const handleSKU = (sku, sizeIndex, photoIndex) => {
        const size = selectedSizes?.[sizeIndex]?.value;
        let updateColorArray = [...imageURL];

        const length = imageURL?.[photoIndex]?.allSKU?.length;
        let oldData = { ...imageURL?.[photoIndex] };


        let count = 0;
        for (let i = 0; i < length; i++) {

            if (oldData?.allSKU?.[i]?.size == size) {

                oldData.allSKU[i].sku = sku;
                count++;
                break;
            }
        }

        if (count == 0) {
            oldData.allSKU.push({ size, sku });
        }

        updateColorArray[photoIndex] = oldData;
        setImageURL(updateColorArray);

    }


    const handleUpdateProduct = () => {
        if (!title || !price || !status || !img1 || !img2 || !imageURL || !sizes) {
            Swal.fire({
                title: "Incomplete!",
                text: "Please provide all the necessary info",
                icon: "warning"
            });
            return;
        }

        let productData = { title: title, price: price, comparePrice: comparePrice, status: selectedStatus, colors: imageURL, type: selectedType, category: selectedCategory, size: selectedSizes, description: content, imageUrl: [img1, img2] };

        try {
            axiosHttp.put(`/products/${singleProductData?._id}`, productData).then((res) => {
                console.log(res.data)
                if (res.data.status) {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Product Updated successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    router.push("/dashboard/products");
                } else {
                    Swal.fire({
                        title: "Unable!",
                        text: "Unable to update the product :(",
                        icon: "error"
                    });
                }
            });
        } catch (error) {
            console.log(error);
            toast.error("Error ocurred!");
        }
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosHttp.delete(`/products/${id}`).then((res) => {
                    if (res.data?.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Product has been deleted.",
                            icon: "success",
                        });
                        router.push("/dashboard/products");
                    } else {
                        Swal.fire({
                            title: "Unable!",
                            text: "Unable to delete product!.",
                            icon: "error",
                        });
                    }
                });
            }
        })
    }


    const handleDiscard = () => {
        setTitle(singleProductData?.title);
        setContent(singleProductData?.description);
        setPrice(singleProductData?.price);
        setComparePrice(singleProductData?.comparePrice);
        setSelectedType(singleProductData?.type);
        setSelectedCategory(singleProductData?.category);
        setSelectedSizes(singleProductData?.size);
        setSelectedStatus(singleProductData?.status);
        setImageURL(singleProductData?.colors);
        setImg1(singleProductData?.imageUrl?.[0]);
        setImg2(singleProductData?.imageUrl?.[1]);
    }

    const [isVariant, setVariant] = useState(false);
    const [isChangeVariantImgBtn, setChangeVariantImgBtn] = useState(false);
    const [variantIMG, setVariantIMG] = useState("" || "https://i.ibb.co/KFjt6Mg/gallery-img.png");
    const [changeVariantIMG, setChangeVariantIMG] = useState("" || "https://i.ibb.co/KFjt6Mg/gallery-img.png");

    const handleNewVariant = () => {
        setImageURL([{ name: '', label: '', imageUrl: variantIMG, allSKU: [] }, ...imageURL]);
        setVariant(false);
    }
    const handleDeleteVariant = (index) => {
        let arr = [];
        for (let i = 0; i < imageURL.length; i++) {
            if (i != index) {
                arr.push(imageURL[i])
            }
        }
        setImageURL(arr);
    }
    const handleVariantIMGChange = (index) => {
        let arr = [];
        for (let i = 0; i < imageURL.length; i++) {
            if (i == index) {
                let obj = imageURL[i];
                obj.imageUrl = changeVariantIMG;
                arr.push(obj);
            }
            else {
                arr.push(imageURL[i])
            }
        }
        setImageURL(arr);
        setChangeVariantImgBtn(false);
    }

    return (
        <>
            {
                isLoading ? <Loader /> :
                    <div className='my-5 mb-16'>
                        <div className="w-4/5 mx-auto mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                            <div className='flex items-center gap-2'>
                                <Link href={"/dashboard/products"} className="text-xl font-semibold">All Products</Link>
                                <IoIosArrowForward />
                                <h4 className="text-xl font-semibold">{singleProductData?.title || "Update"}</h4>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Link href={`/Collections/${singleProductData?.category?.[0]?.label.toLowerCase()}/${singleProductData?._id}`} target='_blank' className='py-2 px-4 font-semibold bg-white hover:bg-opacity-80 flex items-center gap-1 border-2 rounded-lg transition-all duration-300'>
                                    <FaArrowUpRightFromSquare className='text-lg' />
                                    <p>View</p>
                                </Link>
                                <button onClick={() => { handleDelete(singleProductData?._id) }} className='py-2 px-4 font-semibold text-white bg-red-500 hover:bg-opacity-80 flex items-center gap-1 border-2 border-red-500 rounded-lg transition-all duration-300'>
                                    <MdDeleteForever className='text-lg font-bold' />
                                    <p>Delete</p>
                                </button>
                                <button disabled={title.length == 0} onClick={handleDiscard} className={`flex gap-2 items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                                <button disabled={title.length == 0} onClick={handleUpdateProduct} className={`flex gap-2 items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                            </div>
                        </div>

                        <div className="space-y-3 w-4/5 mx-auto bg-white p-5 rounded-xl shadow-xl">
                            <img src="https://i.ibb.co/jW9MTfv/image.png" alt="" className='w-20 mx-auto' />
                            <h4 className="text-xl font-semibold text-center">Update Product</h4>

                            <div className="flex items-center gap-2">
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Title * <small>( name )</small>
                                    </span>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} required type="text" name="name" id="name"
                                        className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder='Enter title..' />

                                </div>
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Status * <small>(Active, Draft)</small>
                                    </span>
                                    <Select value={selectedStatus} onChange={(selectedOptions) => setSelectedStatus(selectedOptions)} required options={status} isMulti={false}
                                        isClearable={false} placeholder="Select status" className='z-20' />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Price * <small>( sell price )</small>
                                    </span>
                                    <input value={price} min={0} onChange={(e) => setPrice(e.target.value)} required type="number" name="price" id="price" className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder="Price" />
                                </div>
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Compare price
                                    </span>
                                    <input value={comparePrice} min={0} onChange={(e) => setComparePrice(e.target.value)} type="number" name="price" id="price" className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder="Compare price" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Type <small>(Jewelry, Clothing etc)</small>
                                    </span>
                                    <Select value={selectedType} onChange={(selectedOptions) => setSelectedType(selectedOptions)} required options={types} isMulti={false}
                                        isClearable={false} placeholder="Select type" className='z-20' />
                                </div>
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Category <small>(choose category)</small>
                                    </span>
                                    <Select value={selectedCategory} onChange={(selectedOptions) => setSelectedCategory(selectedOptions)}
                                        isMulti
                                        isClearable={false}
                                        name="category"
                                        options={category}
                                        className="basic-multi-select z-30"
                                        placeholder="Select category"
                                    />
                                </div>
                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                    <span>
                                        Sizes * <small>(choose sizes)</small>
                                    </span>
                                    <CreatableSelect value={selectedSizes} onChange={(selectedOptions) => setSelectedSizes(selectedOptions)} required options={sizes} isMulti placeholder="Select sizes" className='z-20' />
                                </div>
                            </div>


                            <div>
                                <span>
                                    Details
                                </span>
                                <JoditEditor
                                    className='max-h-[400px] overflow-y-auto'
                                    ref={editor}
                                    value={content}
                                    tabIndex={1} // tabIndex of textarea
                                    onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                    onChange={newContent => { }}
                                />
                            </div>

                            {/* variant / colors  */}
                            <div className='card2 max-h-[400px] overflow-y-auto'>
                                {
                                    imageURL.length != 0 ?
                                        <div className='flex items-center justify-between'>
                                            <h4 className='text-start text-lg font-semibold text-[#0086fe]'>Enter photo wise color & size wise SKU:</h4>
                                            <button onClick={() => { setVariant(true) }} className='bg-[#0086fe] text-white py-1 px-3 rounded-lg font-semibold'>+ variant</button>
                                        </div>

                                        :
                                        <div className='flex items-center justify-between'>
                                            <h4 className='text-center text-lg font-semibold text-red-400'>No photo uploaded yet</h4>
                                            <button onClick={() => { setVariant(true) }} className='bg-[#0086fe] text-white py-1 px-3 rounded-lg font-semibold'>+ variant</button>
                                        </div>
                                }
                                {
                                    isVariant && <div className='relative w-full flex items-center justify-center gap-2 my-3'>
                                        <input placeholder='Enter image url..' onChange={(e) => setVariantIMG(e.target.value)}
                                            type="text" name="variantImg" id="" className='border w-full pl-8 pr-2 py-2 outline-1' />
                                        <button onClick={() => { setVariant(false) }} className='bg-red-600 text-white py-1 px-3 rounded-lg font-semibold'>Cancel</button>
                                        <button onClick={handleNewVariant} className='bg-[#FFC520] py-1 px-3 rounded-lg font-semibold'>Add</button>
                                        <img src={variantIMG} alt="selected img-2" className="w-8 h-8 absolute bottom-[2px] left-[2px]" />
                                    </div>
                                }
                                {
                                    imageURL.length == 0 && <img src='https://i.ibb.co/52VHTDD/folder.png' alt="no image uploaded yet" className='h-60 w-60 mx-auto' />
                                }
                                {imageURL?.map((i, index) => <div key={index} className="grid grid-cols-4 gap-2 items-start justify-center my-3 bg-[#f4f3f9] p-2 rounded-md">
                                    <div className='relative flex flex-col gap-2 justify-center items-center'>
                                        <img src={i?.imageUrl} alt="img" className='w-full h-40 rounded-md' />
                                        <CreatableSelect defaultValue={{ label: i?.name, value: i?.label }} isMulti={false} onChange={(selectedOptions) => handleColor(index, i, selectedOptions)} required options={colors} placeholder="Enter color" className=' !w-full' />
                                        <RiImageEditLine title='Change photo' onClick={() => { setChangeVariantImgBtn(true) }}
                                            className='cursor-pointer absolute top-1 right-2 text-2xl p-1 bg-[#FFC520] hover:bg-opacity-80 rounded-full' />

                                        {
                                            isChangeVariantImgBtn && <div className='!w-full !h-full rounded-md bg-black bg-opacity-70 absolute top-0 left-0 pt-14 px-1'>
                                                <input onChange={(e) => setChangeVariantIMG(e.target.value)}
                                                    placeholder='Enter url' type="text" name="variantImg" id="" className='border-2 rounded-lg w-full pl-8 pr-2 py-2 outline-1' />
                                                <div className='w-full flex items-center justify-center gap-2 my-3'>
                                                    <button onClick={() => { setChangeVariantImgBtn(false) }} className='bg-red-600 text-white py-1 px-3 rounded-lg font-semibold'>Cancel</button>
                                                    <button onClick={() => handleVariantIMGChange(index)} className='bg-[#FFC520] py-1 px-3 rounded-lg font-semibold'>Add</button>
                                                    <img src={variantIMG} alt="selected img-2" className="w-8 h-8 absolute top-[60px] left-[6px]" />
                                                </div>
                                            </div>
                                        }

                                    </div>
                                    <div className="relative col-span-3 start-1 w-full grid grid-cols-3 gap-2 justify-center items-start my-3">
                                        {
                                            selectedSizes?.map((ss, indexS) => <div key={indexS} className='w-full'>
                                                <TextField defaultValue={i?.allSKU?.[indexS]?.sku} onBlur={(e) => handleSKU(e.target.value, indexS, index)} type="text" name="color-wise-sku" id={ss?.value} className="rounded-md w-full border-2 my-2" label={`SKU for ${ss?.value}`} />

                                            </div>)
                                        }
                                        <RxCross2 title='Delete Variant' onClick={() => { handleDeleteVariant(index) }}
                                            className='cursor-pointer absolute top-1 right-2 text-2xl p-1 bg-red-600 hover:bg-opacity-80 text-white rounded-full' />

                                    </div>

                                </div>)}

                            </div>

                            {/* Card images  */}
                            <div className="flex items-center gap-2 pt-5">
                                <div className='relative w-full space-y-2'>
                                    <p>
                                        Product Img-1 * <small>(Default card img)</small>
                                    </p>
                                    <Select className='w-full'
                                        required
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                paddingLeft: '40px',
                                            }),
                                        }}
                                        options={imageURL}
                                        components={{ Option: CustomOption }}
                                        isMulti={false}
                                        onChange={(selectedOptions) => setImg1(selectedOptions?.imageUrl)}
                                        placeholder={img1 || "Select Card img-1"}
                                    />
                                    <img src={img1} alt="selected img-1" className="w-8 h-8 absolute bottom-[2px] left-[2px]" />
                                </div>
                                <div className='relative w-full space-y-2'>
                                    <p>
                                        Product Img-2 * <small>(Hover card img)</small>
                                    </p>
                                    <Select className='w-full'
                                        required
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                paddingLeft: '40px',
                                            }),
                                        }}
                                        options={imageURL}
                                        components={{ Option: CustomOption }}
                                        isMulti={false}
                                        onChange={(selectedOptions) => setImg2(selectedOptions?.imageUrl)}
                                        placeholder={img2 || "Select Card img-2"}
                                    />
                                    <img src={img2} alt="selected img-2" className="w-8 h-8 absolute bottom-[2px] left-[2px]" />
                                </div>


                            </div>
                            <div className='w-full flex items-center gap-2'>
                                <button disabled={title.length == 0} onClick={handleDiscard} className={`w-full flex gap-2 justify-center items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                                <button disabled={title.length == 0} onClick={handleUpdateProduct} className={`w-full flex gap-2 justify-center items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                            </div>

                        </div>
                    </div>
            }
        </>
    );
};

export default page;