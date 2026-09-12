import { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aryanamdavadi.com'

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    }
  ] as MetadataRoute.Sitemap

  const projectRoutes = projects
    .filter(p => p.caseStudyRoute)
    .map((project) => ({
      url: `${baseUrl}${project.caseStudyRoute}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })) as MetadataRoute.Sitemap

  return [...staticRoutes, ...projectRoutes]
}
