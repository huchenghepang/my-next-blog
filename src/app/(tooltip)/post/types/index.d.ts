interface CategoryPageProps {
  /**
   * 路径参数: tech
   */
  params: Promise<{ category: string }>; //
  /**
   * 查询参数: page=2&pageSize=6
   */
  searchParams: Promise<{ page?: string; pageSize?: string }>; //
}
