import RemainingDetails from "@/components/RemainingDetails";

type props = {
  params: { id: string };
};
const Page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div className="py-32">
      <RemainingDetails id={id} typeUser="user" />
    </div>
  );
};

export default Page;
