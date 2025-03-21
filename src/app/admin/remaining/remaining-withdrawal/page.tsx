import RemainingWithdrawal from "@/components/RemainingWithdrawal";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <RemainingWithdrawal />
    </Suspense>
  );
};

export default Page;
