"use client";

import { useState } from "react";
import { Product } from "@/utils/types";

interface Props {
  products: Product[];
  handleProductSelect: (product: Product) => void;
}

const ProductList = ({ products, handleProductSelect }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // تصفية المنتجات بناءً على البحث
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelect = (productSelect: Product) => {
    handleProductSelect(productSelect);
    setIsDropdownOpen(false);
    setSelectedProduct(productSelect);
  };
  return (
    <div className="mb-4 relative w-full max-w-md">
      <label className="block font-medium">اختر المنتج:</label>

      {/* زر اختيار المنتج */}
      <button
        className="w-full p-2 border rounded-lg bg-white text-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedProduct ? selectedProduct.name : "اختر المنتج"}
      </button>

      {/* القائمة المنبثقة */}
      {isDropdownOpen && (
        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10 border">
          {/* حقل البحث */}
          <div className="relative p-3 border-b">
            <input
              type="text"
              placeholder="ابحث عن المنتج..."
              className="w-full p-2 border rounded-lg pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-4 top-4 w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                className="heroicon-ui"
                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
              />
            </svg>
          </div>

          {/* قائمة المنتجات */}
          <div className="max-h-60 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="flex items-center cursor-pointer p-3 hover:bg-blue-100 transition border-b"
                >
                  <span className="font-medium">{product.name}</span>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-500 text-center">لا يوجد نتائج</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
