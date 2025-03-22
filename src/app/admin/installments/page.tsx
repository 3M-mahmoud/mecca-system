"use client";
import { DOMAIN } from "@/utils/constants";
import { Installments } from "@/utils/types";
import axios from "axios";
import Link from "next/link";
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
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // تصفية التجار بناءً على البحث
  const filteredMerchants = installments.filter((installment) =>
    installment.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = (installment: Installments) => {
    router.push(
      `edit-installments?id=${installment.id}&name=${installment.name}&balance=${installment.balance}&phone=${installment.phone}`
    );
  };
  const handleCreateInstallment = (installment: Installments) => {
    router.push(`installments/create-installments?id=${installment.id}`);
  };

  const deleteHandler = (installment: Installments) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${installment.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${DOMAIN}/api/installments/${installment.id}`);

          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذا عميل الاقساط",
            icon: "success",
          });
          router.replace("/installments");
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
  const handleWithdrawal = (installment: Installments) => {
    router.push(
      `installments/installment-withdrawal?id=${installment.id}&name=${installment.name}`
    );
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/installments`);
      const data = await response.json();
      setInstallments(data);
    };
    fetchProducts();
  }, []);
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold text-[#0084dd] mb-4">
        عرض عملاء الاقساط
      </h1>

      <div className="mb-4">
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="ابحث عن عميل الاقساط..."
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
              <th className="px-4 py-2">الاقساط</th>
              <th className="px-4 py-2">تحديث</th>
              <th className="px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredMerchants.map((installment, index) => (
              <tr
                key={installment.id}
                className="border-b hover:bg-[#f7f7f7] cursor-pointer"
              >
                <td className="px-10 py-2">{index + 1}</td>
                <td
                  onClick={() =>
                    router.push(`/admin/installments/${installment.id}`)
                  }
                  className="px-10 py-2 whitespace-nowrap"
                >
                  {installment.name}
                </td>
                <td className="px-4 py-2 font-bold">${installment.balance.toLocaleString("en-US")}</td>
                <td className="px-10 py-2 whitespace-nowrap">
                  {formatDate(installment.updatedAt)}
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleWithdrawal(installment)}
                    className="bg-green-600 text-white py-1 hover:bg-green-500 px-4 rounded-md"
                  >
                    سحب
                  </button>
                </td>
                <td className="px-10 py-2">
                  {installment.installments.length > 0 ? (
                    <Link
                      href={`/admin/installments/${installment.id}`}
                      className="bg-[#E91E63] text-white py-1 hover:bg-[#e8437a] px-4 rounded-md"
                    >
                      معاينة
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCreateInstallment(installment)}
                      className="bg-[#E91E63] text-white py-1 hover:bg-[#e8437a] px-4 rounded-md"
                    >
                      إنشاء
                    </button>
                  )}
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => handleUpdate(installment)}
                    className="bg-blue-600 text-white py-1 hover:bg-blue-500 px-4 rounded-md"
                  >
                    تحديث
                  </button>
                </td>
                <td className="px-10 py-2">
                  <button
                    onClick={() => deleteHandler(installment)}
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
