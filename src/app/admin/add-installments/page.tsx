"use client";
import { DOMAIN } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import style from "../../loader.module.css";

// تعريف المخطط باستخدام Zod
const addInstallmentSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم عميل الاقساط"),
  balance: z.number(),
  phone: z.string().optional(),
});

// استنتاج النوع من Zod schema
type InstallmentFormData = z.infer<typeof addInstallmentSchema>;

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstallmentFormData>({
    mode: "onChange",
    resolver: zodResolver(addInstallmentSchema),
  });

  const onSubmit: SubmitHandler<InstallmentFormData> = async (data) => {
    if (!loading) {
      if (!data.phone) {
        data = {
          name: data.name,
          balance: data.balance,
        };
      }
      try {
        setLoading(true);
        await axios.post(`${DOMAIN}/api/installments`, data);
        toast.success("تم إضافة عميل الاقساط");
        router.replace("/admin/installments");
        router.refresh();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data.message;
          if (message) toast.error(message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl sm:text-2xl font-bold mx-5">
        إضافة عميل إقساط جديد
      </h2>
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

        {/* زر الإضافة */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? (
              <div className={style.loader}></div>
            ) : (
              "إضافة عميل إقساط"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
