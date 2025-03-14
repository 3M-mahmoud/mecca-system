import React from "react";
import AddProductForm from "./AddProductForm";

const page = () => {
  return (
    <div className="p-5">
      <h2 className="text-xl sm:text-2xl font-bold mx-5">إضافة منتج جديد</h2>
      <AddProductForm />
    </div>
  );
};

export default page;
