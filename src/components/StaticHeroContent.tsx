import { memo } from "react";
import { AboutLink } from "./MyLink/AboutLink";
import { LatestArticleLink } from "./MyLink/LatestArticleLink";
import TypeWriter from "./TypeWriter/TypeWriter";

const StaticHeroContent = memo(({ slug }: { slug: string }) => (
  <div className="container flex flex-col items-center px-4 py-16 pb-24 mx-auto text-center lg:pb-56 md:py-32 md:px-10 lg:px-32">
    <TypeWriter />
    <p className="mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl dark:text-gray-50">
      无论如何，希望你我，毫无疑问，活的幸福！
    </p>
    <div className="relative z-20 flex flex-wrap justify-center">
      <LatestArticleLink slug={slug} />
      <AboutLink />
    </div>
  </div>
));
StaticHeroContent.displayName = "StaticHeroContent";
export default StaticHeroContent;
