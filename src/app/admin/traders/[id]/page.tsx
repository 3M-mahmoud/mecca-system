import TraderDetails from "@/components/TraderDetails";

type props = {
  params: { id: string };
};
const page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div>
      <TraderDetails id={id} typeUser="admin" />
    </div>
  );
};

export default page;
