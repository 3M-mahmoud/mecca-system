"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DOMAIN } from "@/utils/constants";
import { Installments, Instalment, Withdrawal } from "@/utils/types";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import style from "../app/loader.module.css";
type props = {
  id: string;
  typeUser: string;
};
export default function InstallmentDetails({ id, typeUser }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [installment, setInstallment] = useState<Installments | null>(null);
  const [activeTab, setActiveTab] = useState<"withdrawals" | "instalment">(
    "instalment"
  );
  const [activeInstallment, setActiveInstallment] = useState<
    "all" | "remaining" | "payment"
  >("all");
  const [filteredData, setFilteredData] = useState<Withdrawal[]>([]);
  const [instalment, setInstalment] = useState<Instalment[]>([]);
  const [filterInstalment, setFilterInstalment] = useState<Instalment[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const handlerEditInstalment = (instalment: Instalment) => {
    router.push(
      `/admin/installments/edit-instalment?id=${instalment.id}&amount=${
        instalment.amount
      }&isPaid=${instalment.isPaid ? 1 : 0}`
    );
  };
  const handleUpdateWithdrawal = (item: Withdrawal) => {
    router.push(
      `edit-withdrawal?id=${item.id}&productId=${item.productId}&name=${item.name}&price=${item.price}&quantity=${item.quantity}&description=${item.description}&installmentId=${item.InstallmentId}`
    );
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${DOMAIN}/api/installments/${id}`);
      const data: Installments = await response.json();
      setInstallment(data);
      setFilteredData(data.withdrawals);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!installment) return;
    if (activeTab === "withdrawals") {
      const filtered =
        installment?.withdrawals.filter((install) => {
          const matchesName = filters.name
            ? install.description
                .toLowerCase()
                .includes(filters.name.toLowerCase())
            : true;
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(install.createdAt) >= new Date(filters.startDate) &&
                new Date(install.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesName && matchesDate;
        }) || [];
      setFilteredData(filtered);
    }
    if (activeTab === "instalment") {
      setInstalment(installment.installments);
      setActiveInstallment("all");
      const filtered =
        installment?.installments.filter((item) => {
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.dueDate) >= new Date(filters.startDate) &&
                new Date(item.dueDate) <= new Date(filters.endDate)
              : true;
          return matchesDate;
        }) || [];
      setFilterInstalment(filtered);
    }
  }, [filters, activeTab, installment]);

  useEffect(() => {
    if (activeInstallment === "all") {
      setFilterInstalment(instalment);
    } else if (activeInstallment === "remaining") {
      const filtered = instalment.filter((item) => item.isPaid === false);
      setFilterInstalment(filtered);
    } else if (activeInstallment === "payment") {
      const filtered = instalment.filter((item) => item.isPaid === true);
      setFilterInstalment(filtered);
    }
  }, [activeInstallment, instalment]);

  const totalQuantity = filteredData.reduce((sum, item) => {
    let total = 0;
    if (item.productId) {
      total = sum + item.quantity;
    }
    return total;
  }, 0);
  const totalPayments = filterInstalment.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalPrice = filteredData.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const handlePayment = async (id: number) => {
    const payload = {
      isPaid: true,
    };
    try {
      setLoading(true);
      await axios.put(`${DOMAIN}/api/instalment/${id}`, payload);
      toast.success("تم دفع القسط بنجاح!");
      router.replace("/admin/installments");
      router.refresh(); // تحديث البيانات بدون إعادة تحميل الصفحة
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteHandler = (data: Withdrawal | Instalment) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${"description" in data ? data.description : `القسط`}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          if ("customerId" in data && "amount" in data) {
            await axios.delete(`${DOMAIN}/api/instalment/${data.id}`);
          } else if ("traderId" in data && "price" in data) {
            await axios.delete(`${DOMAIN}/api/withdrawals/${data.id}`);
          }
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذه العملية",
            icon: "success",
          });
          router.replace("/admin/installments");
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
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {installment && (
        <>
          <h1 className="text-2xl font-bold">{installment.name}</h1>
          <p className="text-gray-600">الرصيد: {installment.balance}</p>
          <div className="flex mt-4 gap-4 flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab("instalment")}
              className={`px-4 py-2 rounded ${
                activeTab === "instalment"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              الاقساط
            </button>
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
          </div>

          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mt-4 font-bold text-lg">
              إجمالي الكمية:{" "}
              {activeTab === "instalment" ? totalPayments : totalQuantity}
            </div>
            {activeTab !== "instalment" ? (
              <div className="mt-4 font-bold text-lg">
                إجمالي الفلوس: {totalPrice}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex gap-4 flex-col sm:flex-row">
            {activeTab !== "instalment" ? (
              <input
                type="text"
                placeholder="البحث بالوصف"
                className="border p-2"
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            ) : (
              <div className="flex gap-4 flex-col sm:flex-row">
                <button
                  onClick={() => setActiveInstallment("all")}
                  className={`px-4 py-2 rounded ${
                    activeInstallment === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setActiveInstallment("remaining")}
                  className={`px-4 py-2 rounded ${
                    activeInstallment === "remaining"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  متبقي
                </button>
                <button
                  onClick={() => setActiveInstallment("payment")}
                  className={`px-4 py-2 rounded ${
                    activeInstallment === "payment"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  مدفوع
                </button>
              </div>
            )}
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
            {activeTab !== "instalment" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md bg-white relative"
                >
                  {typeUser === "admin" && (
                    <div className="flex absolute left-0 top-0 p-2">
                      <span
                        onClick={() => handleUpdateWithdrawal(item)}
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
            {activeTab === "instalment" &&
              filterInstalment.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md bg-white relative"
                >
                  {typeUser === "admin" && (
                    <div className="flex absolute left-0 top-0 p-2">
                      <span
                        onClick={() => handlerEditInstalment(item)}
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
                    التاريخ: {format(new Date(item.dueDate), "yyyy-MM-dd")}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    المبلغ: {item.amount}
                  </p>
                  {typeUser === "admin" && item.isPaid === false && (
                    <button
                      onClick={() => handlePayment(item.id)}
                      className="border border-2 border-red-500 hover:bg-red-500 hover:text-white transition mt-2 w-full text-black text-xl py-1 flex items-center justify-center"
                    >
                      {loading ? <div className={style.loader}></div> : "دفع"}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
