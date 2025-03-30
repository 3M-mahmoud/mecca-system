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
          <div className="mb-4 flex items-center justify-between flex-col space-y-2 md:flex-row">
            <div className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-auto h-full opacity-100 object-stretch"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                  ></path>
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="object-cover w-full h-full"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                  ></path>
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
              <span className="relative text-base font-semibold">
                عدد الاجهزة ={" "}
                <span className="font-bold text-lg">
                  {totalProduct.toLocaleString("en-US")}
                </span>
              </span>
            </div>
            <div className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-auto h-full opacity-100 object-stretch"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                  ></path>
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="object-cover w-full h-full"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                  ></path>
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
              <span className="relative text-base font-semibold">
                عدد الاصناف ={" "}
                <span className="font-bold text-lg">
                  {filteredProducts.length}
                </span>
              </span>
            </div>
            <div className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-auto h-full opacity-100 object-stretch"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                  ></path>
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="object-cover w-full h-full"
                  viewBox="0 0 487 487"
                >
                  <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                  ></path>
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
              <span className="relative text-base font-semibold">
              الاجمالي=
                <span className="font-bold text-lg mr-1">
                  {totalPrice.toLocaleString("en-US")}
                </span>
              </span>
            </div>
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
