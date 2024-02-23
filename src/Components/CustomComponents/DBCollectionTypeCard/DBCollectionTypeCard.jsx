"use client";
import { AiOutlineLink } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const DBCollectionTypeCard = ({ handleOpen, setLoading, setInfo, data, activeType, setActiveType, handleDelete }) => {
  return (
    <div
      className={`flex gap-3 items-center justify-between text-[#333333] shadow-lg my-3 rounded-md cursor-pointer transition-all duration-300 ${
        activeType == data?.title ? "scale-105 bg-[#7aebba]" : "bg-[#82d9b3]"
      }`}
    >
      <img
        onClick={() => {
          setActiveType(data?.title);
        }}
        src={data?.img}
        alt="type img"
        className="w-32 h-full rounded-s-md"
      />
      <div
        onClick={() => {
          setActiveType(data?.title);
        }}
        className="flex-grow py-1 space-y-1"
      >
        <h2 className="text-lg font-semibold">
          {data?.title} {data?.type && <small className="text-sm ml-1 text-blue-600">({data.type})</small>}
          {data?.visibility && <small className="text-sm ml-1 text-blue-600">(Visibility: {data?.visibility})</small>}
        </h2>
        <p>{data?.description}</p>
        <p className="flex gap-1 items-center">
          <AiOutlineLink className="text-lg" />
          <span className="text-blue-600">{data?.url}</span>
        </p>
      </div>
      <div className="p-2 flex flex-col justify-center items-center gap-3">
        <FaEdit
          onClick={() => {
            setLoading(true);
            setInfo({ id: data?._id, field: data?.type || "types" });
            handleOpen();
          }}
          className="text-xl cursor-pointer"
        />
        <MdDelete onClick={() => handleDelete(data?._id)} className="text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default DBCollectionTypeCard;
