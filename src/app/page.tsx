import { getCachedArticles, getCacheLatestArticle } from "@/api/cache";
import BookCard from "@/components/ArticleList/BookCard";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/Hero";
import CategoryRecommend from "@/components/Home/CategoryRecommend";
import CornerQuote from "@/components/Home/CornerQuote";
import HomeSection from "@/components/Home/HomeSection";
import SideTitle from "@/components/Home/SideTitle";
import Footer from "@/components/layout/footer";
import { GalaxyBackground } from "@/components/reactbit/Galaxy";
import SmoothScroll from "@/components/share/SmoothScroll";
import { Dynamic } from "@/types/my.next";

export const revalidate = 3600;
export const dynamic: Dynamic = "force-static";

export default async function Home() {
  const dataList = await getCachedArticles();
  const { slug } = await getCacheLatestArticle();
  return (
    <SmoothScroll preset="reading" wheelMultiplier={1.1} root={false}>
      <div className="min-h-screen">
        {/* 头部横幅 */}
        <Header />
        <SideTitle text="生命中的每一步都意味着可能性" />

        <div className="absolute left-12 max-sm:top-20 sm:top-30">
          <CornerQuote title="Science" text="can't save the soul!" />
        </div>

        <div className="absolute w-fit left-60 max-sm:left-50 top-60 max-sm:top-20 sm:top-30">
          <CornerQuote title="Philosophy" text="can not lead to freedom" />
        </div>

        <HeroSection slug={slug} />

        <HomeSection>
          <div className="flex justify-center max-sm:flex-col max-sm:items-center">
            {dataList.map((article, index) => (
              <div key={article.id} className="w-full mx-auto">
                <BookCard index={index} article={article} />
              </div>
            ))}
          </div>
        </HomeSection>

        <CategoryRecommend />

        <Footer content="2025 Jeff的云中书" icpNumber="赣ICP备2024040386号" />

        <GalaxyBackground />
      </div>
    </SmoothScroll>
  );
}
