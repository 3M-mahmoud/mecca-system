import TraderWithdrawal from "@/components/TraderWithdrawal";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <TraderWithdrawal />
    </Suspense>
  );
};

export default Page;
