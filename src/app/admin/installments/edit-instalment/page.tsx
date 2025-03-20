"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import style from "../../../loader.module.css";
import { updateInstalmentSchema } from "@/utils/validationSchemas";

// استنتاج النوع من Zod schema
type InstallmentFormData = z.infer<typeof updateInstalmentSchema>;
type Payment = {
  amount: number;
  isPaid: boolean;
  dueDate?: string; // Optional property
};
const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const id = searchParams.get("id");
  const amountParam = searchParams.get("amount");
  const isPaidParam = searchParams.get("isPaid");
  const [status, setStatus] = useState(Boolean(Number(isPaidParam)));

  const defaultValues = {
    amount: amountParam !== null ? Number(amountParam) : 0,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InstallmentFormData>({
    mode: "onChange",
    resolver: zodResolver(updateInstalmentSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<InstallmentFormData> = async (data) => {
    const payload: Payment = {
      amount: data.amount,
      isPaid: status,
    };
    if (data.dueDate && data.dueDate?.length > 0) {
      payload.dueDate = data.dueDate;
    }
    try {
      setLoading(true);
      await axios.put(`${DOMAIN}/api/instalment/${id}`, payload);
      toast.success("تم تعديل القسط بنجاح!");
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
      <h2 className="text-2xl font-bold mx-5">تعديل القسط</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            المبلغ
          </label>
          <input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاريخ القسط
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            حالة الدفع
          </label>
          <div className="flex mt-4 gap-4 flex-col sm:flex-row">
            <button
              type="button"
              onClick={() => setStatus(true)}
              className={`px-4 py-2 rounded ${
                status === true ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              مدفوع
            </button>
            <button
              type="button"
              onClick={() => setStatus(false)}
              className={`px-4 py-2 rounded ${
                status === false ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              غير مدفوع
            </button>
          </div>
        </div>

        {/* زر الإضافة */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? <div className={style.loader}></div> : "تعديل القسط"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
