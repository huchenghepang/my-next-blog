import CategoriesLayout from "./CategoriesLayout";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  return (
    <CategoriesLayout
      params={await params}
      query={await searchParams}
    ></CategoriesLayout>
  );
}
