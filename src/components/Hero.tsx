import AdditionalText from "./AdditionalText";
import HomeSection from "./Home/HomeSection";
import { AboutLink } from "./MyLink/AboutLink";
import { LatestArticleLink } from "./MyLink/LatestArticleLink";
import TypeWriter from "./TypeWriter/TypeWriter";

const HeroSection = ({ slug }: { slug: string }) => {
  return (
    <HomeSection>
      <div className="relative">
        <div className="h-screen w-full bg-[url('/webp/167387.webp')] dark:rounded-full dark:bg-[url('/webp/20230505529l83.webp')] bg-cover bg-fixed bg-center"></div>
        <div className="absolute z-10 top-[10%] left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4 sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <AdditionalText />
          <div className="mt-12">
            <AdditionalText
              quote={{
                author: "jeff",
                text: "那年拂过的风，不曾想成了此生做过的梦",
                english:
                  "The wind that swept through that year is nothing but a dream of this life.",
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="container flex flex-col items-center px-4 py-16 pb-24 mx-auto text-center lg:pb-56 md:py-32 md:px-10 lg:px-32 ">
          {/* 预留固定的高度，避免高度跳变 */}
          <TypeWriter />
          <p className="mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl dark:text-gray-50">
            无论如何，希望你我，毫无疑问，活的幸福！
          </p>

          <div className="relative z-20 flex flex-wrap justify-center">
            <LatestArticleLink slug={slug} />
            <AboutLink />
          </div>
        </div>
      </div>
      <div className="absolute z-0 bottom-0 left-0 w-full h-4/6 rounded-3xl bg-cover bg-center bg-gradient-to-t from-orange-300/50 to-transparent"></div>
    </HomeSection>
  );
};

export default HeroSection;
