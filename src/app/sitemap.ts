import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://huchenghe.site',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
            images: ["https://example.com/image.jpg"]
        },
        {
            url: 'https://huchenghe.site/about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://huchenghe.site/login',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}