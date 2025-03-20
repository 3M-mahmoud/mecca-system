"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DOMAIN } from "@/utils/constants";
import { Payments, Supplies, TraderResponse, Withdrawal } from "@/utils/types";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";

type props = {
  id: string;
  typeUser: string;
};
export default function TraderDetails({ id, typeUser }: props) {
  const router = useRouter();
  const [trader, setTrader] = useState<TraderResponse | null>(null);
  const [activeTab, setActiveTab] = useState<
    "withdrawals" | "supplies" | "payments"
  >("withdrawals");
  const [filteredData, setFilteredData] = useState<(Withdrawal | Supplies)[]>(
    []
  );
  const [payments, setPayments] = useState<Payments[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const handleUpdate = (item: Withdrawal | Supplies) => {
    if ("traderId" in item) {
      router.push(
        `edit-withdrawal?id=${item.id}&productId=${item.productId}&name=${item.name}&price=${item.price}&quantity=${item.quantity}&description=${item.description}&traderId=${item.traderId}`
      );
    }
    if ("traderCustomerId" in item) {
      router.push(
        `edit-supply?id=${item.id}&productId=${item.productId}&name=${item.name}&price=${item.price}&quantity=${item.quantity}&description=${item.description}&traderId=${item.traderCustomerId}`
      );
    }
  };
  const handlerEditPayment = (payment: Payments) => {
    router.push(
      `/admin/traders/edit-payment?id=${payment.id}&traderId=${payment.traderId}`
    );
  };

  const deleteHandler = (data: Withdrawal | Supplies | Payments) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${"description" in data ? data.description : `عملية الدفع`}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          if ("traderId" in data && "amount" in data) {
            await axios.delete(`${DOMAIN}/api/payments/${data.id}`);
          } else if ("traderId" in data && "price" in data) {
            await axios.delete(`${DOMAIN}/api/withdrawals/${data.id}`);
          } else {
            await axios.delete(`${DOMAIN}/api/supplies/${data.id}`);
          }
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذه العملية",
            icon: "success",
          });
          if (typeUser === "admin") {
            router.replace("/admin/traders");
          } else {
            router.replace("/traders");
          }
          router.refresh(); // ✅ تحديث القائمة بعد الحذف بدون إعادة تحميل الصفحة
        } catch (error: any) {
          console.log(error);
          const message = error?.response?.data.message;
          if (message) {
            Swal.fire({
              title: message,
              text: "حدث خطأ أثناء الحذف",
              icon: "error",
            });
          }
        }
      }
    });
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${DOMAIN}/api/traders/${id}`);
      const data: TraderResponse = await response.json();
      console.log(data);
      setTrader(data);
      setFilteredData(data.withdrawals);
    };
    fetchProduct();
  }, [id]);
  useEffect(() => {
    if (!trader) return;
    if (activeTab === "withdrawals") {
      const filtered =
        trader?.withdrawals.filter((item) => {
          const matchesName = filters.name
            ? item.description
                .toLowerCase()
                .includes(filters.name.toLowerCase())
            : true;
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.createdAt) >= new Date(filters.startDate) &&
                new Date(item.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesName && matchesDate;
        }) || [];
      setFilteredData(filtered);
    }
    if (activeTab === "supplies") {
      const filtered =
        trader?.Supply.filter((item) => {
          const matchesName = filters.name
            ? item.description
                .toLowerCase()
                .includes(filters.name.toLowerCase())
            : true;
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.createdAt) >= new Date(filters.startDate) &&
                new Date(item.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesName && matchesDate;
        }) || [];
      setFilteredData(filtered);
    }
    if (activeTab === "payments") {
      const filtered =
        trader?.payments.filter((item) => {
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.createdAt) >= new Date(filters.startDate) &&
                new Date(item.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesDate;
        }) || [];
      setPayments(filtered);
    }
  }, [filters, activeTab, trader]);
  const totalQuantity = filteredData.reduce((sum, item) => {
    let total = 0;
    if (item.productId) {
      total = sum + item.quantity;
    }
    return total;
  }, 0);
  const totalPrice = filteredData.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const totalPayments = payments.reduce((sum, item) => sum + item.amount, 0);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {trader && (
        <>
          <h1 className="text-2xl font-bold">{trader.name}</h1>
          <p className="text-gray-600">الرصيد: {trader.balance}</p>
          <div className="flex mt-4 gap-4 flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`px-4 py-2 rounded ${
                activeTab === "withdrawals"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              المسحوبات
            </button>
            <button
              onClick={() => setActiveTab("supplies")}
              className={`px-4 py-2 rounded ${
                activeTab === "supplies"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              الواردات
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-2 rounded ${
                activeTab === "payments"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              المدفوعات
            </button>
          </div>
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mt-4 font-bold text-lg">
              إجمالي الكمية:{" "}
              {activeTab === "payments" ? totalPayments : totalQuantity}
            </div>
            {activeTab !== "payments" ? (
              <div className="mt-4 font-bold text-lg">
                إجمالي الفلوس: {totalPrice}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex gap-4 flex-col sm:flex-row">
            {activeTab !== "payments" ? (
              <input
                type="text"
                placeholder="البحث بالوصف"
                className="border p-2"
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            ) : null}
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
            {activeTab !== "payments" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md bg-white relative"
                >
                  {typeUser === "admin" && (
                    <div className="flex absolute left-0 top-0 p-2">
                      <span
                        onClick={() => handleUpdate(item)}
                        className="border-2 border-blue-500 p-1 ml-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
                      >
                        <FaRegEdit className="text-xl" />
                      </span>
                      <span
                        onClick={() => deleteHandler(item)}
                        className="border-2 border-red-500 p-1 hover:bg-red-500 hover:text-white cursor-pointer transition"
                      >
                        <MdOutlineDelete className="text-xl" />
                      </span>
                    </div>
                  )}

                  <h2
                    className="text-lg font-semibold mt-4 sm:mt-0 cursor-pointer"
                    onClick={() => router.push(`/product/${item.productId}`)}
                  >
                    {item.description}
                  </h2>
                  <p className="text-gray-500">{item.name}</p>
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
            {activeTab === "payments" &&
              payments.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md bg-white relative"
                >
                  {typeUser === "admin" && (
                    <div className="flex absolute left-0 top-0 p-2">
                      <span
                        onClick={() => handlerEditPayment(item)}
                        className="border-2 border-blue-500 p-1 ml-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
                      >
                        <FaRegEdit className="text-xl" />
                      </span>
                      <span
                        onClick={() => deleteHandler(item)}
                        className="border-2 border-red-500 p-1 hover:bg-red-500 hover:text-white cursor-pointer transition"
                      >
                        <MdOutlineDelete className="text-xl" />
                      </span>
                    </div>
                  )}

                  <p className="text-gray-700 mt-2">
                    التاريخ: {format(new Date(item.createdAt), "yyyy-MM-dd")}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    المبلغ: {item.amount}
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
