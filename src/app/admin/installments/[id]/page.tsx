import InstallmentDetails from "@/components/InstallmentDetails";

type props = {
  params: { id: string };
};
const page = async ({ params }: props) => {
  const { id } = await params;
  return <InstallmentDetails id={id} typeUser="admin" />;
};

export default page;
