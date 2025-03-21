"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import style from "../app/loader.module.css";
import { createInstalmentSchema } from "@/utils/validationSchemas";

// استنتاج النوع من Zod schema
type InstallmentFormData = z.infer<typeof createInstalmentSchema>;

const CreateInstalment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const InstallmentId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstallmentFormData>({
    mode: "onChange",
    resolver: zodResolver(createInstalmentSchema),
  });

  const onSubmit: SubmitHandler<InstallmentFormData> = async (data) => {
    if (!InstallmentId) return;
    const payload = {
      ...data,
      customerId: +InstallmentId,
    };
    try {
      setLoading(true);
      await axios.post(`${DOMAIN}/api/instalment`, payload);
      toast.success("تم إنشاء الاقساط بنجاح!");
      router.replace("/admin/installments");
      router.refresh(); // تحديث البيانات بدون إعادة تحميل الصفحة
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mx-5">إنشاء الاقساط</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            عدد الاشهر
          </label>
          <input
            type="number"
            {...register("months", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.months && (
            <p className="text-red-500 text-sm mt-1">{errors.months.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            اجمالي المبلغ
          </label>
          <input
            type="number"
            {...register("total", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.total && (
            <p className="text-red-500 text-sm mt-1">{errors.total.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المبلغ في الشهر
          </label>
          <input
            type="number"
            {...register("monthPayment", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.monthPayment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthPayment.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاريخ بداية الاقساط
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* زر الإضافة */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? <div className={style.loader}></div> : "إنشاء الاقساط"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInstalment;
