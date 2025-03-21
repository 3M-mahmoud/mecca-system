import CreateInstalment from "@/components/CreateInstalment";
import { Suspense } from "react";
import style from "../../../loader.module.css";
const Page = () => {
  return (
    <Suspense fallback={<div className={style.loader}></div>}>
      <CreateInstalment />
    </Suspense>
  );
};

export default Page;
