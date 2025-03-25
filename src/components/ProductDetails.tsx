"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DOMAIN } from "@/utils/constants";
import { ProductResponse, Supplies, Withdrawal } from "@/utils/types";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
type props = {
  id: string;
  typeUser: string;
};

export default function ProductDetails({ id, typeUser }: props) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"withdrawals" | "supplies">(
    "withdrawals"
  );
  const [filteredData, setFilteredData] = useState<(Withdrawal | Supplies)[]>(
    []
  );
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  // handel delete withdrawal
  const deleteWithdrawalHandler = (data: Withdrawal | Supplies) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${data.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          if ("traderId" in data) {
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
            router.replace("/admin");
          } else {
            router.replace("/");
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
  const handleUpdate = (item: Withdrawal | Supplies) => {
    if ("traderId" in item) {
      router.push(
        `edit-withdrawal?id=${item.id}&productId=${item.productId}&name=${item.name}&price=${item.price}&quantity=${item.quantity}&description=${item.description}`
      );
    }
    if ("traderCustomerId" in item) {
      router.push(
        `edit-supply?id=${item.id}&productId=${item.productId}&name=${item.name}&price=${item.price}&quantity=${item.quantity}&description=${item.description}`
      );
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${DOMAIN}/api/products/${id}`);
      const data: ProductResponse = await response.json();
      setProduct(data);
      setFilteredData(data.withdrawals);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      if (activeTab === "withdrawals") {
        const filtered = product.withdrawals.filter((item) => {
          const matchesName = filters.name
            ? item.name.toLowerCase().includes(filters.name.toLowerCase())
            : true;
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.createdAt) >= new Date(filters.startDate) &&
                new Date(item.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesName && matchesDate;
        });
        setFilteredData(filtered);
      }
      if (activeTab === "supplies") {
        const filtered = product.supplies.filter((item) => {
          const matchesName = filters.name
            ? item.name.toLowerCase().includes(filters.name.toLowerCase())
            : true;
          const matchesDate =
            filters.startDate && filters.endDate
              ? new Date(item.createdAt) >= new Date(filters.startDate) &&
                new Date(item.createdAt) <= new Date(filters.endDate)
              : true;
          return matchesName && matchesDate;
        });
        setFilteredData(filtered);
      }
    }
  }, [filters, activeTab, product]);

  const totalQuantity = filteredData.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = filteredData.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {product && (
        <>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">الفئة: {product.category}</p>
          <p className="text-gray-600">الكمية: {product.count}</p>
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
          </div>
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mt-4 font-bold text-lg">
              إجمالي الكمية: {totalQuantity}
            </div>
            <div className="mt-4 font-bold text-lg">
              إجمالي الفلوس: {totalPrice}
            </div>
          </div>
          <div className="mt-4 flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="البحث بالاسم"
              className="border p-2"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
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
                {typeUser === "admin" && (
                  <div className="flex absolute left-0 top-0 p-2">
                    <span
                      onClick={() => handleUpdate(item)}
                      className="border-2 border-blue-500 p-1 ml-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
                    >
                      <FaRegEdit className="text-xl" />
                    </span>
                    <span
                      onClick={() => deleteWithdrawalHandler(item)}
                      className="border-2 border-red-500 p-1 hover:bg-red-500 hover:text-white cursor-pointer transition"
                    >
                      <MdOutlineDelete className="text-xl" />
                    </span>
                  </div>
                )}

                <h2 className="mt-4 sm:mt-0 flex items-center">
                  <span className="text-lg font-semibold ml-2">
                    {item.name}
                  </span>
                  {"traderId" in item && item.traderId || "remainingId" in item && item.remainingId || "InstallmentId" in item && item.InstallmentId ? (
                    <GoLinkExternal
                      className="hover:text-blue-600 mt-1 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `${
                            "traderId" in item && item.traderId !== null
                              ? `/traders/${item.traderId}`
                              : "remainingId" in item &&
                                item.remainingId !== null
                              ? `/remaining/${item.remainingId}`
                              : "InstallmentId" in item &&
                                item.InstallmentId !== null
                              ? `/installments/${item.InstallmentId}`
                              : "/withdrawals"
                          }`
                        )
                      }
                    />
                  ) : null}
                </h2>
                <p className="text-gray-500">{item.description}</p>
                <p className="text-gray-700 mt-2">
                  التاريخ: {format(new Date(item.createdAt), "yyyy-MM-dd")}
                </p>
                <p className="text-gray-700">الكمية: {item.quantity}</p>
                <p className="text-gray-700">سعر الوحدة: {item.price}</p>
                <p className="text-blue-600 font-semibold">
                  الإجمالي: {item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
