"use client"
import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TiEdit } from "react-icons/ti";
import Swal from 'sweetalert2';




const page = () => {
    const [pagesData, setPagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(0);

    useEffect(() => {
        axiosHttp.get(`/theme/pages`).then(res => {
            setPagesData(res.data);
            setLoading(false);
        }).catch(error => {
            console.log(error.data)
        })
    }, [refetch])

    const handleDelete = (pageID) => {
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
                axiosHttp.delete(`/theme/pages/${pageID}`).then((res) => {
                    if (res.data?.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Collection has been deleted.",
                            icon: "success",
                        });
                        setRefetch(refetch + 1);
                    } else {
                        Swal.fire({
                            title: "Unable!",
                            text: "Unable to delete collection.",
                            icon: "error",
                        });
                    }
                });
            }
        })
    }


    return (
        <div className='p-5'>
            <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                <Link href={"/dashboard/theme/pages"} className="text-xl font-semibold">Pages <span>({pagesData?.length})</span></Link>
                <Link href={"/dashboard/theme/pages/add"} className="flex gap-2 items-center bg-white py-2 px-4 rounded-lg font-semibold cursor-pointer">
                    <IoMdAdd className="text-xl" />
                    <span>New Page</span>
                </Link>
            </div>

            <div>
                {
                    loading && <Loader />
                }
                {
                    pagesData?.length > 0 && pagesData?.map(page => <div key={page?._id}
                        className='bg-white my-3 py-2 px-4 border-2 rounded-lg shadow-md flex justify-between items-center'>
                        {
                            page?.url?.split("/").filter(Boolean)?.length < 2 ?

                                <Link href={`/dashboard/theme/pages${page?.url}`} className='inline-block flex-grow'>
                                    <h3>
                                        <span className='text-lg font-semibold'>{page?.title}</span>
                                        <span className='text-sm mx-1'>({page?.visibility})</span>
                                    </h3>
                                    <p className='text-md mt-1 text-gray-700'><span>URL: <span>{`/pages${page?.url}`}</span></span></p>
                                </Link> :
                                <Link href={`/dashboard/theme${page?.url}`} className='inline-block flex-grow'>
                                    <h3>
                                        <span className='text-lg font-semibold'>{page?.title}</span>
                                        <span className='text-sm mx-1'>({page?.visibility})</span>
                                    </h3>
                                    <p className='text-md mt-1 text-gray-700'><span>URL: <span>{page?.url}</span></span></p>
                                </Link>}
                        <div className='flex gap-2 items-center'>
                            {
                                page?.url?.split("/").filter(Boolean)?.length < 2 ?
                                    <Link href={`/dashboard/theme/pages${page?.url}`} target='_blank' className='px-4 py-1 font-semibold bg-gray-300 hover:bg-gray-400 flex items-center gap-1 border-2 rounded-3xl transition-all duration-300'>
                                        <TiEdit className='text-lg' />
                                        <p>Edit</p>
                                    </Link> :
                                    <Link href={`/dashboard/theme${page?.url}`} target='_blank' className='px-4 py-1 font-semibold bg-gray-300 hover:bg-gray-400 flex items-center gap-1 border-2 rounded-3xl transition-all duration-300'>
                                        <TiEdit className='text-lg' />
                                        <p>Edit</p>
                                    </Link>}
                            <Link href={`${page?.url}`} target='_blank' className='px-2 py-1 font-semibold bg-gray-300 hover:bg-gray-400 flex items-center gap-1 border-2 rounded-3xl transition-all duration-300'>
                                <IoEyeOutline className='text-lg' />
                                <p>View page</p>
                            </Link>
                            <button onClick={() => { handleDelete(page?._id) }} className='py-2 px-4 font-semibold text-white bg-red-500 hover:bg-red-600 flex items-center gap-1 border-2 rounded-3xl transition-all duration-300'>
                                <MdDeleteForever className='text-lg' />
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>)
                }
            </div>


        </div >
    );
};

export default page;