"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import style from "../../loader.module.css";

// تعريف المخطط باستخدام Zod
const editTraderSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم التاجر"),
  balance: z.number(),
  phone: z.string().optional(),
});

// استنتاج النوع من Zod schema
type TraderFormData = z.infer<typeof editTraderSchema>;

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [traderId, setTraderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TraderFormData>({
    mode: "onChange",
    resolver: zodResolver(editTraderSchema),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setTraderId(params.get("id"));
      setValue("name", params.get("name") || "");
      setValue("balance", Number(params.get("balance")) || 0);
      setValue(
        "phone",
        params.get("phone") === "null" ? "" : params.get("phone") || ""
      );
    }
  }, []);

  const onSubmit: SubmitHandler<TraderFormData> = async (data) => {
    if (!traderId) return;
    if (!loading) {
      try {
        setLoading(true);
        await axios.put(`${DOMAIN}/api/traders/${traderId}`, data);
        toast.success("تم تحديث التاجر بنجاح!");
        router.replace("/admin/traders");
        router.refresh(); // تحديث البيانات بدون إعادة تحميل الصفحة
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mx-5">تعديل التاجر</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* حقل الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الاسم
          </label>
          <input
            type="text"
            {...register("name")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* حقل الرصيد */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الرصيد
          </label>
          <input
            type="number"
            {...register("balance", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.balance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.balance.message}
            </p>
          )}
        </div>

        {/* حقل رقم التلفون */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <input
            type="text"
            {...register("phone")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* حقل الايميل */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            البريد الالكتروني
          </label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div> */}

        {/* زر الإضافة */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? <div className={style.loader}></div> : "تعديل التاجر"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
