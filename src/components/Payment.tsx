"use client";
import { useState } from "react";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import style from "../app/loader.module.css";
interface props {
  typePayment: string;
  typeCustomer: string;
}
export default function Payment({ typePayment, typeCustomer }: props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const id = searchParams.get("id") || "";
  const traderId = searchParams.get("traderId") || "";
  const remainingId = searchParams.get("remainingId") || "";

  const handlePayment = async () => {
    if (!loading) {
      const payload = {
        amount: +price,
        traderId: +traderId || null,
        remainingId: +remainingId || null,
      };

      try {
        setLoading(true);
        if (typePayment === "add") {
          await axios.post(`${DOMAIN}/api/payments`, payload);
        } else {
          await axios.put(`${DOMAIN}/api/payments/${id}`, payload);
        }
        toast.success("تمت العملية الدفع بنجاح!");
        if (typeCustomer === "traders") {
          router.replace("/admin/traders");
        } else if (typeCustomer === "remaining") {
          router.replace("/admin/remaining");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg sm:mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {typePayment === "add" ? "دفع" : "تعديل دفع"}{" "}
        {typeCustomer === "traders" ? "التاجر" : " عميل البواقي"}
      </h2>

      <div className="mb-4">
        <label className="block font-medium">المبلغ:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
        onClick={handlePayment}
      >
        {loading ? (
          <div className={style.loader}></div>
        ) : typePayment === "add" ? (
          "تأكيد الدفع"
        ) : (
          "تعديل الدفع"
        )}
      </button>
    </div>
  );
}
