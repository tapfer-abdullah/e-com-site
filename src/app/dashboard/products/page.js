"use client"
import DProductsCards from '@/Components/Pages/Dashboard/DProducts/DProductsCards';
import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdEditSquare } from "react-icons/md";
import Swal from 'sweetalert2';
import "./products.css";


export default function page() {

    const [isLoading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [refetch, setRefetch] = useState(0);

    useEffect(() => {
        axiosHttp.get(`/products`).then(res => {
            setAllProducts(res.data);
            setLoading(false);
        })
    }, [refetch])

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
                        setRefetch(refetch + 1);

                        Swal.fire({
                            title: "Deleted!",
                            text: "Product has been deleted.",
                            icon: "success",
                        });
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


    return (
        <div className='px-5 pb-5 w-full'>
            <div className="grid grid-cols-4 gap-3 my-3">
                <DProductsCards title={"Total Products"} amount={allProducts?.length} />
                <DProductsCards title={"Active Products"} amount={95} />
                <DProductsCards title={"Inactive Products"} amount={5} />
                <DProductsCards title={"New Products"} amount={5} />
            </div>
            <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                <Link href={"/dashboard/products"} className="text-xl font-semibold">All Products <span>({allProducts?.length})</span></Link>
                <Link href={"/dashboard/products/add"} className="flex gap-2 items-center bg-white py-2 px-4 rounded-lg font-semibold cursor-pointer">
                    <IoMdAdd className="text-xl" />
                    <span>New Product</span>
                </Link>
            </div>

            {isLoading ? <Loader /> :
                <table className='products-table !w-full bg-white'>
                    <thead className='bg-blue-300'>
                        <tr>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th className='!text-center'>Sell Quantity</th>
                            <th className='!text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allProducts?.map(p => <tr key={p?._id}>
                                <td><Link href={`/dashboard/products/${p?._id}`}><img src={p?.imageUrl?.[0]} alt="img" className='w-12 h-12' /></Link></td>
                                <td><Link href={`/dashboard/products/${p?._id}`}>{p?.title?.length > 20 ? <>{p?.title?.slice(0, 20)}..</> : <>{p?.title?.slice(0, 10)}</>}</Link></td>
                                <td>{p?.price}</td>
                                <td className={`${p?.status?.label == "Active" ? "text-green-500" : "text-red-500"} font-semibold`}>{p?.status?.label}</td>
                                <td className='!text-center'>{p?.sellQuantity}</td>
                                <td className='!text-center'>
                                    <div className="!w-full !h-full flex items-center justify-center gap-2">
                                        <MdDelete onClick={() => { handleDelete(p?._id) }} className='text-3xl font-bold bg-red-600 text-white rounded-md cursor-pointer p-1' />
                                        <Link href={`/dashboard/products/${p?._id}`}><MdEditSquare className='text-3xl font-bold bg-[#FFC520] text-white rounded-md cursor-pointer p-1' /></Link>
                                        <Link target='_blank' href={`/Collections/${p?.category?.[0]?.label.toLowerCase()}/${p?._id}`}><FaArrowUpRightFromSquare className='text-3xl font-bold bg-green-500 text-white rounded-md cursor-pointer p-1' /></Link>
                                    </div>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            }
        </div>
    );
}