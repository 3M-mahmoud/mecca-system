import EditInstallment from "@/components/EditInstallment";
import { Suspense } from "react";
import style from "../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditInstallment />
    </Suspense>
  );
};

export default Page;
