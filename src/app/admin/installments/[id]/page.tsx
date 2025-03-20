import InstallmentDetails from "@/components/InstallmentDetails";
type PageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { id } = params;

  return <InstallmentDetails id={id} typeUser="admin" />;
};

export default Page;