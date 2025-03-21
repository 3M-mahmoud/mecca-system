import EditSupply from "@/components/EditSupply";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditSupply />
    </Suspense>
  );
};

export default Page;
