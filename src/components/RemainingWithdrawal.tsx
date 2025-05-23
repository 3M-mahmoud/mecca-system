"use client";
import { useState, useEffect } from "react";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import style from "../app/loader.module.css";
import { Product } from "@/utils/types";
import ProductList from "./ProductList";

export default function RemainingWithdrawal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [operationType, setOperationType] = useState("normal");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const remainingId = searchParams.get("id") || "";
  const remainingName = searchParams.get("name") || "";
  useEffect(() => {
    if (operationType === "withdrawProduct") {
      axios.get(`${DOMAIN}/api/products`).then((response) => {
        setProducts(response.data);
      });
    }
  }, [operationType]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setDescription(product.name);
    setPrice(`${product.price}`);
    setIsDropdownOpen(false);
  };

  const handleWithdraw = async () => {
    if(!loading) {
      const payload = {
        productId: selectedProduct?.id || null,
        quantity: quantity || 1,
        description,
        price: +price,
        remainingId: +remainingId || null,
        name: remainingName,
      };
  
      try {
        setLoading(true);
        await axios.post(`${DOMAIN}/api/withdrawals`, payload);
        toast.success("تمت العملية بنجاح!");
        router.replace("/admin/remaining");
      } catch (error: any) {
        console.log(error);
        const message =
          error?.response?.data?.message || "حدث خطأ أثناء عملية السحب";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg sm:mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">سحب البواقي</h2>

      <div className="mb-4">
        <p className="font-medium">اختر نوع العملية:</p>
        <div className="flex gap-3 mt-2 flex-col sm:flex-row">
          <button
            className={`px-4 py-2 rounded-lg ${
              operationType === "normal"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setOperationType("normal")}
          >
            عملية عادية
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              operationType === "withdrawProduct"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setOperationType("withdrawProduct")}
          >
            سحب منتج
          </button>
        </div>
      </div>

      {operationType === "withdrawProduct" && (
        <ProductList
        products={products}
        handleProductSelect={handleProductSelect}
      />
      )}

      <div className="mb-4">
        <label className="block font-medium">الوصف:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">السعر:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {operationType === "withdrawProduct" && (
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
      )}

      <button
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
        onClick={handleWithdraw}
      >
        {loading ? <div className={style.loader}></div> : "تأكيد العملية"}
      </button>
    </div>
  );
}
