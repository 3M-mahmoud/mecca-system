import RemainingDetails from "@/components/RemainingDetails";
type PageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <RemainingDetails id={id} typeUser="admin" />
    </div>
  );
};

export default Page;
