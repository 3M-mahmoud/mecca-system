import EditInstalment from "@/components/EditInstalment";
import { Suspense } from "react";
import style from "../../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditInstalment />
    </Suspense>
  );
};

export default Page;
