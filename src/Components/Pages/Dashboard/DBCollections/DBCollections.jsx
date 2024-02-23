"use client";
import DBCollectionTypeCard from "@/Components/CustomComponents/DBCollectionTypeCard/DBCollectionTypeCard";
import DBModal from "@/Components/CustomComponents/Modals/DBModal";
import { axiosHttp } from "@/app/helper/axiosHttp";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import DBFilteredProductCard from "../DBCards/DBFilteredProductCard";
import DBCollectionForm from "./DBCollectionForm";

const DBCollections = () => {
  const [activeType, setActiveType] = useState("");
  const [collectionData, setCollectionData] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [productsData, setProductsData] = useState([]);
  const [isReset, setReset] = useState("");
  const [imgUrl, setImgUrl] = useState("https://i.ibb.co/NSYqCtV/image.png");
  const [allTypes, setAllTypes] = useState([]);
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
      .get(`/collections`)
      .then((res) => {
        setCollectionData(res.data);
        setActiveType(res.data?.[0]?.title);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [refetch]);

  useEffect(() => {
    axiosHttp
      .get(`/products?category=${activeType}&status=${filterOption}`)
      .then((res) => {
        setProductsData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [filterOption, activeType, refetch]);

  useEffect(() => {
    axiosHttp
      .get("/types")
      .then((res) => {
        setAllTypes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCreateCollection = (event) => {
    event.preventDefault();
    const form = event.target;
    if (isReset == "reset") {
      form.reset();
      setReset("");
      return;
    }

    const title = form.title.value;
    const type = form.type.value;
    const img = form.img.value;
    const url = form.url.value;
    const description = form.description.value;

    const typeData = { title, type, img, url, description };

    axiosHttp
      .post("/collections", typeData)
      .then((res) => {
        form.reset();
        setRefetch(refetch + 1);
        setReset("");
        handleClose();
        if (res.data?.status) {
          Swal.fire({
            title: "Created!",
            text: "Collection has been created.",
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

  const handleUpdateCollection = (event) => {
    event.preventDefault();
    const form = event.target;
    if (isReset == "reset") {
      form.reset();
      setReset("");
      return;
    }

    const title = form.title.value;
    const type = form.type.value;
    const img = form.img.value;
    const url = form.url.value;
    const description = form.description.value;

    const collectionData = { title, type, img, url, description };
    console.log(collectionData);

    axiosHttp
      .put(`collections/${collectionInfo?.id}`, collectionData)
      .then((res) => {
        form.reset();
        setRefetch(refetch + 1);
        setReset("");
        handleCloseUpdate();
        if (res.data?.status) {
          Swal.fire({
            title: "Updated!",
            text: "Collection has been updated.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Unable!",
            text: "Unable to update collection.",
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
        axiosHttp.delete(`collections/${id}`).then((res) => {
          if (res.data?.status) {
            setRefetch(refetch + 1);
            Swal.fire({
              title: "Deleted!",
              text: "Collection has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Unable!",
              text: "Unable to delete collection.",
              icon: "error",
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    const field = collectionInfo?.id;

    if (field && field != "Types") {
      axiosHttp
        .get(`/collections/${collectionInfo?.id}`)
        .then((res) => {
          setCollectionOldData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [collectionInfo, imgUrl]);

  return (
    <div>
      <DBModal open={open} handleClose={handleClose}>
        <DBCollectionForm autoURL={autoURL} setAutoURL={setAutoURL} imgUrl={imgUrl} setReset={setReset} setImgUrl={setImgUrl} allTypes={allTypes} handleSubmit={handleCreateCollection}>
          Create
        </DBCollectionForm>
      </DBModal>
      <DBModal open={openUpdate} handleClose={handleCloseUpdate}>
        <DBCollectionForm isLoading={isLoading} data={collectionOldData} imgUrl={imgUrl} setReset={setReset} setImgUrl={setImgUrl} allTypes={allTypes} handleSubmit={handleUpdateCollection}>
          Update
        </DBCollectionForm>
      </DBModal>

      <div className="mb-5 flex justify-between items-center px-3 py-2 bg-[#d5ddda] shadow-lg rounded-lg">
        <h1 className="text-xl font-semibold">All Available Collections</h1>
        <div className="flex items-center gap-3 px-2">
          <button onClick={handleOpen} className="flex gap-2 items-center bg-white p-2 rounded-lg font-semibold cursor-pointer">
            <IoMdAdd className="text-xl" />
            <span>New Collection</span>
          </button>

          <select
            defaultValue={"Filter-Type"}
            onChange={(e) => setFilterOption(e.target.value)}
            name="filterType"
            id="filterType"
            className="py-2 pl-2 pr-5 text-lg font-semibold outline-0 rounded-md"
          >
            <option disabled value="Filter-Type">
              Filter Products
            </option>
            <option value="All">All Products</option>
            <option value="Active">Active Products</option>
            <option value="Draft">Drafted Products</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          {collectionData.length > 0 &&
            collectionData?.map((d) => (
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
            Products of {activeType} collection ({productsData.length})
          </h3>
          <DBFilteredProductCard productsData={productsData} />
        </div>
      </div>
    </div>
  );
};

export default DBCollections;
