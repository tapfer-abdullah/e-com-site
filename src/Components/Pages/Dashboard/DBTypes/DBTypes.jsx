"use client";
import DBCollectionTypeCard from "@/Components/CustomComponents/DBCollectionTypeCard/DBCollectionTypeCard";
import DBModal from "@/Components/CustomComponents/Modals/DBModal";
import { axiosHttp } from "@/app/helper/axiosHttp";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { FaChevronCircleRight } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import DBTypesForm from "./DBTypesForm";

const DBTypes = () => {
  const [activeType, setActiveType] = useState("");
  const [typeData, setTypeData] = useState([]);

  const [productsData, setProductsData] = useState([]);
  const [isReset, setReset] = useState("");
  const [imgUrl, setImgUrl] = useState("https://i.ibb.co/NSYqCtV/image.png");
  const [refetch, setRefetch] = useState(0);
  const [collectionInfo, setCollectionInfo] = useState({});
  const [collectionOldData, setCollectionOldData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [autoURL, setAutoURL] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const handleCloseUpdate = () => setOpenUpdate(false);
  const handleOpenUpdate = () => setOpenUpdate(true);

  useEffect(() => {
    axiosHttp
      .get(`/types`)
      .then((res) => {
        setTypeData(res.data);
        setActiveType(res.data?.[0]?.title);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [refetch]);

  useEffect(() => {
    axiosHttp
      .get(`/collections?type=${activeType}`)
      .then((res) => {
        setProductsData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [activeType, refetch]);

  const handleCreateType = (event) => {
    event.preventDefault();
    const form = event.target;
    if (isReset == "reset") {
      form.reset();
      setReset("");
      return;
    }

    const title = form.title.value;
    const visibility = form.visibility.value;
    const img = form.img.value;
    const url = form.url.value;
    const description = form.description.value;

    const typeData = { title, visibility, img, url, description };

    axiosHttp
      .post("/types", typeData)
      .then((res) => {
        form.reset();
        setRefetch(refetch + 1);
        setReset("");
        handleClose();
        if (res.data?.status) {
          Swal.fire({
            title: "Created!",
            text: "Type has been created.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Unable!",
            text: res?.data?.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateType = (event) => {
    event.preventDefault();
    const form = event.target;
    if (isReset == "reset") {
      form.reset();
      setReset("");
      return;
    }

    const title = form.title.value;
    const visibility = form.visibility.value;
    const img = form.img.value;
    const url = form.url.value;
    const description = form.description.value;

    const typeData = { title, visibility, img, url, description };

    axiosHttp
      .put(`types/${collectionInfo?.id}`, typeData)
      .then((res) => {
        form.reset();
        setRefetch(refetch + 1);
        setReset("");
        handleCloseUpdate();
        if (res.data?.status) {
          Swal.fire({
            title: "Updated!",
            text: "Type has been updated.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Unable!",
            text: "Unable to update type.",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteCollection = (id) => {
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
        axiosHttp.delete(`types/${id}`).then((res) => {
          if (res.data?.status) {
            setRefetch(refetch + 1);
            Swal.fire({
              title: "Deleted!",
              text: "Type has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Unable!",
              text: "Unable to delete Type.",
              icon: "error",
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    const { id } = collectionInfo;

    axiosHttp
      .get(`/types/${id}`)
      .then((res) => {
        setCollectionOldData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [collectionInfo, imgUrl]);

  return (
    <div>
      <DBModal open={open} handleClose={handleClose}>
        <DBTypesForm autoURL={autoURL} setAutoURL={setAutoURL} imgUrl={imgUrl} setReset={setReset} setImgUrl={setImgUrl} handleSubmit={handleCreateType}>
          Create
        </DBTypesForm>
      </DBModal>
      <DBModal open={openUpdate} handleClose={handleCloseUpdate}>
        <DBTypesForm isLoading={isLoading} data={collectionOldData} imgUrl={imgUrl} setReset={setReset} setImgUrl={setImgUrl} handleSubmit={handleUpdateType}>
          Update
        </DBTypesForm>
      </DBModal>

      <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
        <h1 className="text-xl font-semibold">All Available Types</h1>

        <button onClick={handleOpen} className="flex gap-2 items-center bg-white py-2 px-4 rounded-lg font-semibold cursor-pointer">
          <IoMdAdd className="text-xl" />
          <span>New Type</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          {typeData?.map((d) => (
            <DBCollectionTypeCard
              setLoading={setLoading}
              key={d?._id}
              setInfo={setCollectionInfo}
              handleOpen={handleOpenUpdate}
              handleDelete={handleDeleteCollection}
              activeType={activeType}
              setActiveType={setActiveType}
              data={d}
            />
          ))}
        </div>

        <div className="m-2 rounded-lg bg-[#def1e7]">
          <h3 className="text-xl font-semibold py-2 text-center">
            Collections of {activeType} type ({productsData.length})
          </h3>
          {productsData.length == 0 && (
            <div className="flex flex-col justify-center items-center">
              <img src="https://i.ibb.co/Nmm2QxV/empty-cart.png" alt="no-product-img" className="w-72 h-auto" />
              <p className="text-md font-semibold text-red-500">The type is empty!</p>
            </div>
          )}

          <div className="px-5">
            {productsData?.map((c) => (
              <div key={c?._id} className="">
                <div className="flex gap-3 items-center border-dashed border-2 border-gray-400 my-2 p-2 rounded-lg drop-shadow-2xl">
                  <img src={c?.img} alt="img" className="w-20 h20" />
                  <div className="w-full pl-2 pr-5 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Title: {c?.title}</h3>
                      <p className="text-blue-700 flex items-center gap-1">
                        <AiOutlineLink className="text-lg font-semibold text-gray-600" />
                        <span>{c?.url}</span>
                      </p>
                    </div>
                    <Link href={"/dashboard/products/collections"}>
                      <FaChevronCircleRight className="text-3xl font-semibold" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBTypes;
