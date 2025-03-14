"use client";

import { useState } from "react";
import { Traders } from "@/utils/types";

interface Props {
  customers: Traders[];
  setSelectedCustomer: (value: number) => void;
  selectedCustomer: number | null;
}

const CustomerList = ({
  customers,
  setSelectedCustomer,
  selectedCustomer,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // تصفية العملاء بناءً على البحث
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // اختيار العميل وإغلاق القائمة
  const handleSelect = (id: number, name: string) => {
    setSelectedCustomer(id);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* زرار اختيار العميل */}
      <label className="block font-medium mb-1">اختيار العميل:</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full  text-black py-2 px-4 rounded-lg border transition"
      >
        {selectedCustomer
          ? `العميل المختار: ${
              customers.find((c) => c.id === selectedCustomer)?.name ||
              "غير معروف"
            }`
          : "اختيار العميل"}
      </button>

      {/* القائمة المنبثقة */}
      {isOpen && (
        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 z-10 border">
          {/* حقل البحث */}
          <div className="relative p-3 border-b">
            <input
              type="text"
              placeholder="ابحث عن العميل..."
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

          {/* قائمة العملاء */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelect(customer.id, customer.name)}
                  className="flex items-center cursor-pointer p-3 hover:bg-blue-100 transition border-b"
                >
                  <span className="font-medium">{customer.name}</span>
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

export default CustomerList;
