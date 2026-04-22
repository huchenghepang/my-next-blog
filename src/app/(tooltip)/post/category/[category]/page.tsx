import CategoriesLayout from "../CategoriesLayout";

export default async function Page({
  params,
  searchParams,
}: CategoryPageProps) {
  const paramsData = await params;
  return (
    <CategoriesLayout
      params={paramsData}
      query={await searchParams}
    ></CategoriesLayout>
  );
}
