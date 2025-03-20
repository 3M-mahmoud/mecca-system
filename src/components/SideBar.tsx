"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// import icons
import { AiOutlineProduct } from "react-icons/ai";
import { TbBrandProducthunt } from "react-icons/tb";
import { PiTrademarkRegistered } from "react-icons/pi";
import { IoPersonAddOutline } from "react-icons/io5";
import { useEffect } from "react";

const SideBar = () => {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 2).join("/");
  const [linkItemActive, setItemSelected] = useState<string | null>(null);
  // const c = localStorage.getItem("linkItemActive");
  const handleClick = (index: string) => {
    // localStorage.setItem("linkItemActive", index);
    setItemSelected(index);
  };
  useEffect(() => {
    // const storedItem = localStorage.getItem("linkItemActive");
    setItemSelected("1");
  }, []);
  return (
    <div className="sidebar max-w-64 p-4 shadow-xl bg-white relative">
      <h3 className="mt-0 mb-8 text-center text-sm md:text-xl font-bold">
        mecca
      </h3>
      <ul>
        <li>
          <Link
            href="/admin"
            onClick={() => handleClick("1")}
            className={`${
              linkItemActive === "1" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <AiOutlineProduct />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              المنتجات
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/add-product`}
            onClick={() => handleClick("2")}
            className={`${
              linkItemActive === "2" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <TbBrandProducthunt />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              أضافة منتج
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/traders`}
            onClick={() => handleClick("3")}
            className={`${
              linkItemActive === "3" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <PiTrademarkRegistered />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              التجار
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/add-traders`}
            onClick={() => handleClick("4")}
            className={`${
              linkItemActive === "4" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <IoPersonAddOutline />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              إضافة تاجر
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/remaining`}
            onClick={() => handleClick("5")}
            className={`${
              linkItemActive === "5" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <PiTrademarkRegistered />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              البواقي
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/add-remaining`}
            onClick={() => handleClick("6")}
            className={`${
              linkItemActive === "6" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <IoPersonAddOutline />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              إضافة عميل بواقي
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/installments`}
            onClick={() => handleClick("7")}
            className={`${
              linkItemActive === "7" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <PiTrademarkRegistered />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              الاقساط
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={`${basePath}/add-installments`}
            onClick={() => handleClick("8")}
            className={`${
              linkItemActive === "8" ? "bg-[#f6f6f6]" : ""
            } flex items-center text-sm text-black p-3 rounded-md hover:bg-[#f6f6f6]`}
          >
            <IoPersonAddOutline />
            <span className="text-sm font-medium mr-2 hidden md:block text-nowrap">
              إضافة عميل إقساط
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
