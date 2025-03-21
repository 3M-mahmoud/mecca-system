"use client";
import { DOMAIN } from "@/utils/constants";
import { UpdatedWithdrawalsDto } from "@/utils/dtos";
import { Traders } from "@/utils/types";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import style from "../app/loader.module.css";

export default function EditProductWithdrawal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const description = searchParams.get("description") || "";
  const withdrawalPrice = searchParams.get("price") || "";
  const withdrawalName = searchParams.get("name") || "";
  const id = searchParams.get("productId") || "";
  const withdrawalId = searchParams.get("id") || "";
  const productQuantity = searchParams.get("quantity") || "";

  const [customerType, setCustomerType] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Traders[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(+productQuantity);
  const [name, setName] = useState<string>(withdrawalName);
  const [text, setText] = useState<string>(description);
  const [price, setPrice] = useState<string>(withdrawalPrice);
  const [loading, setLoading] = useState(false);

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
      const data: UpdatedWithdrawalsDto = {
        productId: +id,
        quantity,
        description: text,
        price: +price,
        name: customer?.name || name,
        traderId: customerType === "commercial" ? selectedCustomer : null,
        remainingId: customerType === "wholesale" ? selectedCustomer : null,
      };
      try {
        setLoading(true);
        console.log(data);
        console.log(withdrawalId);
        await axios.put(`${DOMAIN}/api/withdrawals/${withdrawalId}`, data);
        toast.success("تم تعديل عملية سحب المنتج بنجاح!");
        router.replace(`/admin`);
        router.refresh(); // تحديث البيانات بدون إعادة تحميل الصفحة
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "حدث خطأ أثناء تعديل عملية السحب"
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg sm:mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        تعديل سحب المنتج
      </h2>

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
        <div className="mb-4">
          <label className="block font-medium">اختر العميل:</label>
          <select
            className="w-full p-2 border rounded-lg"
            onChange={(e) => setSelectedCustomer(Number(e.target.value))}
            value={selectedCustomer ?? ""}
          >
            <option value="">اختر العميل</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
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
        {loading ? <div className={style.loader}></div> : "تعديل عملية السحب"}
      </button>
    </div>
  );
}
