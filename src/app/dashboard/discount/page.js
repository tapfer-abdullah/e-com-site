"use client"
import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdDeleteForever, MdEditSquare } from 'react-icons/md';
import { TiEdit } from 'react-icons/ti';
import Swal from 'sweetalert2';
import "./discount.css";

const TypeOfDiscountCode = {
    BxGy: "Buy x get y",
    AOffP: "Amount off product",
    AOffO: "Amount off order",
    FS: "Free shipping",
}

const page = () => {
    const [discountCodes, setDiscountCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(0);

    useEffect(() => {
        axiosHttp.get(`/discount`).then(res => {
            setDiscountCodes(res.data);
            setLoading(false);
        })
            .catch(error => {
                console.log(error.message)
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
                axiosHttp.delete(`/discount/${id}`).then((res) => {
                    if (res.data?.status) {
                        setRefetch(refetch + 1);

                        Swal.fire({
                            title: "Deleted!",
                            text: "discount code has been deleted.",
                            icon: "success",
                        });
                    } else {
                        Swal.fire({
                            title: "Unable!",
                            text: "Unable to delete!.",
                            icon: "error",
                        });
                    }
                });
            }
        })
    }

    return (
        <div className='px-5 pb-5 w-full'>
            <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                <h1 className="text-xl font-semibold">All Discount Codes <span>({discountCodes?.length})</span></h1>
                <div className="flex items-center gap-3 px-2">
                    <Link href={"/dashboard/discount/add"} className="flex gap-2 items-center bg-white p-2 rounded-lg font-semibold cursor-pointer">
                        <IoMdAdd className="text-xl" />
                        <span>New Discount Code</span>
                    </Link>

                    <select
                        defaultValue={"FilterDiscount"}
                        // onChange={(e) => setFilterOption(e.target.value)}
                        name="filterDiscountCode"
                        id="filterDiscountCode"
                        className="py-2 pl-2 pr-5 text-lg font-semibold outline-0 rounded-md cursor-pointer"
                    >
                        <option disabled value="FilterDiscount">Filter Discount Codes</option>
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Deactive">Deactive</option>
                    </select>
                </div>
            </div>

            <div>
                {loading ? <Loader /> :
                    <table className='discount-table !w-full bg-white'>
                        <thead className='bg-blue-300'>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Elizable</th>
                                <th className='!text-center'>Used</th>
                                <th className='!text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                discountCodes?.map(d => <tr key={d?._id}>
                                    <td className=' font-semibold'><Link href={`/dashboard/discount/${d?._id}`}>{d?.title}</Link></td>
                                    {/* <td>{d?.title?.length > 20 ? <>{d?.title?.slice(0, 20)}..</> : <>{d?.title?.slice(0, 10)}</>}</td> */}
                                    <td className={`${d?.status?.label == "Active" ? "text-green-500" : "text-red-500"} font-semibold`}>{d?.status?.label || "Deactive"}</td>
                                    <td className='capitalize !text-left'>
                                        {d?.discountCodeType == "BxGy" && <>
                                            {d?.additionalData?.BxGy?.BxGyType} {d?.additionalData?.BxGy?.CusBuyAmount}<> get </>
                                            {d?.additionalData?.BxGy?.DiscountedType?.option == "free" ? <span>{d?.additionalData?.BxGy?.CusGetAmount} {d?.additionalData?.BxGy?.DiscountedType?.option}</span> :
                                                <span>{d?.additionalData?.BxGy?.DiscountedType?.value} {d?.additionalData?.BxGy?.DiscountedType?.option == "percentage" ? "%" : "amount"} off of {d?.additionalData?.BxGy?.CusGetAmount} product</span>
                                            }
                                        </>}

                                        {d?.discountCodeType == "AOffP" && <>{d?.additionalData?.AOffP?.DiscountedType?.value} {d?.additionalData?.AOffP?.DiscountedType?.option == "Fixed" ? "amount" : "%"} off ( on specific {d?.additionalData?.AOffP?.ApplyTo?.option} )</>}
                                        {d?.discountCodeType == "AOffO" && <>{d?.additionalData?.AOffO?.DiscountedType?.value} {d?.additionalData?.AOffO?.DiscountedType?.option == "Fixed" ? "amount" : "%"} off on order</>}
                                        {d?.discountCodeType == "FS" && <>Free shipping ( {d?.additionalData?.FS?.freeShipping?.option} country )</>}
                                    </td>
                                    <td className='capitalize'>{d?.eligibility?.value || "All"}</td>
                                    <td className='!text-center'>{d?.used}</td>
                                    <td className='!text-center'>
                                        <div className="!w-full !h-full flex items-center justify-center gap-2">
                                            <MdDelete onClick={() => { handleDelete(d?._id) }} className='text-3xl font-bold bg-red-600 text-white rounded-md cursor-pointer p-1' />
                                            <Link href={`/dashboard/discount/${d?._id}`}><MdEditSquare className='text-3xl font-bold bg-[#FFC520] text-white rounded-md cursor-pointer p-1' /></Link>
                                        </div>
                                    </td>
                                </tr>)
                            }
                        </tbody>

                    </table>
                }
            </div>
        </div>
    );
};

export default page;