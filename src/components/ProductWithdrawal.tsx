"use client";
import CustomerList from "@/components/CustomerList";
import { DOMAIN } from "@/utils/constants";
import { Traders } from "@/utils/types";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import style from "../app/loader.module.css";

export default function ProductWithdrawal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const description = searchParams.get("description") || "";
  const productPrice = searchParams.get("price") || "";
  const id = searchParams.get("id") || "";

  const [customerType, setCustomerType] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Traders[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>(description);
  const [price, setPrice] = useState<string>(productPrice);
  const [loading, setLoading] = useState(false);
  const TraderType: string =
    customerType === "commercial"
      ? "traderId"
      : customerType === "wholesale"
      ? "remainingId"
      : "normalId";

  // تحميل العملاء عند اختيار نوع العميل
  useEffect(() => {
    const fetchTraders = async () => {
      const response = await axios.get(`${DOMAIN}/api/traders`);
      setCustomers(response.data);
    };
    const fetchRemaining = async () => {
      const response = await axios.get(`${DOMAIN}/api/remaining`);
      setCustomers(response.data);
    };
    if (customerType === "commercial") {
      fetchTraders();
    } else if (customerType === "wholesale") {
      fetchRemaining();
    } else {
      setCustomers([]);
    }
  }, [customerType]);

  // دالة إرسال البيانات للـ API
  const handleWithdraw = async () => {
    if(!loading) {
      const customer = customers.find(
        (customer) => customer.id === selectedCustomer
      );
      const payload = {
        productId: +id,
        [TraderType]: selectedCustomer,
        quantity,
        description: text,
        price: +price,
        name: customer?.name || name,
      };
      try {
        setLoading(true);
        console.log(payload);
        await axios.post(`${DOMAIN}/api/withdrawals`, payload);
        toast.success("تم سحب المنتج بنجاح!");
        router.replace("/admin");
        router.refresh(); // تحديث البيانات بدون إعادة تحميل الصفحة
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "حدث خطأ أثناء عملية السحب"
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg sm:mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">سحب المنتج</h2>

      <div className="mb-4">
        <p className="font-medium">اختر نوع العميل:</p>
        <div className="flex gap-3 mt-2 flex-col sm:flex-row">
          <button
            className={`px-4 py-2 rounded-lg ${
              customerType === "commercial"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCustomerType("commercial")}
          >
            عميل تجاري
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              customerType === "wholesale"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCustomerType("wholesale")}
          >
            عميل بواقي
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              customerType === "normal"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setCustomerType("normal")}
          >
            عميل عادي
          </button>
        </div>
      </div>

      {/* قائمة العملاء (تظهر عند اختيار عميل تجاري أو بواقي) */}
      {customerType && customerType !== "normal" && (
        <CustomerList
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      )}

      {/* إدخال الاسم */}
      {customerType !== "commercial" && customerType !== "wholesale" && (
        <div className="mb-4">
          <label className="block font-medium">الاسم:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            min="1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block font-medium">الكمية:</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      {/*ادخال الوصف*/}
      <div className="mb-4">
        <label className="block font-medium">الوصف:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          min="1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      {/*ادخال السعر*/}
      <div className="mb-4">
        <label className="block font-medium">السعر:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          min="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* زر تأكيد السحب */}
      <button
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
        onClick={handleWithdraw}
      >
        {loading ? <div className={style.loader}></div> : "تأكيد السحب"}
      </button>
    </div>
  );
}
