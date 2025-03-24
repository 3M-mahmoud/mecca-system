"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DOMAIN } from "@/utils/constants";
import { Supplies } from "@/utils/types";
import { useRouter } from "next/navigation";
import { GoLinkExternal } from "react-icons/go";

export default function Page() {
  const router = useRouter();
  const [supplies, setSupplies] = useState<Supplies[]>([]);

  const [filteredData, setFilteredData] = useState<Supplies[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${DOMAIN}/api/supplies`);
      const data: Supplies[] = await response.json();
      setSupplies(data);
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    if (supplies.length < 1) return;
    const filtered =
      supplies.filter((item) => {
        const matchesName = filters.name
          ? item.name.toLowerCase().includes(filters.name.toLowerCase())
          : true;
        const matchesDate =
          filters.startDate && filters.endDate
            ? new Date(item.createdAt) >= new Date(filters.startDate) &&
              new Date(item.createdAt) <= new Date(filters.endDate)
            : true;
        return matchesName && matchesDate;
      }) || [];
    setFilteredData(filtered);
  }, [filters, supplies]);
  const products = filteredData.filter((item) => item.productId !== null);
  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalProductPrice = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const totalPrice = filteredData.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  return (
    <div className="p-4 max-w-4xl mx-auto py-32">
      {supplies.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold">الواردات</h1>
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
                <h2 className="mt-4 sm:mt-0 flex items-center">
                  <span className="text-lg font-semibold ml-2">
                    {item.description}
                  </span>
                  {item.productId ? (
                    <GoLinkExternal
                      className="hover:text-blue-600 mt-1 cursor-pointer"
                      onClick={() => router.push(`/product/${item.productId}`)}
                    />
                  ) : null}
                </h2>
                <h2 className="mt-4 sm:mt-0 flex items-center">
                  <span className="text-lg font-semibold ml-2">
                    {item.name}
                  </span>
                  {item.traderCustomerId ? (
                    <GoLinkExternal
                      className="hover:text-blue-600 mt-1 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `${
                            "traderCustomerId" in item &&
                            item.traderCustomerId !== null
                              ? `/traders/${item.traderCustomerId}`
                              : "/supplies"
                          }`
                        )
                      }
                    />
                  ) : null}
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
      ) : (
        <p className="text-gray-500 text-center">لا يوجد نتائج</p>
      )}
    </div>
  );
}
