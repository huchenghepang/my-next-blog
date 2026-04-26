import { getCachedArticles, getCacheLatestArticle } from "@/api/cache";
import SlideInCss from "@/components/Animation/SlideInCss";
import BookCard from "@/components/ArticleList/BookCard";
import Header from "@/components/Header/Header";
import HeroSection from "@/components/Hero";
import CategoryRecommend from "@/components/Home/CategoryRecommend";
import CornerQuote from "@/components/Home/CornerQuote";
import HomeSection from "@/components/Home/HomeSection";
import SideTitle from "@/components/Home/SideTitle";
import JsonLd from "@/components/JsonLid/JsonLd";
import Footer from "@/components/layout/footer";
import { GalaxyBackground } from "@/components/reactbit/Galaxy";
import SmoothScroll from "@/components/share/SmoothScroll";
import config from "@/config/config";
import { Dynamic } from "@/types/my.next";
import { Metadata } from "next";
import { ItemList, WebSite, WithContext } from "schema-dts";

export const revalidate = 3600;
export const dynamic: Dynamic = "force-static";

export const metadata: Metadata = {
  title: "云中书",
  description:
    "探索科学无法拯救灵魂的边界，追问哲学无法通向自由的困境。在这里，我思考生命、宇宙与一切的可能性。",
  keywords: "哲学,科学,思考,生命意义,自由意志,灵魂,云中书",
  authors: [{ name: "Jeff", url: "https://github.com/huchenghepang" }],
  creator: "Jeff",
  publisher: "Jeff的云中书",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "云中书",
    description:
      "探索科学无法拯救灵魂的边界，追问哲学无法通向自由的困境。生命中的每一步都意味着可能性。",
    url: "https://yunzhongshu.cn/",
    siteName: "云中书",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff的云中书 | 科学与哲学的思考空间",
    description: "探索科学无法拯救灵魂的边界，追问哲学无法通向自由的困境。",
    creator: "@jeff",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: "https://yunzhongshu.cn/",
  },
  category: "blog",
};



export default async function Home() {
  const dataList = await getCachedArticles();
  const { slug } = await getCacheLatestArticle();
  const websiteData: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jeff的云中书",
    url: config.siteUrl,
    description:
      "探索科学无法拯救灵魂的边界，追问哲学无法通向自由的困境。生命中的每一步都意味着可能性。",
    author: {
      "@type": "Person",
      name: "Jeff",
      url: `${config.siteUrl}/about`,
    },
    inLanguage: "zh-CN",
    keywords: "哲学,科学,思考,生命意义,自由意志,灵魂",
    copyrightYear: "2026",
    copyrightHolder: {
      "@type": "Person",
      name: "Jeff",
    },
  };

  // 准备 BreadcrumbList 数据
  const breadcrumbData: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: dataList.map((article, index) => ({
      "@type": "ListItem",
      name: article.title,
      item: `${config.siteUrl}/post/${article.slug}`,
      position: index + 1,
    })),
  };
  return (
    <>
      <JsonLd data={[websiteData, breadcrumbData]}></JsonLd>
      <SmoothScroll preset="reading" wheelMultiplier={1.1} root={false}>
        <div className="min-h-screen">
          {/* 头部横幅 */}
          <Header />
          <SideTitle text="生命中的每一步都意味着可能性" />

          <div className="absolute left-12 max-sm:top-20 sm:top-30">
            <SlideInCss direction="right">
              <CornerQuote title="Science" text="can't save the soul!" />
            </SlideInCss>
          </div>

          <div className="absolute w-fit left-60 max-sm:left-50 top-60 max-sm:top-20 sm:top-30">
            <SlideInCss direction="left" delay={500}>
              <CornerQuote title="Philosophy" text="can not lead to freedom" />
            </SlideInCss>
          </div>

          <HeroSection slug={slug} />

          <HomeSection>
            <div className="flex justify-center max-sm:flex-col max-sm:items-center">
              {dataList.map((article, index) => (
                <div key={article.id} className="w-full mx-auto">
                  <SlideInCss
                    direction={index % 2 === 0 ? "up" : "down"}
                    delay={index * 400}
                  >
                    <BookCard index={index} article={article} />
                  </SlideInCss>
                </div>
              ))}
            </div>
          </HomeSection>

          <CategoryRecommend />

          <Footer content="2025 Jeff的云中书" icpNumber="赣ICP备2024040386号" />

          <GalaxyBackground />
        </div>
      </SmoothScroll>
    </>
  );
}
