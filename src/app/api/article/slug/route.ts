import { getArticleDetailBySlug } from "@/api/article";
import { createApiHandler } from "@/utils/createApiHandler";
import { parseRequestDataAndQueryData } from "@/utils/parseRequestData";
import {
  sendError,
  sendResponse,
} from "@/utils/responseHandler/responseHandler";

export interface ArticleInfoSimple {
  reading?: number;
  publicId?: string;
  slug: string;
  updated_time?: string;
  create_time?: string;
}

export const GET = createApiHandler(async (req) => {
  const info = await parseRequestDataAndQueryData<any, { slug?: string }>(req);
  const slug = info.query.slug;
  if (!slug) {
    return sendError({
      code: "400",
      errorMessage: "slug参数是必须的",
    });
  }
  const res = await getArticleDetailBySlug(slug);

  return sendResponse<ArticleInfoSimple>({
    message: "成功获取到文章详情信息",
    data: {
      slug: res.slug,
      reading: res.reading,
      publicId: res.public_id,
      updated_time: res.updated_at,
      create_time: res.created_at,
    },
  });
});
