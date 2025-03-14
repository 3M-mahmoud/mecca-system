import InstallmentDetails from "@/components/InstallmentDetails";

type props = {
  params: { id: string };
};
const page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div className="py-32">
      <InstallmentDetails id={id} typeUser="user" />
    </div>
  );
};

export default page;
