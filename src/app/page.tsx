import { getPublicArticles } from "@/api/article";
import BookCard from "@/components/ArticleList/BookCard";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/Hero";
import CategoryRecommend from "@/components/Home/CategoryRecommend";
import CornerQuote from "@/components/Home/CornerQuote";
import HomeSection from "@/components/Home/HomeSection";
import SideTitle from "@/components/Home/SideTitle";
import Footer from "@/components/layout/footer";
import { GalaxyBackground } from "@/components/reactbit/Galaxy";
import { Dynamic } from "@/types/my.next";

import { unstable_cache } from "next/cache";

export const revalidate = 3600;
export const dynamic: Dynamic = "force-static";

const getCachedArticles = unstable_cache(
  async () => {
    try {
      const res = await getPublicArticles({
        is_published: true,
        page: 1,
        pageSize: 3,
      });

      if (!res?.items) return [];

      return res.items
        .filter((a) => Boolean(a.public_id))
        .map((ar) => ({
          id: ar.public_id!,
          title: ar.title,
          slug: "/post/" + ar.slug,
          author: ar.external_author,
          summary: ar.description,
        }));
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      return [];
    }
  },
  ["home-articles"], // 缓存键
  {
    revalidate: 3600, // 1小时
    tags: ["articles"], // 标签，用于按需重新验证
  },
);
export default async function Home() {
  const dataList = await getCachedArticles();
  console.log(dataList);
  return (
    <>
      <div className="min-h-screen">
        {/* 头部横幅 */}
        <Header></Header>
        <SideTitle text="生命中的每一步都意味着可能性"></SideTitle>
        <div className="absolute left-12 max-sm:top-20 sm:top-30">
          <CornerQuote
            title="Science"
            text="can't save the soul!"
          ></CornerQuote>
        </div>
        <div className="absolute w-fit left-60 max-sm:left-50 top-60 max-sm:top-20 sm:top-30">
          <CornerQuote
            title="Philosophy"
            text="can not lead to freedom"
          ></CornerQuote>
        </div>
        {/* 关于作者 */}

        <HeroSection></HeroSection>
        <HomeSection>
          <div className="flex justify-center max-sm:flex-col max-sm:items-center">
            {dataList.map((article, index) => {
              return (
                <div key={article.id} className="w-full mx-auto">
                  <BookCard index={index} article={article} />
                </div>
              );
            })}
          </div>
        </HomeSection>

        {/* 热门文章 */}
        {/* <HotArticleWrapper></HotArticleWrapper> */}
        {/* 分类导航 */}
        <CategoryRecommend></CategoryRecommend>
        {/* <AnimatedCharacter></AnimatedCharacter> */}
        {/* <SlipDamping></SlipDamping> */}
        {/* 页脚 */}
        <Footer
          content="2025 Jeff的云中书"
          icpNumber="赣ICP备2024040386号"
        ></Footer>
        <GalaxyBackground></GalaxyBackground>
      </div>
    </>
  );
}
