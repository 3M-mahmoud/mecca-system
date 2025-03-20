import TraderDetails from "@/components/TraderDetails";

type props = {
  params: { id: string };
};
const Page = async ({ params }: props) => {
  const { id } = await params;
  return (
    <div className="py-32">
      <TraderDetails id={id} typeUser="user" />
    </div>
  );
};

export default Page;
