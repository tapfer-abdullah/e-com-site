"use client"
import { TextField } from '@mui/material';
// import ReactHtmlParser from 'react-html-parser';

import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import "./AddProduct.css";


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
    const [images, setImages] = useState([]);
    const [imageURL, setImageURL] = useState([]);
    const [category, setCategory] = useState([]);
    const [types, setTypes] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [isDragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

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

    const selectFiles = () => {
        fileInputRef.current.click();
    }
    const onFileSelect = (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== "image") continue;
            if (!images.some((event) => event.name === files[i].name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },
                ]);
            }
        }
    }

    const deleteImage = (index) => {
        setImages(prevImages => {
            return prevImages.filter((_, i) => i !== index)
        });
    }

    const onDragOver = (e) => {
        e.preventDefault();
        setDragging(false);
        e.dataTransfer.dropEffect = "copy";
    }

    const onDragLeave = e => {
        setDragging(false);
    }
    const onDrop = e => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!images.some((event) => event.name === files[i].name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },
                ]);
            }
        }
    }



    const CustomOption = ({ innerProps, label, data }) => (
        <div {...innerProps}>
            <div className="flex items-center gap-1 py-1 cursor-pointer hover:bg-blue-200">
                <img src={data.imageUrl} alt={"img"} style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                <p>{label?.length < 15 ? label : <>{label?.substring(0, 15)}..</>}</p>
            </div>
        </div>
    );

    const handleUploadPhoto = async () => {
        const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_KEY;
        const apiUrl = 'https://api.imgbb.com/1/upload';

        try {

            const formData = new FormData();
            let imgURL = [];

            for (let i = 0; i < images.length; i++) {
                const response = await fetch(images[i].url);
                const blob = await response.blob();

                formData.append('image', blob, images[i].name);


                const response2 = await axios.post(`${apiUrl}?key=${apiKey}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // console.log('Image uploaded successfully:', response2.data);
                // console.log(response2.data)
                imgURL.push({ name: "Default-color", label: response2.data?.data?.title, imageUrl: response2.data?.data?.url });
            }

            setImageURL(imgURL)
            setImages([]);

        } catch (error) {
            console.error('Error uploading images to ImageBB:', error);
            console.log('Error response:', error.response.data);
        }
    }

    const handleColor = (index, image, color) => {

        let updateColorArray = [];

        for (let i = 0; i < imageURL.length; i++) {
            if (i == index) {
                const allSKU = imageURL?.[index]?.allSKU || [];
                updateColorArray.push({ name: color?.value, label: image?.label, imageUrl: image?.imageUrl, allSKU })
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


    const handleAddProduct = () => {
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
            axiosHttp.post("/products", productData).then((res) => {
                if (res.data.status) {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Product added successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    router.push("/dashboard/products");
                } else {
                    Swal.fire({
                        title: "Unable!",
                        text: "Unable to add the product :(",
                        icon: "error"
                    });
                }
            });
        } catch (error) {
            console.log(error);
            toast.error("Error ocurred!");
        }
    }

    const handleDiscard = () => {
        setTitle("");
        setContent("");
        setPrice("");
        setComparePrice("");
        setSelectedType([]);
        setSelectedCategory([]);
        setSelectedSizes([]);
        setSelectedStatus({});
        setImageURL([]);
        setImages([]);
        setImg1("https://i.ibb.co/KFjt6Mg/gallery-img.png");
        setImg2("https://i.ibb.co/KFjt6Mg/gallery-img.png");
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
                                <h4 className="text-xl font-semibold">Add new product</h4>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button disabled={title.length == 0} onClick={handleDiscard} className={`flex gap-2 items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                                <button disabled={title.length == 0} onClick={handleAddProduct} className={`flex gap-2 items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                            </div>
                        </div>

                        <div className="space-y-3 w-4/5 mx-auto bg-white p-5 rounded-xl shadow-xl">
                            <img src="https://i.ibb.co/jW9MTfv/image.png" alt="" className='w-20 mx-auto' />
                            <h4 className="text-xl font-semibold text-center">Add a product</h4>

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

                            {/* DRAG AND DROP IMAGE */}
                            <div className='grid grid-cols-1 gap-3'>
                                <div className="card">
                                    <div className="top text-center">
                                        <p>Media *</p>
                                    </div>
                                    <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                                        {
                                            isDragging ? <span className="select">
                                                Drop images here
                                            </span> : (
                                                <>Drag & Drop image here or {" "}
                                                    <span className="select" role='button' onClick={selectFiles}>Browse</span></>)
                                        }

                                        <input type="file" name="file" id="" className='file' multiple ref={fileInputRef} onChange={onFileSelect} />
                                    </div>
                                    <div className="container">
                                        {images?.map((image, index) => (
                                            <div className="image" key={index}>
                                                <span
                                                    className="delete"
                                                    onClick={() => deleteImage(index)}
                                                >
                                                    x
                                                </span>
                                                <img src={image.url} alt={image.name} />
                                            </div>
                                        ))}

                                    </div>
                                    <button disabled={images?.length == 0} onClick={handleUploadPhoto} className='!font-semibold hover:bg-opacity-80'>Upload</button>
                                </div>

                                {/* varient / colors  */}
                                <div className='card2 max-h-[400px] overflow-y-auto'>
                                    {imageURL.length != 0 ? <h4 className='text-center text-lg font-semibold text-[#0086fe]'>Enter photo wise color & size wise SKU:</h4>
                                        : <h4 className='text-center text-lg font-semibold text-red-400'>No photo uploaded yet</h4>}
                                    {
                                        imageURL.length == 0 && <img src='https://i.ibb.co/52VHTDD/folder.png' alt="no image uploaded yet" className='h-60 w-60 mx-auto' />
                                    }
                                    {imageURL?.map((i, index) => <div key={index} className="grid grid-cols-4 gap-2 items-start justify-center my-3 bg-[#f4f3f9] p-2 rounded-md">
                                        <div className='flex flex-col gap-2 justify-center items-center'>
                                            <img src={i?.imageUrl} alt="img" className='w-full h-40 rounded-md' />
                                            <CreatableSelect isMulti={false} onChange={(selectedOptions) => handleColor(index, i, selectedOptions)} required options={colors} placeholder="Enter color" className=' !w-full' />
                                        </div>
                                        <div className="col-span-3 start-1 w-full grid grid-cols-3 gap-2 justify-center items-start my-3">
                                            {
                                                selectedSizes?.map((ss, indexS) => <div key={indexS} className='w-full'>
                                                    <TextField onBlur={(e) => handleSKU(e.target.value, indexS, index)} type="text" name="color-wise-sku" id={ss?.value} className="rounded-md w-full border-2 my-2" label={`SKU for ${ss?.value}`} />

                                                </div>)
                                            }

                                        </div>

                                    </div>)}

                                </div>
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
                                        placeholder="Select Card img-1"
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
                                        placeholder="Select Card img-2"
                                    />
                                    <img src={img2} alt="selected img-2" className="w-8 h-8 absolute bottom-[2px] left-[2px]" />
                                </div>


                            </div>
                            <div className='w-full flex items-center gap-2'>
                                <button disabled={title.length == 0} onClick={handleDiscard} className={`w-full flex gap-2 justify-center items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                                <button disabled={title.length == 0} onClick={handleAddProduct} className={`w-full flex gap-2 justify-center items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                            </div>

                        </div>


                    </div>
            }
        </>
    );
};

export default page;