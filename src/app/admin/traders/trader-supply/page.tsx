import TraderSupply from "@/components/TraderSupply";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <TraderSupply />
    </Suspense>
  );
};

export default Page;
