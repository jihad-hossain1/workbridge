import { PageContainer } from "@/components/ui/container";
import { Manage } from "@/modules/projects/view/manage";

type IProps = {
  searchParams: Promise<{ id: string }>;
};

const Page = async (props: IProps) => {
  const { searchParams } = props;
  const params = await searchParams;

  return (
    <PageContainer>
      <Manage id={params.id} />
    </PageContainer>
  );
};

export default Page;
