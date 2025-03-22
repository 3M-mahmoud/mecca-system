"use client";
import { DOMAIN } from "@/utils/constants";
import { Installments, Traders } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function MerchantsList() {
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [filteredInstallment, setFilteredInstallment] = useState<
    Installments[]
  >([]);
  const [search, setSearch] = useState("");
  const [remainingType, setRemainingType] = useState("all");
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/installments`);
      const data = await response.json();
      setInstallments(data);
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    // تصفية المنتجات حسب الفئة
    if (remainingType === "remainingPositive") {
      const filtered = installments.filter(
        (installment) => installment.balance < 0
      );
      setFilteredInstallment(filtered);
    } else if (remainingType === "remainingZero") {
      const filtered = installments.filter(
        (installment) => installment.balance === 0
      );
      setFilteredInstallment(filtered);
    } else {
      setFilteredInstallment(installments);
    }
  }, [remainingType, installments]);
  useEffect(() => {
    // تصفية التجار بناءً على البحث
    const filteredMerchants = installments.filter((installment) =>
      installment.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredInstallment(filteredMerchants);
  }, [search]);
  return (
    <div className="max-w-md mx-auto p-4 py-32">
      {/* شريط البحث */}
      <input
        type="text"
        placeholder="ابحث عن عميل الاقساط..."
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-3 mt-2 mb-4 flex-col sm:flex-row">
        <button
          className={`px-4 py-2 rounded-lg ${
            remainingType === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setRemainingType("all")}
        >
          الجميع
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            remainingType === "remainingPositive"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setRemainingType("remainingPositive")}
        >
          عليهم فلوس
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            remainingType === "remainingZero"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setRemainingType("remainingZero")}
        >
          خالص
        </button>
      </div>
      {/* عرض التجار */}
      <div className="space-y-4">
        {filteredInstallment.length > 0 ? (
          filteredInstallment.map((installment) => (
            <div
              onClick={() => router.push(`/installments/${installment.id}`)}
              key={installment.id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:bg-[#e8e6e6] cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{installment.name}</h3>
              <p className="text-sm text-gray-600">
                الرصيد:
                <span className="font-medium mr-1">
                  <span className="font-bold text-nowrap text-lg">
                    {installment.balance < 0
                      ? (installment.balance * -1).toLocaleString("en-US")
                      : installment.balance.toLocaleString("en-US")}
                  </span>{" "}
                  جنيه
                </span>
              </p>
              <p className="text-xs text-gray-500">
                آخر تحديث: {formatDate(installment.updatedAt)}
              </p>
              {installment.phone && (
                <p className="text-xs text-gray-500">
                  رقم الهاتف:
                  <span className="text-nowrap text-base">
                    {installment.phone}
                  </span>
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">لا يوجد نتائج</p>
        )}
      </div>
    </div>
  );
}
