import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RevalidateSchema = z.object({
  type: z.enum(["article", "list", "category", "tag", "home"]),
  action: z.enum(["create", "update", "delete", "publish", "unpublish"]),
  data: z.object({
    slug: z.string().optional(),
    publicId: z.string().optional(),
    categoryId: z.number().optional(),
    tagId: z.number().optional(),
    page: z.number().optional(),
    slugs: z.array(z.string()).optional(),
    ids: z.array(z.string()).optional(),
  }),
  options: z
    .object({
      revalidateListOnly: z.boolean().optional(),
      revalidateDetailOnly: z.boolean().optional(),
      revalidateRelated: z.boolean().optional(),
      immediate: z.boolean().optional(),
    })
    .optional(),
});
export type RevalidateSchemaType = z.infer<typeof RevalidateSchema>;
export async function POST(request: NextRequest) {
  try {
    // 验证 secret
    const secret = request.headers.get("x-api-key");
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = RevalidateSchema.parse(body);

    // 根据类型和动作执行相应的缓存策略
    const result = await handleRevalidation(validated);

    return NextResponse.json({
      success: true,
      revalidated: result,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to revalidate",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

// 核心缓存处理逻辑
async function handleRevalidation(params: z.infer<typeof RevalidateSchema>) {
  const { type, action, data, options } = params;
  const revalidated = [];

  // 策略模式：根据类型和动作决定重新验证范围
  const strategies = {
    article: () => handleArticleRevalidation(action, data, options),
    list: () => handleListRevalidation(action, data, options),
    category: () => handleCategoryRevalidation(action, data, options),
    tag: () => handleCategoryRevalidation(action, data, options),
    home: () => handleHomeRevalidation(),
  };

  const strategy = strategies[type];
  if (strategy) {
    return await strategy();
  }

  throw new Error(`Unknown revalidation type: ${type}`);
}

// 文章相关的缓存策略
async function handleArticleRevalidation(
  action: string,
  data: any,
  options?: any,
) {
  const revalidated = [];

  // 1. 重新验证文章详情页 (使用实际的路径结构)
  if (!options?.revalidateListOnly) {
    if (data.slug) {
      revalidatePath(`/post/${data.slug}`); // 实际的文章详情页路径
      revalidateTag(`article-${data.slug}`, "max");
      revalidated.push(`article-detail:${data.slug}`);
    }
    if (data.slugs) {
      data.slugs.forEach((slug: string) => {
        revalidatePath(`/post/${slug}`); // 实际的文章详情页路径
        revalidateTag(`article-${slug}`, "max");
        revalidated.push(`article-detail:${slug}`);
      });
    }
  }

  // 2. 重新验证列表页（智能策略）
  if (!options?.revalidateDetailOnly) {
    const listPages = await getAffectedListPages(action, data);
    for (const page of listPages) {
      revalidatePath(`/post${page.query || ""}`); // 实际的文章列表路径
      revalidateTag(`article-list-${page.key}`, "max");
      revalidated.push(`article-list:${page.key}`);
    }
  }

  // 3. 重新验证相关分类页 (使用实际的分类路径)
  if (options?.revalidateRelated !== false) {
    if (data.categoryId) {
      // 获取分类的slug名称，需要通过API获取
      const categoryName = await getCategoryNameById(data.categoryId);
      if (categoryName) {
        revalidatePath(`/post/category/${categoryName}`); // 实际的分类路径
        revalidateTag(`category-${data.categoryId}`, "max");
        revalidated.push(`category:${data.categoryId}`);
      }
    }
    if (data.tagId) {
      revalidatePath(`/tags/${data.tagId}`); // 如果有标签页的话
      revalidateTag(`tag-${data.tagId}`, "max");
      revalidated.push(`tag:${data.tagId}`);
    }
  }

  // 4. 首页也可能受影响
  if (action === "create" || action === "publish") {
    revalidatePath("/"); // 首页
    revalidateTag("home-page", "max");
    revalidated.push("home-page");
  }

  return revalidated;
}

// 智能获取受影响的列表页
async function getAffectedListPages(action: string, data: any) {
  const pages = [];

  // 总是重新验证第一页（最重要的）
  pages.push({ key: "page-1", query: "?page=1" });

  // 如果是新文章，可能影响前3页
  if (action === "create") {
    pages.push({ key: "page-2", query: "?page=2" });
    pages.push({ key: "page-3", query: "?page=3" });
  }

  // 如果有分类，重新验证该分类的列表页
  if (data.categoryId) {
    // 获取分类的slug名称
    const categoryName = await getCategoryNameById(data.categoryId);
    if (categoryName) {
      pages.push({
        key: `category-${data.categoryId}-page-1`,
        query: `?category=${categoryName}&page=1`,
      });
    }
  }

  // 如果是热门文章，重新验证热门列表
  if (data.isHot) {
    pages.push({
      key: "hot-page-1",
      query: "?isHot=true&page=1",
    });
  }

  return pages;
}

// 根据分类ID获取分类名称的辅助函数
async function getCategoryNameById(categoryId: number): Promise<string | null> {
  try {
    // 从现有API导入分类数据
    const { getArticleCategoryList } = await import("@/api/article");

    const response = await getArticleCategoryList();
    // 从响应中提取分类数据，处理可能的不同返回格式
    const categories = Array.isArray(response)
      ? response
      : response.items || [];
    const category = categories.find(
      (cat: any) => cat.category_id === categoryId,
    );
    return category ? category.slug : null; // 返回分类的slug
  } catch (error) {
    console.error(`获取分类名称失败，ID: ${categoryId}`, error);
    return null;
  }
}

// 列表页批量重新验证策略
async function handleListRevalidation(
  action: string,
  data: any,
  options?: any,
) {
  const revalidated = [];

  // 可以重新验证特定页码
  if (data.page) {
    revalidatePath(`/post?page=${data.page}`);
    revalidateTag(`article-list-page-${data.page}`, "max");
    revalidated.push(`list-page-${data.page}`);
  }

  // 批量重新验证多页
  if (data.pages) {
    for (const page of data.pages) {
      revalidatePath(`/post?page=${page}`);
      revalidateTag(`article-list-page-${page}`, "max");
      revalidated.push(`list-page-${page}`);
    }
  }

  // 全量刷新（慎用）
  if (action === "full-refresh") {
    revalidatePath("/post");
    revalidateTag("article-list", "max");
    revalidated.push("full-list");
  }

  return revalidated;
}

// 分类页缓存策略
async function handleCategoryRevalidation(
  action: string,
  data: any,
  options?: any,
) {
  const revalidated = [];

  if (data.categoryId) {
    // 获取分类的slug名称
    const categoryName = await getCategoryNameById(data.categoryId);
    if (categoryName) {
      revalidatePath(`/post/category/${categoryName}`); // 实际的分类路径
      revalidateTag(`category-${data.categoryId}`, "max");
      revalidated.push(`category:${data.categoryId}`);
    }
  }

  // 分类变化时也会影响文章列表
  if (options?.revalidateRelated !== false) {
    revalidatePath("/post"); // 实际的文章列表路径
    revalidateTag("article-list", "max");
    revalidated.push("article-list");
  }

  return revalidated;
}

// 首页缓存策略
async function handleHomeRevalidation() {
  revalidatePath("/");
  revalidateTag("home-page", "max");
  return ["home-page"];
}
