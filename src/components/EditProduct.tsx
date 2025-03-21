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
const editProductSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم المنتج"),
  price: z.number().min(1, "يجب إدخال سعر صالح"),
  category: z.string().min(1, "يجب إدخال الفئة"),
  quantity: z.number().min(1, "يجب إدخال الكمية"),
});

// استنتاج النوع من Zod schema
type ProductFormData = z.infer<typeof editProductSchema>;

const EditProduct = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const productId = searchParams.get("id");
  const defaultValues = {
    name: searchParams.get("name") || "",
    price: Number(searchParams.get("price")) || 0,
    category: searchParams.get("category") || "",
    quantity: Number(searchParams.get("quantity")) || 0,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    mode: "onChange",
    resolver: zodResolver(editProductSchema),
    defaultValues,
  });

  useEffect(() => {
    // تحديث القيم عند فتح الصفحة
    setValue("name", defaultValues.name);
    setValue("price", defaultValues.price);
    setValue("category", defaultValues.category);
    setValue("quantity", defaultValues.quantity);
  }, []);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!productId) return;
    if(!loading) {
      try {
        setLoading(true);
        await axios.put(`${DOMAIN}/api/products/${productId}`, data);
        toast.success("تم تحديث المنتج بنجاح!");
        router.replace("/admin");
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
      <h2 className="text-2xl font-bold mx-5">تعديل المنتج</h2>
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

        {/* حقل السعر */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            السعر
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* حقل الصنف */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الصنف
          </label>
          <input
            type="text"
            {...register("category")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* حقل الكمية */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            الكمية
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* زر التحديث */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? <div className={style.loader}></div> : "تحديث المنتج"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
