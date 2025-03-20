import TraderDetails from "@/components/TraderDetails";
type PageProps = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <TraderDetails id={id} typeUser="admin" />
    </div>
  );
};

export default Page;
