"use client";
import { useState, useEffect } from "react";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import style from "../../../loader.module.css";
import { Product } from "@/utils/types";
import ProductList from "@/components/ProductList";

export default function WithdrawTrader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [operationType, setOperationType] = useState("normal");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const traderId = searchParams.get("id") || "";
  const traderName = searchParams.get("name") || "";
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
  };

  const handleWithdraw = async () => {
    const payload = {
      productId: selectedProduct?.id || null,
      quantity: quantity || 1,
      description,
      price: +price,
      traderId: +traderId || null,
      name: traderName,
    };

    try {
      setLoading(true);
      await axios.post(`${DOMAIN}/api/supplies`, payload);
      toast.success("تمت العملية بنجاح!");
      router.replace("/admin/traders");
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg sm:mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">وارد التاجر</h2>

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
            وارد منتج
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
