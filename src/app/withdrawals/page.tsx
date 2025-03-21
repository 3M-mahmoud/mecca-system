"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DOMAIN } from "@/utils/constants";
import { Payments, RemainingResponse, Withdrawal } from "@/utils/types";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const [filteredData, setFilteredData] = useState<Withdrawal[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${DOMAIN}/api/withdrawals`);
      const data: Withdrawal[] = await response.json();
      setWithdrawals(data);
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    if (withdrawals.length < 1) return;
    const filtered =
      withdrawals.filter((withdrawal) => {
        const matchesDate =
          filters.startDate && filters.endDate
            ? new Date(withdrawal.createdAt) >= new Date(filters.startDate) &&
              new Date(withdrawal.createdAt) <= new Date(filters.endDate)
            : true;
        return matchesDate;
      }) || [];
    setFilteredData(filtered);
  }, [filters, withdrawals]);

  const totalQuantity = filteredData.reduce((sum, item) => {
    let total = 0;
    if (item.productId) {
      total = sum + item.quantity;
    }
    return total;
  }, 0);
  const totalProductPrice = filteredData.reduce((sum, item) => {
    let total = 0;
    if (item.productId) {
      total = sum + item.quantity * item.price;
    }
    return total;
  }, 0);
  const totalPrice = filteredData.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  return (
    <div className="p-4 max-w-4xl mx-auto py-32">
      {withdrawals.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">المسحوبات</h1>
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mt-4 font-bold text-lg">
              إجمالي عدد الاجهزة: {totalQuantity.toLocaleString("en-US")}
            </div>
            <div className="mt-4 font-bold text-lg">
              إجمالي فلوس الاجهزة: {totalProductPrice.toLocaleString("en-US")}
            </div>
            <div className="mt-4 font-bold text-lg">
              إجمالي الفلوس: {totalPrice.toLocaleString("en-US")}
            </div>
          </div>
          <div className="mt-4 flex gap-4 flex-col sm:flex-row">
            <input
              type="date"
              className="border p-2"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-md bg-white relative"
              >
                <h2
                  className="text-lg font-semibold mt-4 sm:mt-0 cursor-pointer"
                  onClick={() => router.push(`/product/${item.productId}`)}
                >
                  {item.description}
                </h2>
                <h2
                  className="text-lg font-semibold mt-4 sm:mt-0 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `${
                        "traderId" in item && item.traderId !== null
                          ? `/traders/${item.traderId}`
                          : "remainingId" in item && item.remainingId !== null
                          ? `/remaining/${item.remainingId}`
                          : "InstallmentId" in item &&
                            item.InstallmentId !== null
                          ? `/installments/${item.InstallmentId}`
                          : "/withdrawals"
                      }`
                    )
                  }
                >
                  {item.name}
                </h2>
                <p className="text-gray-700 mt-2">
                  التاريخ: {format(new Date(item.createdAt), "yyyy-MM-dd")}
                </p>
                {item.productId && (
                  <>
                    <p className="text-gray-700">الكمية: {item.quantity}</p>
                    <p className="text-gray-700">سعر الوحدة: {item.price}</p>
                  </>
                )}
                <p className="text-blue-600 font-semibold">
                  الإجمالي: {item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : <p className="text-gray-500 text-center">لا يوجد نتائج</p>}
    </div>
  );
}
