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
  const [traders, setTraders] = useState<Traders[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<Traders[]>([]);
  const [search, setSearch] = useState("");
  const [traderType, setTraderType] = useState("all");
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/traders`);
      const data = await response.json();
      setTraders(data);
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    // تصفية المنتجات حسب الفئة
    if (traderType === "traderPositive") {
      const filtered = traders.filter((trader) => trader.balance < 0);
      setFilteredTraders(filtered);
    } else if (traderType === "traderNegative") {
      const filtered = traders.filter((trader) => trader.balance > 0);
      setFilteredTraders(filtered);
    } else if (traderType === "traderZero") {
      const filtered = traders.filter((trader) => trader.balance === 0);
      setFilteredTraders(filtered);
    } else {
      setFilteredTraders(traders);
    }
  }, [traderType, traders]);
  useEffect(() => {
    // تصفية التجار بناءً على البحث
    const filteredMerchants = traders.filter((trader) =>
      trader.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTraders(filteredMerchants);
  }, [search]);
  return (
    <div className="max-w-md mx-auto p-4 py-32">
      {/* شريط البحث */}
      <input
        type="text"
        placeholder="ابحث عن تاجر..."
        className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-3 mt-2 mb-4 flex-col sm:flex-row">
        <button
          className={`px-4 py-2 rounded-lg ${
            traderType === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTraderType("all")}
        >
          الجميع
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            traderType === "traderPositive"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setTraderType("traderPositive")}
        >
          عليهم فلوس
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            traderType === "traderNegative"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setTraderType("traderNegative")}
        >
          ليهم فلوس
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            traderType === "traderZero"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setTraderType("traderZero")}
        >
          خالص
        </button>
      </div>
      {/* عرض التجار */}
      <div className="space-y-4">
        {filteredTraders.length > 0 ? (
          filteredTraders.map((trader) => (
            <div
              onClick={() => router.push(`/traders/${trader.id}`)}
              key={trader.id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:bg-[#e8e6e6] cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{trader.name}</h3>
              <p className="text-sm text-gray-600">
                الرصيد:
                <span className="font-medium mr-1">
                  <span className="font-bold text-nowrap text-lg">
                    {trader.balance < 0 ? trader.balance * -1 : trader.balance}
                  </span>{" "}
                  جنيه
                </span>
              </p>
              <p className="text-xs text-gray-500">
                آخر تحديث: {formatDate(trader.updatedAt)}
              </p>
              {trader.phone && (
                <p className="text-xs text-gray-500">
                  رقم الهاتف:
                  <span className="text-nowrap text-base">{trader.phone}</span>
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
