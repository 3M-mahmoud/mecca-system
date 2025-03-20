"use client";
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
  const [remaining, setRemaining] = useState<Traders[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // تصفية التجار بناءً على البحث
  const filteredMerchants = remaining.filter((remaining) =>
    remaining.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (remaining: Traders) => {
    router.push(
      `edit-remaining?id=${remaining.id}&name=${remaining.name}&balance=${remaining.balance}&phone=${remaining.phone}`
    );
  };

  const deleteHandler = (remaining: Traders) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${remaining.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${DOMAIN}/api/remaining/${remaining.id}`);

          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذا عميل البواقي",
            icon: "success",
          });
          router.replace("/remaining");
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
  const handleWithdrawal = (remaining: Traders) => {
    router.push(
      `remaining/remaining-withdrawal?id=${remaining.id}&name=${remaining.name}`
    );
  };
  const handlePayment = (remaining: Traders) => {
    router.push(`remaining/remaining-payment?remainingId=${remaining.id}`);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/remaining`);
      const data = await response.json();
      setRemaining(data);
    };
    fetchProducts();
  }, []);
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold text-[#0084dd] mb-4">عرض البواقي</h1>

      <div className="mb-4">
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="ابحث عن عميل البواقي..."
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
              <th className="px-4 py-2">دفع</th>
              <th className="px-4 py-2">تحديث</th>
              <th className="px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMerchants.map((remaining, index) => (
              <tr
                key={remaining.id}
                className="border-b hover:bg-[#f7f7f7] cursor-pointer"
              >
                <td className="px-10 py-2">{index + 1}</td>
                <td
                  onClick={() =>
                    router.push(`/admin/remaining/${remaining.id}`)
                  }
                  className="px-10 py-2 text-nowrap"
                >
                  {remaining.name}
                </td>
                <td className="px-4 py-2 font-bold">${remaining.balance}</td>
                <td className="px-10 py-2 text-nowrap">
                  {formatDate(remaining.updatedAt)}
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleWithdrawal(remaining)}
                    className="bg-green-600 text-white py-1 hover:bg-green-500 px-4 rounded-md"
                  >
                    سحب
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handlePayment(remaining)}
                    className="bg-[#ff5722] text-white py-1 hover:bg-[#e4582d] px-4 rounded-md"
                  >
                    دفع
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleUpdate(remaining)}
                    className="bg-blue-600 text-white py-1 hover:bg-blue-500 px-4 rounded-md"
                  >
                    تحديث
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => deleteHandler(remaining)}
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
