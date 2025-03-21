import EditProduct from "@/components/EditProduct";
import { Suspense } from "react";
import style from "../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <EditProduct />
    </Suspense>
  );
};

export default Page;
