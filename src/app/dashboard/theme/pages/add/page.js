"use client"
import { axiosHttp } from '@/app/helper/axiosHttp';
import Switch from '@mui/material/Switch';
import JoditEditor from 'jodit-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from 'sweetalert2';

const page = () => {
    const router = useRouter();

    const editor = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState("xx");
    const [position, setPosition] = useState("xx");
    const [column, setColumn] = useState("xx");
    const [error, setError] = useState("");
    const [customURL, setCustomURL] = useState('');
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    }

    const handleSave = () => {

        if (!title || !visibility || !position || !content) {
            setError("Form is incomplete!");
            return;
        }

        let url;
        if (checked) {
            url = "/" + customURL.replace(/\s+/g, '-').replace(/-$/, '');
        }
        else {
            url = "/pages/" + title.replace(/\s+/g, '-').replace(/-$/, '');
        }

        const pageData = { title, url, visibility, position, column, content };

        axiosHttp.post("/theme/pages", pageData).then(res => {
            // console.log(res.data)
            if (res.data.status) {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Page created successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                router.push("/dashboard/theme/pages");
            }
            else {
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: res.data.message,
                });
            }

        })
    }

    const handleDiscard = () => {
        setTitle("");
        setContent("");
        setVisibility("xx");
        setPosition("xx");
        setColumn("xx");
        setChecked(false);
        setError("");
    }

    return (
        <div className='p-5'>
            <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                <div className='flex items-center gap-2'>
                    <Link href={"/dashboard/theme/pages"} className="text-xl font-semibold">Pages</Link>
                    <IoIosArrowForward />
                    <h4 className="text-xl font-semibold">Create new page</h4>
                </div>
                <div className='flex items-center gap-2'>
                    <button disabled={title.length == 0} onClick={handleDiscard} className={`flex gap-2 items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                    <button disabled={title.length == 0} onClick={handleSave} className={`flex gap-2 items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <form className='space-y-2'>
                    <div className="grid grid-cols-3 gap-2 items-start">
                        <div className="col-span-2 space-y-2">
                            <div>
                                <label htmlFor="title">Title * </label> {error && <span className='ml-10 text-red-600 font-semibold'>{error}</span>}
                                <input value={title} onChange={(e) => { setTitle(e.target.value); setError(""); }} required placeholder='Enter title..' type="text" name="title" id="title" className='w-full outline-1 outline-[#d5ddda] border-2 rounded-md px-2 py-1' />
                            </div>
                            <div>
                                <p>Content</p>
                                <JoditEditor
                                    className=''
                                    ref={editor}
                                    value={content}
                                    tabIndex={1} // tabIndex of textarea
                                    onBlur={newContent => { setContent(newContent); setError(""); }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 space-y-2 rounded-lg bg-[#def1e7] p-5 mt-6">
                            <div className='w-full'>
                                <label>Visibility *</label>
                                <select value={visibility} onChange={(e) => { setVisibility(e.target.value); setError(""); }} required name="visibility" id="visibility" className='w-full border-2 rounded-md px-2 py-[6px] outline-1 outline-[#d5ddda]'>
                                    <option value="xx" disabled>Choose option..</option>
                                    <option value="Visible">Visible</option>
                                    <option value="Hide">Hide</option>
                                </select>
                            </div>
                            <div className='w-full'>
                                <label>Position * <small className='text-sm'>(Header or footer)</small></label>
                                <select value={position} onChange={(e) => { setPosition(e.target.value); setError(""); }} required name="Position" id="Position" className='w-full border-2 rounded-md px-2 py-[6px] outline-1 outline-[#d5ddda]'>
                                    <option value="xx" disabled>Choose option..</option>
                                    <option value="Header">Header</option>
                                    <option value="Footer">Footer</option>
                                </select>
                            </div>
                            {
                                position == "Footer" && <div className='w-full'>
                                    <label>Which column * <small className='text-sm'>(in footer)</small></label>
                                    <select value={column} onChange={(e) => { setColumn(e.target.value); setError(""); }} name="Position" id="Position" className='w-full border-2 rounded-md px-2 py-[6px] outline-1 outline-[#d5ddda]'>
                                        <option value="xx" disabled>Choose option..</option>
                                        <option value="1">Column-1</option>
                                        <option value="2">Column-2</option>
                                        <option value="3">Column-3</option>
                                    </select>
                                </div>
                            }

                            <div className='w-full'>
                                <label>Custom URL</label>
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                {checked && <p className='text-sm my-1'>( Don't add "/" starting of the link )</p>}
                                {
                                    checked && <input value={customURL} onChange={(e) => { setCustomURL(e.target.value) }} placeholder='Enter custom Url..' type="text" name="customURL" id="customURL" className='w-full outline-1 outline-[#d5ddda] border-2 rounded-md px-2 py-1' />
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default page;