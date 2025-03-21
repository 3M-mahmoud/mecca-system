"use client";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { CiLogout } from "react-icons/ci";
const Navbar = ({ children, payload }: any) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const router = useRouter();
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const logoutHandler = async () => {
    try {
      await axios.get(`${DOMAIN}/api/users/logout`);
      router.replace("/");
      toast.success("Logout");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <>
      {/* زر Toggle لشاشات الموبايل */}
      <button
        onClick={toggleNav}
        className="text-[#0084dd] focus:outline-none sm:hidden"
      >
        {!isNavOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
      <nav
        className={`${
          isNavOpen ? "block" : "hidden"
        } sm:flex sm:space-x-6 absolute sm:static top-[105px] left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none py-4 sm:py-0`}
      >
        <Link
          href="/traders"
          onClick={toggleNav}
          className="block lg:inline-block text-[#0084dd] hover:text-[#006bb3] px-4 py-2"
        >
          التجار
        </Link>
        <Link
          onClick={toggleNav}
          href="/remaining"
          className="block lg:inline-block text-[#0084dd] hover:text-[#006bb3] px-4 py-2"
        >
          البواقي
        </Link>
        <Link
          onClick={toggleNav}
          href="/installments"
          className="block lg:inline-block text-[#0084dd] hover:text-[#006bb3] px-4 py-2"
        >
          الأقساط
        </Link>
        <Link
          onClick={toggleNav}
          href={payload ? "/admin" : "/login"}
          className="block lg:inline-block text-[#0084dd] hover:text-[#006bb3] px-4 py-2"
        >
          {payload ? (
            <div className="flex items-center ">
              {payload?.username}
              <CiLogout onClick={logoutHandler} className="mr-2 text-2xl" />
            </div>
          ) : (
            "الادمن"
          )}
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
