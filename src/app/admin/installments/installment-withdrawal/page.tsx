import WithdrawalInstallment from "@/components/WithdrawalInstallment";
import { Suspense } from "react";
import style from "../../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <WithdrawalInstallment />
    </Suspense>
  );
};

export default Page;
