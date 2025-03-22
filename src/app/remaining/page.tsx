"use client";
import { DOMAIN } from "@/utils/constants";
import { Traders } from "@/utils/types";
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
  const [remaining, setRemaining] = useState<Traders[]>([]);
  const [filteredRemaining, setFilteredRemaining] = useState<Traders[]>([]);
  const [search, setSearch] = useState("");
  const [remainingType, setRemainingType] = useState("all");
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/remaining`);
      const data = await response.json();
      setRemaining(data);
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    // تصفية المنتجات حسب الفئة
    if (remainingType === "remainingPositive") {
      const filtered = remaining.filter((remaining) => remaining.balance < 0);
      setFilteredRemaining(filtered);
    } else if (remainingType === "remainingNegative") {
      const filtered = remaining.filter((remaining) => remaining.balance > 0);
      setFilteredRemaining(filtered);
    } else if (remainingType === "remainingZero") {
      const filtered = remaining.filter((remaining) => remaining.balance === 0);
      setFilteredRemaining(filtered);
    } else {
      setFilteredRemaining(remaining);
    }
  }, [remainingType, remaining]);
  useEffect(() => {
    // تصفية التجار بناءً على البحث
    const filteredMerchants = remaining.filter((remaining) =>
      remaining.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRemaining(filteredMerchants);
  }, [search]);
  return (
    <div className="max-w-md mx-auto p-4 py-32">
      {/* شريط البحث */}
      <input
        type="text"
        placeholder="ابحث عن عميل البواقي..."
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
            remainingType === "remainingNegative"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setRemainingType("remainingNegative")}
        >
          ليهم فلوس
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
        {filteredRemaining.length > 0 ? (
          filteredRemaining.map((remaining) => (
            <div
              onClick={() => router.push(`/remaining/${remaining.id}`)}
              key={remaining.id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:bg-[#e8e6e6] cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{remaining.name}</h3>
              <p className="text-sm text-gray-600">
                الرصيد:
                <span className="font-medium mr-1">
                  <span className="font-bold text-nowrap text-lg">
                    {remaining.balance < 0
                      ? (remaining.balance * -1).toLocaleString("en-US")
                      : remaining.balance.toLocaleString("en-US")}
                  </span>{" "}
                  جنيه
                </span>
              </p>
              <p className="text-xs text-gray-500">
                آخر تحديث: {formatDate(remaining.updatedAt)}
              </p>
              {remaining.phone && (
                <p className="text-xs text-gray-500">
                  رقم الهاتف:
                  <span className="text-nowrap text-base">
                    {remaining.phone}
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
