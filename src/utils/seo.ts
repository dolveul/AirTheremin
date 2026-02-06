/**
 * SEO 유틸리티 (클라이언트 환경용)
 *
 * 메타 태그 및 초기 HTML 최적화. document를 사용하므로 브라우저 전제입니다.
 * SSR 환경에서는 서버에서 메타를 주입하는 SSR-safe 대안이 필요합니다.
 * 자세한 포지셔닝: docs/SSR_AND_SEO.md
 */

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
}

/**
 * 페이지 메타 태그 설정 (클라이언트 전용)
 * SSR 환경에서는 사용할 수 없으며, SSR-safe 대안을 별도 구현해야 합니다.
 */
export function setPageMeta(data: SEOData): void {
  // Title 설정
  if (document.title !== data.title) {
    document.title = data.title
  }

  // Meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', data.description)

  // Meta keywords
  if (data.keywords && data.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', data.keywords.join(', '))
  }

  // Open Graph tags
  const ogTags = [
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:type', content: data.ogType || 'website' },
  ]

  if (data.ogImage) {
    ogTags.push({ property: 'og:image', content: data.ogImage })
  }

  ogTags.forEach(({ property, content }) => {
    let ogTag = document.querySelector(`meta[property="${property}"]`)
    if (!ogTag) {
      ogTag = document.createElement('meta')
      ogTag.setAttribute('property', property)
      document.head.appendChild(ogTag)
    }
    ogTag.setAttribute('content', content)
  })

  // Canonical URL
  if (data.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', data.canonicalUrl)
  }
}

/**
 * 초기 HTML에 포함될 구조화된 데이터 생성
 */
export function generateStructuredData(data: {
  type: 'Article' | 'WebPage' | 'Organization'
  name: string
  description: string
  url?: string
  image?: string
}): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    description: data.description,
    ...(data.url && { url: data.url }),
    ...(data.image && { image: data.image }),
  }

  return JSON.stringify(structuredData)
}

