"use client";
import { DOMAIN } from "@/utils/constants";
import { Product } from "@/utils/types";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ استبدال next/router بـ next/navigation
import React from "react";
import Swal from "sweetalert2";

type TableProps = {
  filteredProducts: Product[];
  typeTable: string;
};

const Table: React.FC<TableProps> = ({ filteredProducts, typeTable }) => {
  const router = useRouter(); // ✅ استخدام useRouter من next/navigation

  const deleteHandler = (product: Product) => {
    Swal.fire({
      title: "هل انت متأكد؟",
      text: `حذف ${product.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف هذا",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${DOMAIN}/api/products/${product.id}`);

          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف هذا المنتج",
            icon: "success",
          });
          router.replace("/");
          router.refresh(); // ✅ تحديث القائمة بعد الحذف بدون إعادة تحميل الصفحة
        } catch (error: any) {
          console.log(error);
          const message = error?.response?.data.message;
          if (message) {
            Swal.fire({
              title: message,
              text: "حدث خطأ أثناء الحذف",
              icon: "error",
            });
          }
        }
      }
    });
  };

  const handleUpdate = (product: Product) => {
    router.push(
      `admin/edit-product?id=${product.id}&name=${product.name}&price=${product.price}&category=${product.category}&quantity=${product.count}`
    );
  };
  const handleWithdrawal = (product: Product) => {
    router.push(
      `admin/product-withdrawal?id=${product.id}&description=${product.name}&price=${product.price}`
    );
  };
  const handleSupply = (product: Product) => {
    router.push(
      `admin/product-supply?id=${product.id}&description=${product.name}&price=${product.price}`
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#0084dd] text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">الاسم</th>
            <th className="px-4 py-2">السعر</th>
            <th className="px-4 py-2">الكمية</th>
            <th className="px-4 py-2">المجموع</th>
            <th className="px-4 py-2">الفئة</th>
            {typeTable === "admin" && (
              <>
                <th className="px-4 py-2">وارد</th>
                <th className="px-4 py-2">منصرف</th>
                <th className="px-4 py-2">تحديث</th>
                <th className="px-4 py-2">حذف</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {filteredProducts.map((product, index) => (
            <tr
              key={product.id}
              className="border-b hover:bg-[#f7f7f7] cursor-pointer"
            >
              <td className="px-10 py-2">{index + 1}</td>
              <td
                className="px-10 py-2 text-nowrap"
                onClick={() =>
                  router.push(
                    `${
                      typeTable === "admin"
                        ? `/admin/product-details/${product.id}`
                        : `/product/${product.id}`
                    }`
                  )
                }
              >
                {product.name}
              </td>
              <td className="px-4 py-2">${product.price.toLocaleString("en-US")}</td>
              <td className="px-10 py-2">{product.count}</td>
              <td className="px-10 py-2">
                ${(product.price * product.count).toLocaleString("en-US")}
              </td>
              <td className="px-4 py-2 text-nowrap">{product.category}</td>
              {typeTable === "admin" && (
                <>
                  <td className="px-10 py-2">
                    <button
                      onClick={() => handleSupply(product)}
                      className="bg-green-600 text-white py-1 hover:bg-green-500 px-4 rounded-md"
                    >
                      وارد
                    </button>
                  </td>
                  <td className="px-10 py-2">
                    <button
                      onClick={() => handleWithdrawal(product)}
                      className="bg-[#ff5722] text-white py-1 hover:bg-[#e4582d] px-4 rounded-md"
                    >
                      منصرف
                    </button>
                  </td>
                  <td className="px-10 py-2">
                    <button
                      onClick={() => handleUpdate(product)}
                      className="bg-blue-600 text-white py-1 hover:bg-blue-500 px-4 rounded-md"
                    >
                      تحديث
                    </button>
                  </td>
                  <td className="px-10 py-2">
                    <button
                      onClick={() => deleteHandler(product)}
                      className="bg-red-600 text-white py-1 hover:bg-red-500 px-4 rounded-md"
                    >
                      حذف
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
