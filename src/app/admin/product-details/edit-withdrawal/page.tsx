import EditProductWithdrawal from "@/components/EditProductWithdrawal";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditProductWithdrawal />
    </Suspense>
  );
};

export default Page;
