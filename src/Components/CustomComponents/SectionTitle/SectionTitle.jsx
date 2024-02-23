"use client";

const SectionTitle = ({ title, subTitle }) => {
  return (
    <div className="text-center lg:w-1/2 mx-auto space-y-2 my-10">
      <h4 className="text-xl font-semibold">{title}</h4>
      <p>{subTitle}</p>
    </div>
  );
};

export default SectionTitle;
