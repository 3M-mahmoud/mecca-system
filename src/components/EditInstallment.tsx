"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import style from "../app/loader.module.css";

// تعريف المخطط باستخدام Zod
const editInstallmentSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم عميل الاقساط"),
  balance: z.number(),
  phone: z.string().optional(),
});

// استنتاج النوع من Zod schema
type InstallmentFormData = z.infer<typeof editInstallmentSchema>;

const EditInstallment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const InstallmentId = searchParams.get("id");
  const defaultValues = {
    name: searchParams.get("name") || "",
    balance: Number(searchParams.get("balance")) || 0,
    phone: searchParams.get("phone") || "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InstallmentFormData>({
    mode: "onChange",
    resolver: zodResolver(editInstallmentSchema),
    defaultValues,
  });

  useEffect(() => {
    // تحديث القيم عند فتح الصفحة
    setValue("name", defaultValues.name);
    setValue("balance", defaultValues.balance);
    if (defaultValues.phone == "null") {
      setValue("phone", "");
    } else {
      setValue("phone", defaultValues.phone);
    }
  }, []);

  const onSubmit: SubmitHandler<InstallmentFormData> = async (data) => {
    if (!InstallmentId) return;
    if(!loading) {
      try {
        setLoading(true);
        await axios.put(`${DOMAIN}/api/installments/${InstallmentId}`, data);
        toast.success("تم تحديث عميل الاقساط بنجاح!");
        router.replace("/admin/installments");
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
      <h2 className="text-2xl font-bold mx-5">تعديل عميل الاقساط</h2>
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
              "تعديل عميل الاقساط"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstallment;
