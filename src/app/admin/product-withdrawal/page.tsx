import ProductWithdrawal from "@/components/ProductWithdrawal";
import React, { Suspense } from "react";
import style from "../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <ProductWithdrawal />
    </Suspense>
  );
};

export default Page;
