"use client"; // تأكد من أن هذا المكون هو Client Component
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DOMAIN } from "@/utils/constants";
import { useRouter } from "next/navigation";
import style from "../../loader.module.css";
// تعريف schema باستخدام Zod
const productSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  price: z.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي الصفر"),
  category: z.string().min(1, "الصنف مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون أكبر من أو تساوي 1"),
});

// استنتاج النوع من Zod schema
type ProductFormData = z.infer<typeof productSchema>;

const AddProductForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    mode: "onChange",
    resolver: zodResolver(productSchema),
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${DOMAIN}/api/products`, data);
      toast.success("تم إضافة المنتج");
      router.replace("/admin");
      setLoading(false);
      router.refresh();
    } catch (error: any) {
      const message = error?.response?.data.message;
      if (message) toast.error(message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* حقل الاسم */}
      <div>
        <label className="block text-sm font-medium text-gray-700">الاسم</label>
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
        <label className="block text-sm font-medium text-gray-700">السعر</label>
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
        <label className="block text-sm font-medium text-gray-700">الصنف</label>
        <input
          type="text"
          {...register("category")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
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
          <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
        )}
      </div>

      {/* زر الإضافة */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
        >
          {loading ? <div className={style.loader}></div> : "إضافة المنتج"}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
