import ProductDetails from "@/components/ProductDetails";

type PageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <ProductDetails id={id} typeUser="admin" />;
};

export default Page;
