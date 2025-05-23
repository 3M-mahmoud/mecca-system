import EditWithdrawal from "@/components/EditWithdrawal";
import { Suspense } from "react";
import style from "../../../loader.module.css";

const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditWithdrawal />
    </Suspense>
  );
};

export default Page;
