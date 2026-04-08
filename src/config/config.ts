 
 export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "我的博客";
 export const siteUrl =
   process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
 export const siteLogo =
   process.env.NEXT_PUBLIC_SITE_LOGO_URL || `${siteUrl}/logo.png`;
 export const defaultAuthor = process.env.NEXT_PUBLIC_DEFAULT_AUTHOR || "Jeff";

 const config = {
   expireSessionTime: 7 * 60 * 60 * 24,
   allowedIPs: ["::ffff:127.0.0.1", "::1"],
   baseUrl: "http://localhost:4000",
   siteName,
   siteUrl,
   siteLogo,
   defaultAuthor,
 };

export default config