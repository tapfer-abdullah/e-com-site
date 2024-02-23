"use client";
import Loader from "@/Hooks/Loader/Loader";
import React from "react";

const DBTypesForm = ({ children, autoURL, setAutoURL, isLoading, data, setReset, imgUrl, setImgUrl, handleSubmit }) => {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col justify-center items-center mb-5">
        <img src="https://i.ibb.co/Z2jPjWq/data-collection.png" alt="form-img" className="w-28 h-28" />
        <h1 className="text-xl font-semibold">{children} Type</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 items-center">
        <div className="space-y-1">
          <label htmlFor="newCategory">
            Type * <small className="text-sm text-gray-600">(Title {children == "Update" && <>is unchangeable</>})</small>
          </label>
          <input
            onBlur={(e) => {
              setAutoURL(`/${e.target.value.replace(/\s+/g, "-").replace(/-$/, "")}`);
            }}
            disabled={children == "Update"}
            type="text"
            required
            defaultValue={data?.title}
            name="title"
            id="newCategory"
            placeholder="Enter title.."
            className="border border-black w-full px-2 py-1 outline-1"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="newType">
            Visible in navbar * <small className="text-sm text-gray-600">(Yes ? No)</small>
          </label>
          <select name="visibility" defaultValue={"xx"} required id="newType" className="border border-black w-full px-2 py-[6px] outline-1">
            <option value="xx" disabled>
              Choose visibility..
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        <div className="space-y-1 relative">
          <label htmlFor="typeImg">Image URL *</label>
          <input
            onChange={(e) => setImgUrl(e.target.value)}
            type="text"
            required
            defaultValue={data?.img}
            name="img"
            id="typeImg"
            placeholder="Enter Img URL.."
            className="border border-black w-full px-2 py-1 outline-1 pl-9"
          />
          <img src={data?.img || imgUrl} alt="img" className="w-7 h-7 absolute left-1 bottom-1" />
        </div>
        <div className="space-y-1">
          <label htmlFor="typeURL">
            Type URL * <small className="text-sm text-gray-600">(Auto generated link)</small>
          </label>
          <input
            type="text"
            required
            value={data?.url.toLowerCase() || autoURL.toLowerCase()}
            name="url"
            id="typeURL"
            placeholder="Enter category URL.."
            className="border border-black w-full px-2 py-1 outline-1"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <label htmlFor="categoryDescription">
            Small description <small className="text-sm text-gray-600">(optional)</small>
          </label>
          <textarea
            defaultValue={data?.description}
            name="description"
            id="categoryDescription"
            rows="3"
            placeholder="Enter small description.."
            className="border border-black w-full px-2 py-1 outline-1"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" onClick={() => setReset("reset")} className={` py-1 bg-green-500 w-full uppercase text-lg font-semibold hover:bg-opacity-90 transition-all duration-300`}>
          Reset
        </button>
        <button type="submit" className="py-1 bg-[#FFC520] w-full uppercase text-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
          {children}
        </button>
      </div>
    </form>
  );
};

export default DBTypesForm;
