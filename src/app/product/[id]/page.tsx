import ProductDetails from "@/components/ProductDetails";
import React from "react";
type props = {
  params: { id: string };
};
const Page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div className="py-32">
      <ProductDetails id={id} typeUser="user" />
    </div>
  );
};

export default Page;
