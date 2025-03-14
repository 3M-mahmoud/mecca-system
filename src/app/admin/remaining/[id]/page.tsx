import RemainingDetails from "@/components/RemainingDetails";

type props = {
  params: { id: string };
};
const page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div>
      <RemainingDetails id={id} typeUser="admin" />
    </div>
  );
};

export default page;
