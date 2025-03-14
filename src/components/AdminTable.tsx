"use client";
import { DOMAIN } from "@/utils/constants";
import { Product } from "@/utils/types";
import { useEffect, useState } from "react";
import Table from "./Table";

const AdminTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const getUniqueCategories = (products: { category: string }[]) => {
    return [...new Set(products.map((product) => product.category))];
  };
  const sortByCapacity = (products: Product[]) => {
    return [...products].sort((a, b) => {
      const getCapacity = (name: string) => {
        const match = name.match(/(\d+(\.\d+)?)\s*ح/);
        return match ? parseFloat(match[1]) : 0;
      };

      return getCapacity(a.name) - getCapacity(b.name);
    });
  };
  useEffect(() => {
    localStorage.setItem("linkItemActive", "1");
    // جلب البيانات من الـ API
    const fetchProducts = async () => {
      const response = await fetch(`${DOMAIN}/api/products`); // افترضنا أن الـ API موجود في هذا المسار
      const data = await response.json();
      const product = sortByCapacity(data);
      setProducts(product);
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
      <h1 className="text-2xl font-bold text-[#0084dd] mb-4">عرض المنتجات</h1>

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
      <Table filteredProducts={filteredProducts} typeTable="admin" />
    </div>
  );
};

export default AdminTable;
