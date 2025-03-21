import Payment from "@/components/Payment";
import React, { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <Payment typePayment="edit" typeCustomer="traders" />
    </Suspense>
  );
};

export default Page;
