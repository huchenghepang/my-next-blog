import AnimatedCharacter from "@/components/Animation/PersonAnimation";
import Header from "@/components/Hearder/Hearder";
import HeroSection from "@/components/Hero";
import CategoryRecommend from "@/components/Home/CategoryRecommend";
import SideTitle from "@/components/Home/SideTitle";
import SlipDamping from "@/components/Home/Sidle";
import HotArticlleWrapper from "@/components/HotArticle/HotArticlleWrapper";




export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-600  dark:text-white">
      {/* 头部横幅 */}
      <Header></Header>
      <SideTitle></SideTitle>

      {/* 关于作者 */}

      <HeroSection></HeroSection>

      {/* 热门文章 */}
      <HotArticlleWrapper></HotArticlleWrapper>
      {/* 分类导航 */}
      <CategoryRecommend></CategoryRecommend>
      <AnimatedCharacter></AnimatedCharacter>
      <SlipDamping></SlipDamping>
      {/* 页脚 */}
      <footer className=" text-violet-300 dark:text-cyan-200 text-center py-6">
        <p>&copy; 2025 Jeff的博客. 版权所有</p>
      </footer>
    </div>
  );
}
