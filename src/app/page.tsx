import AnimatedCharacter from "@/components/Animation/PersonAnimation";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/Hero";
import CategoryRecommend from "@/components/Home/CategoryRecommend";
import SideTitle from "@/components/Home/SideTitle";
import SlipDamping from "@/components/Home/Sidle";
import HotArticleWrapper from "@/components/HotArticle/HotArticleWrapper";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-black dark:bg-zinc-600  dark:text-white">
        {/* 头部横幅 */}
        <Header></Header>
        <SideTitle text="生命中的每一步都意味着可能性"></SideTitle>

        {/* 关于作者 */}

        <HeroSection></HeroSection>

        {/* 热门文章 */}
        <HotArticleWrapper></HotArticleWrapper>
        {/* 分类导航 */}
        <CategoryRecommend></CategoryRecommend>
        <AnimatedCharacter></AnimatedCharacter>
        <SlipDamping></SlipDamping>
        {/* 页脚 */}
        <Footer
          content="2025 Jeff的云中书"
          icpNumber="赣ICP备2024040386号"
        ></Footer>
      </div>
    </>
  );
}
