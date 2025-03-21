import EditProductSupply from "@/components/EditProductSupply";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditProductSupply />
    </Suspense>
  );
};

export default Page;
