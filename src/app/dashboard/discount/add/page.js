"use client"
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Select from 'react-select';


import { OrderStateProvider } from '@/Components/State/OrderState';
import Loader from '@/Hooks/Loader/Loader';
import { axiosHttp } from '@/app/helper/axiosHttp';
import { TimePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Deactive", label: "Deactive" }
]

const eligibilityList = [
    { value: "New-customers", label: "New-customers" },
    { value: "Old-customers", label: "Old-customers" }
]


const page = () => {
    const router = useRouter();

    const { allCountryData } = useContext(OrderStateProvider);
    const [categoryData, setCategoryData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [defaultDateTime, setDefaultDateTime] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let cat = [];
        axiosHttp.get(`/collections`).then(res => {
            // console.log(res.data)
            res?.data?.map(d => {
                if (!cat.includes({ value: d?._id })) {
                    cat.push({ value: d?._id, label: d?.title, imageUrl: d?.img })
                }
            })
            setCategoryData(cat);
        })
    }, []);

    useEffect(() => {
        let cat = [];
        axiosHttp.get(`/products?title=yes`).then(res => {
            res?.data?.map(d => {
                if (!cat.includes({ value: d?._id })) {
                    cat.push({ value: d?._id, label: d?.title, imageUrl: d?.imageUrl?.[0] })
                }
            })
            setProductsData(cat);
            setLoading(false);
        })
    }, []);

    //custom select option
    const CustomOption = ({ innerProps, label, data }) => (
        <div {...innerProps}>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-200 py-1">
                <img src={data.imageUrl} alt={"img"} style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                <p className='cursor-pointer'>{label?.length < 30 ? label : <>{label?.substring(0, 30)}..</>}</p>
            </div>
        </div>
    );



    const [discountOn, setDiscountOn] = useState("");
    const [title, setTitle] = useState("");
    const [selectedStatus, setSelectedStatus] = useState({ value: "Deactive", label: "Deactive" });

    const [minPhrReqOption, setMinPhrReqOption] = useState("no");
    const [minPhrReqValue, setMinPhrReqValue] = useState(0);

    const [eligibilityOption, setEligibilityOption] = useState("all");
    const [eligibilityValue, setEligibilityValue] = useState({});

    const [limitDisOption, setLimitDisOption] = useState(false);
    const [limitDisValue, setLimitDisValue] = useState(0);
    const [limitDisOnePerUse, setLimitDisOnePerUse] = useState(false);

    const [startDate, setStartDate] = useState({});
    const [startTime, setStartTime] = useState({});
    const [isEndTime, setIsEndTime] = useState(false);
    const [EndDate, setEndDate] = useState({});
    const [EndTime, setEndTime] = useState({});

    const [disCategoryOption, setDisCategoryOption] = useState({});;
    const [disCategoryValue, setDisCategoryValue] = useState(0);

    const [selectCatOrProd, setSelectCatOrProd] = useState({});
    const [selectCatOrProdArray, setSelectCatOrProdArray] = useState([]);

    //buy X get Y
    const [selectCatOrProdBuy, setSelectCatOrProdBuy] = useState({});
    const [selectCatOrProdBuyArray, setSelectCatOrProdBuyArray] = useState([]);
    const [selectCatOrProdGet, setSelectCatOrProdGet] = useState({});
    const [selectCatOrProdGetArray, setSelectCatOrProdGetArray] = useState([]);

    // freeShipping
    const [freeShipping, setFreeShipping] = useState("all");
    const [freeShippingCountries, setFreeShippingCountries] = useState([]);
    const [shippingRateOPOption, setShippingRateOPOption] = useState(false);
    const [shippingRateOPValue, setShippingRateOPValue] = useState(0);

    //buy X get Y
    const [BxGyType, setBxGyType] = useState("buys");
    const [BxGyCusBuyAmount, setBxGyCusBuyAmount] = useState(0);
    const [BxGyCusGetAmount, setBxGyCusGetAmount] = useState(0);

    const [BxGyDiscountedOption, setBxGyDiscountedOption] = useState("free");
    const [BxGyDiscountedValue, setBxGyDiscountedValue] = useState(0);

    const [BxGyMaxUserOption, setBxGyMaxUserOption] = useState(false);
    const [BxGyMaxUserValue, setBxGyMaxUserValue] = useState(0);

    useEffect(() => { // handle default time and date
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        let day = String(currentDate.getDate()).padStart(2, '0');
        let hour = String(currentDate.getHours()).padStart(2, '0');
        let minutes = String(currentDate.getMinutes()).padStart(2, '0');

        // 2024-01-17T15:30 this format is require for date & time picker
        const defaultDate = `${year}-${month}-${day}T${hour}:${minutes}`;
        setDefaultDateTime(defaultDate);

        setStartTime({ hour: hour, min: minutes })
        setEndTime({ hour: hour, min: minutes })
        setStartDate({ year, month, Day: day })
        setEndDate({ year, month, Day: day })
    }, [])

    // console.log(selectCatOrProdBuyArray)

    const handleSave = () => {
        //common data form all discount code
        let commonData = {
            discountCodeType: discountOn,
            title: title, status: selectedStatus,
            minPurRequirement: { option: minPhrReqOption, value: minPhrReqValue },
            eligibility: { option: eligibilityOption, value: eligibilityValue?.value || "" },
            maxDisCodeUse: { option: limitDisOption, value: limitDisValue },
            limitDisOnePerUse: limitDisOnePerUse, isEndTime: isEndTime,
            startDate, startTime, EndDate, EndTime, used: 0
        };

        //1. buy X get Y data
        let BxGyData = {
            BxGyType, CusBuyAmount: BxGyCusBuyAmount, CusGetAmount: BxGyCusGetAmount,
            DiscountedType: { option: BxGyDiscountedOption, value: BxGyDiscountedValue },
            MaxUser: { option: BxGyMaxUserOption, value: BxGyMaxUserValue },
            Buy: { option: selectCatOrProdBuy?.value, value: selectCatOrProdBuyArray },
            Get: { option: selectCatOrProdGet?.value, value: selectCatOrProdGetArray }
        }

        //2. Amount off product
        let AOffPData = {
            DiscountedType: { option: disCategoryOption?.value, value: disCategoryValue },
            ApplyTo: { option: selectCatOrProd?.value, value: selectCatOrProdArray },
        }

        //3. Amount off order
        let AOffOData = {
            DiscountedType: { option: disCategoryOption?.value, value: disCategoryValue }
        }

        //4. Free Shipping
        let FSData = {
            freeShipping: { option: freeShipping, value: freeShippingCountries },
            shippingRate: { option: shippingRateOPOption, value: shippingRateOPValue }
        }

        let discountCodeData = {};

        switch (discountOn) {
            case "BxGy": {
                discountCodeData = {
                    ...commonData, additionalData: {
                        BxGy: BxGyData,
                        AOffP: {},
                        AOffO: {},
                        FS: {}
                    }
                }
                break;
            }

            case "AOffP": {
                discountCodeData = {
                    ...commonData, additionalData: {
                        BxGy: {},
                        AOffP: AOffPData,
                        AOffO: {},
                        FS: {}
                    }
                }
                break;
            }
            case "AOffO": {
                discountCodeData = {
                    ...commonData, additionalData: {
                        BxGy: {},
                        AOffP: {},
                        AOffO: AOffOData,
                        FS: {}
                    }
                }
                break;
            }
            case "FS": {
                discountCodeData = {
                    ...commonData, additionalData: {
                        BxGy: {},
                        AOffP: {},
                        AOffO: {},
                        FS: FSData
                    }
                }
                break;
            }
        }

        axiosHttp.post(`/discount`, discountCodeData).then(res => {
            // console.log(res.data)
            if (res.data.status) {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Discount code created!",
                    showConfirmButton: false,
                    timer: 1500
                });

                router.push("/dashboard/discount");
            }
            else {
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: res.data.message,
                });
            }
        })
            .catch(error => {
                console.log(error);
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: error.message,
                });
            })
    }

    const handleDiscard = () => {
        Swal.fire({
            title: "Discard all unsaved changes?",
            text: "If you discard changes, you'll delete any edits you made since you last saved.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push("/dashboard/discount");
            }
        })

    }

    return (
        <div className='px-5 pb-16 w-full'>
            {isLoading ? <Loader /> :
                <>
                    <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
                        <div className='flex items-center gap-2'>
                            <Link href={"/dashboard/discount"} className="text-xl font-semibold">All Discount Codes</Link>
                            <IoIosArrowForward />
                            <h4 className="text-xl font-semibold text-blue-500">Create discount code</h4>
                        </div>

                        <div className='flex items-center gap-2'>
                            <button disabled={title.length == 0} onClick={() => { handleDiscard() }} className={`flex gap-2 items-center bg-[#FFC520] ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Discard</button>
                            <button disabled={title.length == 0} onClick={handleSave} className={`flex gap-2 items-center bg-green-500 ${title.length == 0 ? "opacity-50" : "hover:bg-opacity-80"} py-2 px-4 rounded-lg font-semibold cursor-pointer`}>Save</button>
                        </div>
                    </div>

                    {/* discount form */}

                    <div className="space-y-5 w-4/5 mx-auto">
                        <div className='mb-5'>
                            <img src="https://i.ibb.co/wQh5YJz/percentage.png" alt="" className='w-20 mx-auto' />
                            <h4 className="text-xl font-semibold text-center">Create new discount code</h4>
                        </div>
                        {/* Discount type */}
                        <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md flex flex-col justify-center items-center'>
                            <h3 className='text-lg font-semibold'>Select Discount Code Type</h3>
                            {/* <div className='w-full border-b-2 border-black'></div> */}
                            <RadioGroup
                                onChange={(e) => setDiscountOn(e.target.value)}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="BxGy" control={<Radio />} label="But X Get Y" />
                                <FormControlLabel value="AOffP" control={<Radio />} label="Amount off product" />
                                <FormControlLabel value="AOffO" control={<Radio />} label="Amount off order" />
                                <FormControlLabel value="FS" control={<Radio />} label="Free Shipping" />
                            </RadioGroup>
                        </div>
                    </div>

                    {
                        discountOn && <div className="mt-5 space-y-5 w-4/5 mx-auto">
                            {/* Title & status */}
                            <div className="bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md flex items-center gap-2">
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
                                    <Select onChange={(selectedOptions) => setSelectedStatus(selectedOptions)}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select status.."
                                        isClearable={false}
                                        isSearchable={true}
                                        name="status"
                                        options={statusOptions}
                                    />
                                </div>
                            </div>

                            {//no:1 Buy x Get y
                                discountOn == "BxGy" && <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                    <h3 className='text-md font-semibold'>Customers {BxGyType}</h3>
                                    <RadioGroup value={BxGyType}
                                        onChange={(e) => { setBxGyType(e.target.value); setMinPhrReqValue(0) }}
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="buys" control={<Radio />} label="Minimum quantity of items" />
                                        <FormControlLabel value="spends" control={<Radio />} label="Minimum purchase amount" />

                                        <div className='space-y-3 mt-2'>
                                            <div className='grid grid-cols-3 gap-3 justify-center items-center'>
                                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                                    <span>
                                                        {BxGyType == "buys" ? "Quantity" : "Amount"}
                                                    </span>
                                                    <input onChange={(e) => setBxGyCusBuyAmount(e.target.value)} required min={0} type="number" name="name" id="name"
                                                        className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder='Enter value..' />

                                                </div>
                                                <div className="col-span-2 !w-full space-y-1">
                                                    <span>
                                                        Any items from
                                                    </span>
                                                    <Select
                                                        onChange={(selectedOptions) => { setSelectCatOrProdBuy(selectedOptions); setSelectCatOrProdBuyArray([]) }}
                                                        className="basic-single z-30"
                                                        classNamePrefix="select"
                                                        placeholder="Select category / products"
                                                        isClearable={false}
                                                        isSearchable={true}
                                                        name="discountCategory"
                                                        options={[
                                                            { value: "category", label: "Specific Categories" },
                                                            { value: "products", label: "Specific Products" }
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <Select
                                                    value={selectCatOrProdBuyArray}
                                                    onChange={(selectedOptions) => setSelectCatOrProdBuyArray(selectedOptions)}
                                                    isMulti
                                                    isClearable={false}
                                                    name={`${disCategoryOption}`}
                                                    className="basic-multi-select !z-20"
                                                    placeholder={`Select...`}
                                                    options={selectCatOrProdBuy.value == "products" ? productsData : categoryData}
                                                    components={{ Option: CustomOption }}
                                                />
                                            </div>
                                        </div>

                                        <div className='w-full mt-5 py-3'>
                                            <h3 className='text-md font-semibold'>Customer gets</h3>
                                            <p className='py-3 text-gray-500'>Customers must add the quantity of items specified below to their cart.</p>
                                        </div>

                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-3 gap-3 justify-center items-center'>
                                                <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                                    <span>
                                                        Quantity
                                                    </span>
                                                    <input onChange={(e) => setBxGyCusGetAmount(e.target.value)} required min={0} type="number" name="name" id="name"
                                                        className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder='Enter value..' />

                                                </div>
                                                <div className="col-span-2 !w-full space-y-1">
                                                    <span>
                                                        Any items from
                                                    </span>
                                                    <Select
                                                        onChange={(selectedOptions) => { setSelectCatOrProdGet(selectedOptions); setSelectCatOrProdGetArray([]) }}
                                                        className="basic-single z-10"
                                                        classNamePrefix="select"
                                                        placeholder="Select category / products"
                                                        isClearable={false}
                                                        isSearchable={true}
                                                        name="discountCategory"
                                                        options={[
                                                            { value: "category", label: "Specific Categories" },
                                                            { value: "products", label: "Specific Products" }
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <Select
                                                    value={selectCatOrProdGetArray}
                                                    onChange={(selectedOptions) => setSelectCatOrProdGetArray(selectedOptions)}
                                                    isMulti
                                                    isClearable={false}
                                                    name={`${disCategoryOption}`}
                                                    className="basic-multi-select"
                                                    placeholder={`Select...`}
                                                    options={selectCatOrProdGet.value == "products" ? productsData : categoryData}
                                                    components={{ Option: CustomOption }}
                                                />
                                            </div>
                                        </div>

                                        <div className='mt-5'>
                                            <h3 className='text-md font-medium'>At a discounted value</h3>
                                            <RadioGroup value={BxGyDiscountedOption}
                                                onChange={(e) => { setBxGyDiscountedOption(e.target.value) }}
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                            >
                                                <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                                                {
                                                    BxGyDiscountedOption == "percentage" && <div className='ml-7 space-y-1'>
                                                        <input onBlur={(e) => setBxGyDiscountedValue(e.target.value)} min={0} type="number" name="" id="minPhrReqValue" placeholder={`Enter value..`} className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                                    </div>
                                                }
                                                <FormControlLabel value="amount" control={<Radio />} label="Amount off each" />
                                                {
                                                    BxGyDiscountedOption == "amount" && <div className='ml-7 space-y-1'>
                                                        <input onBlur={(e) => setBxGyDiscountedValue(e.target.value)} min={0} type="number" name="" id="minPhrReqValue" placeholder={`Enter value..`} className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                                    </div>
                                                }
                                                <FormControlLabel value="free" control={<Radio />} label="Free" />
                                            </RadioGroup>
                                        </div>

                                        <p className='border-t border-gray-300 w-full my-3'></p>

                                        <div>
                                            <FormControlLabel className='block' control={<Checkbox onChange={(e) => { setBxGyMaxUserOption(e.target.checked) }} />} label="Set a maximum number of uses per order" />
                                            {
                                                BxGyMaxUserOption && <div className='ml-7'>
                                                    <input onBlur={(e) => setBxGyMaxUserValue(e.target.value)} min={1} type="number" name="" id="minPhrReqValue" placeholder='Enter value..' className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                                </div>
                                            }
                                        </div>


                                    </RadioGroup>

                                </div>
                            }

                            { //no:2 & 3 amount off on product/order
                                (discountOn == "AOffP" || discountOn == "AOffO") && <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                    {/* common field */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                            <span>
                                                Discount Type * <small>(Fixed / Percentage)</small>
                                            </span>
                                            <Select
                                                onChange={(selectedOptions) => setDisCategoryOption(selectedOptions)}
                                                // value={disCategoryOption}
                                                className="basic-single !z-20"
                                                classNamePrefix="select"
                                                placeholder="Select discount type.."
                                                isClearable={false}
                                                isSearchable={true}
                                                name="discountCategory"
                                                options={[
                                                    { value: "Fixed", label: "Fixed" },
                                                    { value: "Percentage", label: "Percentage" }
                                                ]}
                                            />
                                        </div>
                                        <div className="w-full space-y-1 md:max-w-full lg:max-w-md">
                                            <span>
                                                Amount * <small>(Fixed / Percentage)</small>
                                            </span>
                                            <input onChange={(e) => setDisCategoryValue(e.target.value)} required type="number" name="Amount" id="Amount"
                                                className="rounded-md w-full border border-gray-300 px-2 py-[5px] outline-1 outline-[#0086fe]" placeholder='Enter discount amount..' />

                                        </div>
                                    </div>
                                    {/* field for order 2 */}
                                    {
                                        discountOn == "AOffP" && <div className='mt-3 space-y-2'>
                                            <h3 className='text-md font-medium'>Applies to</h3>
                                            <Select
                                                onChange={(selectedOptions) => { setSelectCatOrProd(selectedOptions); setSelectCatOrProdArray([]) }}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                placeholder="Select category / products"
                                                isClearable={false}
                                                isSearchable={true}
                                                name="discountCategory"
                                                options={[
                                                    { value: "category", label: "Specific Categories" },
                                                    { value: "products", label: "Specific Products" }
                                                ]}
                                            />

                                            <Select
                                                value={selectCatOrProdArray}
                                                onChange={(selectedOptions) => setSelectCatOrProdArray(selectedOptions)}
                                                isMulti
                                                isClearable={false}
                                                name={`${disCategoryOption}`}
                                                className="basic-multi-select"
                                                placeholder={`Select...`}
                                                options={selectCatOrProd.value == "products" ? productsData : categoryData}
                                                components={{ Option: CustomOption }}
                                            />
                                        </div>
                                    }
                                </div>
                            }

                            { //no:4 | Free shipping
                                discountOn == "FS" && <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                    <h3 className='text-md font-semibold'>Countries</h3>
                                    <RadioGroup value={freeShipping}
                                        onChange={(e) => { setFreeShipping(e.target.value) }}
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="all" control={<Radio />} label="All countries" />
                                        <FormControlLabel value="specific" control={<Radio />} label="Selected countries" />
                                    </RadioGroup>
                                    {freeShipping == "specific" &&
                                        <div className='mt-3 space-y-2'>
                                            <Select
                                                isMulti
                                                onChange={(selectedOptions) => setFreeShippingCountries(selectedOptions)}
                                                className="basic-single z-20"
                                                classNamePrefix="select"
                                                placeholder="Select countries.."
                                                isClearable={false}
                                                isSearchable={true}
                                                name="freeShippingCountry"
                                                options={allCountryData}
                                                components={{ Option: CustomOption }}
                                            />
                                        </div>
                                    }
                                    <h3 className='text-md font-medium mt-4'>Shipping rates</h3>
                                    <FormControlLabel control={<Checkbox onChange={(e) => { setShippingRateOPOption(e.target.checked) }} />} label="Exclude shipping rates over a certain amount" />
                                    {
                                        shippingRateOPOption && <div className='ml-7 space-y-1'>
                                            <input onBlur={(e) => setShippingRateOPValue(e.target.value)} min={0} type="number" name="" id="shippingRateOPValue" placeholder={`Enter amount..`} className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                            <br />
                                            <label className='text-sm text-gray-500' htmlFor="minPhrReqValue">Over how much € discount code will apply.</label>
                                        </div>
                                    }
                                </div>
                            }

                            {/* common options: Minimum purchase requirement */}
                            <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                <h3 className='text-md font-semibold'>Minimum purchase requirement</h3>
                                <RadioGroup value={minPhrReqOption}
                                    onChange={(e) => { setMinPhrReqOption(e.target.value); setMinPhrReqValue(0) }}
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="no" control={<Radio />} label="No minimum requirements" />
                                    <FormControlLabel value="amount" control={<Radio />} label="Minimum purchase amount (€)" />
                                    {
                                        minPhrReqOption == "amount" && <div className='ml-7 space-y-1'>
                                            <input onBlur={(e) => setMinPhrReqValue(e.target.value)} min={0} type="number" name="" id="minPhrReqValue" placeholder={`Enter ${minPhrReqOption}..`} className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                            <br />
                                            <label className='text-sm text-gray-500' htmlFor="minPhrReqValue">Applies only to selected collections.</label>
                                        </div>
                                    }
                                    <FormControlLabel value="items" control={<Radio />} label="Minimum quantity of items" />
                                    {
                                        minPhrReqOption == "items" && <div className='ml-7 space-y-1'>
                                            <input onBlur={(e) => setMinPhrReqValue(e.target.value)} min={0} type="number" name="" id="minPhrReqValue" placeholder={`Enter ${minPhrReqOption}..`} className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                            <br />
                                            <label className='text-sm text-gray-400' htmlFor="minPhrReqValue">Applies only to selected collections.</label>
                                        </div>
                                    }
                                </RadioGroup>

                            </div>

                            {/* Customer eligibility */}
                            <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                <h3 className='text-md font-semibold'>Customer eligibility</h3>
                                <RadioGroup value={eligibilityOption}
                                    onChange={(e) => { setEligibilityOption(e.target.value) }}
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="all" control={<Radio />} label="All customers" />
                                    <FormControlLabel value="specific" control={<Radio />} label="Specific customer segments" />
                                </RadioGroup>
                                {
                                    eligibilityOption == "specific" && <div className="ml-7 space-y-1 w-full">
                                        <Select onChange={(selectedOptions) => setEligibilityValue(selectedOptions)}
                                            className="basic-single w-1/4 "
                                            classNamePrefix="select"
                                            placeholder="Select.."
                                            isClearable={false}
                                            isSearchable={true}
                                            name="eligibilityValue"
                                            options={eligibilityList}
                                        />
                                        <label className='text-sm' htmlFor="eligibilityValue">Applies only to selected collections.</label>
                                    </div>
                                }
                            </div>

                            {/* Max Uses of discount code */}
                            <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md'>
                                <h3 className='text-md font-semibold'>Maximum discount uses</h3>
                                <div>
                                    <FormControlLabel control={<Checkbox onChange={(e) => { setLimitDisOption(e.target.checked) }} />} label="Limit number of times this discount can be used in total" />
                                </div>
                                {
                                    limitDisOption && <div className='ml-7'>
                                        <input onBlur={(e) => setLimitDisValue(e.target.value || 0)} min={1} type="number" name="" id="minPhrReqValue" placeholder='Enter value..' className='w-1/4 py-1 px-2 outline-1 outline-[#0086fe] border border-gray-300 rounded-md' />
                                    </div>
                                }
                                <div>
                                    <FormControlLabel control={<Checkbox onChange={(e) => { setLimitDisOnePerUse(e.target.checked) }} />} label="Limit to one use per customer" />
                                </div>
                            </div>

                            {/* Active dates */}
                            <div className='bg-white p-5 rounded-xl border border-[#d5ddda] shadow-md space-y-2'>
                                <h3 className='text-md font-semibold mb-5'>Active dates</h3>
                                <div className="w-full flex justify-center items-center gap-2">
                                    <DatePicker format="DD/MM/YYYY" onChange={(newDate) => { setStartDate({ year: newDate?.$y, month: (newDate?.$M + 1), Day: newDate?.$D }) }} label="Start date" className='w-full' defaultValue={dayjs(defaultDateTime)} />
                                    <TimePicker label="Start time (+06)" className='w-full' defaultValue={dayjs(defaultDateTime)} onChange={(newDate) => { setStartTime({ hour: newDate?.$H, min: newDate?.$m }) }} />
                                </div>
                                <FormControlLabel control={<Checkbox onChange={(e) => { setIsEndTime(e.target.checked) }} />} label="Set end date" />
                                {
                                    isEndTime && <div className="w-full flex justify-center items-center gap-2 mt-3">
                                        <DatePicker format="DD/MM/YYYY" label="End date" className='w-full' defaultValue={dayjs(defaultDateTime)} onChange={(newDate) => { setEndDate({ year: newDate?.$y, month: (newDate?.$M + 1), Day: newDate?.$D }) }} />
                                        <TimePicker label="End time (+06)" className='w-full' defaultValue={dayjs(defaultDateTime)} onChange={(newDate) => { setEndTime({ hour: newDate?.$H, min: newDate?.$m }) }} />
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </>}
        </div>
    );
};

export default page;