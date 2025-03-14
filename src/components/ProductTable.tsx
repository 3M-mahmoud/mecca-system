"use client";
import { DOMAIN } from "@/utils/constants";
import { useEffect, useState } from "react";
import Table from "./Table";

interface Product {
  id: number;
  name: string;
  price: number;
  count: number;
  category: string;
}

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const totalProduct = filteredProducts.reduce((acc, cur) => {
    return acc + cur.count;
  }, 0);
  const totalPrice = filteredProducts.reduce((acc, item) => {
    return acc + item.count * item.price;
  }, 0);
  const getUniqueCategories = (products: { category: string }[]) => {
    return [...new Set(products.map((product) => product.category))];
  };
  const sortByCapacity = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const getCapacity = (name: string) => {
        const match = name.match(/(\d+(\.\d+)?)\s*ح/); // استخراج الرقم قبل "حصان"
        return match ? parseFloat(match[1]) : 0; // تحويله لرقم
      };

      return getCapacity(a.name) - getCapacity(b.name); // ترتيب تصاعدي (من الأقل للأكبر)
    });
  };
  useEffect(() => {
    // جلب البيانات من الـ API
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/products`); // افترضنا أن الـ API موجود في هذا المسار
      const data = await response.json();
      const product = sortByCapacity(data);
      const filtered = product.filter((product) => product.count > 0);
      setProducts(filtered);
      const category = getUniqueCategories(data);
      setCategory(category);
      setFilteredProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // تصفية المنتجات حسب الفئة
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    // تصفية التجار بناءً على البحث
    const filteredProductsSearch = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filteredProductsSearch);
  }, [search]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  const showCategory = category.map((cat, index) => {
    return (
      <option key={`${cat}-${index}`} value={cat}>
        {cat}
      </option>
    );
  });
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold text-[#0084dd] mb-4">رصيد المخزن</h1>
      {/* تصفية حسب الفئة */}
      <div className="mb-4">
        {/* شريط البحث */}
        <input
          type="text"
          placeholder="ابحث عن المنتج..."
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          اختر الفئة:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0084dd] focus:border-[#0084dd] sm:text-sm rounded-md"
        >
          <option value="all">جميع الفئات</option>
          {showCategory}
          {/* يمكنك إضافة المزيد من الفئات هنا */}
        </select>
      </div>
      {filteredProducts.length > 0 ? (
        <>
          <div className="mb-4 flex items-center justify-between flex-col space-y-2 sm:flex-row">
            <span className="bg-green-600 p-2 text-white rounded-full">
              عدد الاجهزة ={" "}
              <span className="font-bold text-lg">{totalProduct}</span>
            </span>
            <span className="bg-[#009688] p-2 text-white rounded-full">
              عدد الاصناف ={" "}
              <span className="font-bold text-lg">
                {filteredProducts.length}
              </span>
            </span>
            <span className="bg-[#9C27B0] p-2 text-white rounded-full">
              اجمالي المخزن ={" "}
              <span className="font-bold text-lg">{totalPrice}</span>
            </span>
          </div>
          <Table filteredProducts={filteredProducts} typeTable="user" />
        </>
      ) : (
        <p className="text-gray-500 text-center">لا يوجد نتائج</p>
      )}
    </div>
  );
};

export default ProductsTable;
