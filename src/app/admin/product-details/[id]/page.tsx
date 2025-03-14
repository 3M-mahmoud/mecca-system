import ProductDetails from "@/components/ProductDetails";

type props = {
  params: { id: string };
};
const page = async ({ params }: props) => {
  const { id } = await params;
  return <ProductDetails id={id} typeUser="admin" />;
};

export default page;
