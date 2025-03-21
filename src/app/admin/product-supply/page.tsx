import ProductSupply from "@/components/ProductSupply";
import React, { Suspense } from "react";
import style from "../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <ProductSupply />
    </Suspense>
  );
};

export default Page;
