import ProductsTable from "@/components/ProductTable";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="container mx-auto px-6 py-28">
      <ProductsTable />
    </main>
  );
};

export default Home;
