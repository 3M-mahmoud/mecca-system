"use client";
export const dynamic = "force-dynamic";
import { DOMAIN } from "@/utils/constants";
import { Traders } from "@/utils/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

// دالة لتحويل التاريخ إلى العربية
const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long", // اسم اليوم (الخميس)
    year: "numeric", // السنة (2025)
    month: "long", // اسم الشهر (فبراير)
    day: "numeric", // اليوم (20)
    hour: "numeric", // الساعة
    minute: "numeric", // الدقيقة
    second: "numeric", // الثانية
    hour12: true, // استخدام تنسيق 12 ساعة مع AM/PM
  }).format(new Date(isoDate));
};

const Page = () => {
  const [traders, setTraders] = useState<Traders[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // تصفية التجار بناءً على البحث
  const filteredMerchants = traders.filter((trader) =>
    trader.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (trader: Traders) => {
    router.push(
      `edit-traders?id=${trader.id}&name=${trader.name}&balance=${trader.balance}&phone=${trader.phone}`
    );
  };

  const deleteHandler = (trader: Traders) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${trader.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${DOMAIN}/api/traders/${trader.id}`);

          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذا التاجر",
            icon: "success",
          });
          router.replace("/traders");
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
  const handleWithdrawal = (trader: Traders) => {
    router.push(
      `traders/trader-withdrawal?id=${trader.id}&name=${trader.name}`
    );
  };
  const handleSupply = (trader: Traders) => {
    router.push(`traders/trader-supply?id=${trader.id}&name=${trader.name}`);
  };
  const handlePayment = (trader: Traders) => {
    router.push(`traders/trader-payment?traderId=${trader.id}`);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/traders`);
      const data = await response.json();
      setTraders(data);
    };
    fetchProducts();
  }, []);
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold text-[#0084dd] mb-4">عرض التجار</h1>

      <div className="mb-4">
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="ابحث عن تاجر..."
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#0084dd] text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">الاسم</th>
              <th className="px-4 py-2">الرصيد</th>
              <th className="px-4 py-2">اخر تحديث</th>
              <th className="px-4 py-2">سحب</th>
              <th className="px-4 py-2">وارد</th>
              <th className="px-4 py-2">دفع</th>
              <th className="px-4 py-2">تحديث</th>
              <th className="px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMerchants.map((trader, index) => (
              <tr
                key={trader.id}
                className="border-b hover:bg-[#f7f7f7] cursor-pointer"
              >
                <td className="px-10 py-2">{index + 1}</td>
                <td
                  onClick={() => router.push(`/admin/traders/${trader.id}`)}
                  className="px-10 py-2 whitespace-nowrap"
                >
                  {trader.name}
                </td>
                <td className="px-4 py-2 font-bold">${trader.balance.toLocaleString("en-US")}</td>
                <td className="px-10 py-2 whitespace-nowrap">
                  {formatDate(trader.updatedAt)}
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleWithdrawal(trader)}
                    className="bg-green-600 text-white py-1 hover:bg-green-500 px-4 rounded-md"
                  >
                    سحب
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleSupply(trader)}
                    className="bg-yellow-600 text-white py-1 hover:bg-yellow-500 px-4 rounded-md"
                  >
                    وارد
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handlePayment(trader)}
                    className="bg-[#ff5722] text-white py-1 hover:bg-[#e4582d] px-4 rounded-md"
                  >
                    دفع
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleUpdate(trader)}
                    className="bg-blue-600 text-white py-1 hover:bg-blue-500 px-4 rounded-md"
                  >
                    تحديث
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => deleteHandler(trader)}
                    className="bg-red-600 text-white py-1 hover:bg-red-500 px-4 rounded-md"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
