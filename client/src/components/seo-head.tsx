import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  schemaMarkup?: object;
}

const defaultSEO = {
  title: "reverb256 - Canadian Developer & VibeCoding Architect | Full-Stack Development & VR Research",
  description: "Canadian developer specializing in full-stack development, VR consciousness research, and classical learning methodologies. Explore innovative projects merging ancient wisdom with cutting-edge technology through VibeCoding philosophy.",
  keywords: "Canadian developer, full-stack development, VibeCoding, VR research, consciousness studies, classical learning, cypherpunk philosophy, Charter rights, open source, TypeScript, React, Node.js, PostgreSQL, Linux administration, Honkai Star Rail, Penacony research, virtual reality",
  canonicalUrl: "https://reverb256.github.io",
  ogImage: "/attached_assets/image_1749437295296.png",
  ogType: "website",
  twitterCard: "summary_large_image"
};

export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  schemaMarkup
}: SEOHeadProps) {
  
  const seoData = {
    title: title || defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    canonicalUrl: canonicalUrl || defaultSEO.canonicalUrl,
    ogImage: ogImage || defaultSEO.ogImage,
    ogType,
    twitterCard
  };

  useEffect(() => {
    // Update document title
    document.title = seoData.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords);
    updateMetaTag('author', 'reverb256');
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('language', 'en-CA');
    updateMetaTag('geo.region', 'CA');
    updateMetaTag('geo.country', 'Canada');

    // Open Graph tags
    updateMetaTag('og:title', seoData.title, true);
    updateMetaTag('og:description', seoData.description, true);
    updateMetaTag('og:type', seoData.ogType, true);
    updateMetaTag('og:url', seoData.canonicalUrl, true);
    updateMetaTag('og:image', `${seoData.canonicalUrl}${seoData.ogImage}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', 'reverb256 - Cybernetic Portfolio Showcase', true);
    updateMetaTag('og:site_name', 'reverb256 Portfolio', true);
    updateMetaTag('og:locale', 'en_CA', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', seoData.twitterCard);
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    updateMetaTag('twitter:image', `${seoData.canonicalUrl}${seoData.ogImage}`);
    updateMetaTag('twitter:image:alt', 'reverb256 - Cybernetic Portfolio Showcase');
    updateMetaTag('twitter:creator', '@reverb256');
    updateMetaTag('twitter:site', '@reverb256');

    // Technical SEO
    updateMetaTag('theme-color', '#00bcd4');
    updateMetaTag('msapplication-TileColor', '#071321');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('apple-mobile-web-app-title', 'reverb256');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonicalUrl);

    // JSON-LD Schema Markup
    if (schemaMarkup) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaMarkup);
    } else {
      // Default schema markup
      const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "reverb256",
        "jobTitle": "Full-Stack Developer & VR Researcher",
        "description": "Canadian developer specializing in consciousness studies through virtual reality and classical learning methodologies",
        "url": seoData.canonicalUrl,
        "image": `${seoData.canonicalUrl}${seoData.ogImage}`,
        "sameAs": [
          "https://github.com/reverb256"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "CA",
          "addressRegion": "Canada"
        },
        "knowsAbout": [
          "Full-Stack Development",
          "Virtual Reality Research",
          "Classical Philosophy",
          "Cypherpunk Philosophy",
          "Canadian Charter Rights",
          "Open Source Development",
          "Consciousness Studies",
          "VibeCoding Methodology"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Grove of Epiphany - Classical Learning Institute"
        },
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Advanced Linux Administration",
            "credentialCategory": "Technical Certification"
          },
          {
            "@type": "EducationalOccupationalCredential", 
            "name": "Full-Stack JavaScript Development",
            "credentialCategory": "Technical Certification"
          }
        ]
      };

      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(defaultSchema);
    }

    // Preconnect to external domains for performance
    const addPreconnect = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com');
    addPreconnect('https://cdnjs.cloudflare.com');

  }, [seoData, schemaMarkup]);

  return null;
}

// SEO utility functions for different page types
export const getSEOForPage = (page: string) => {
  const baseSEO = {
    canonicalUrl: `https://reverb256.github.io${page === 'home' ? '' : `/${page}`}`
  };

  switch (page) {
    case 'home':
      return {
        ...baseSEO,
        title: "reverb256 - Canadian Developer & VibeCoding Architect | Full-Stack Development & VR Research",
        description: "Canadian developer specializing in full-stack development, VR consciousness research, and classical learning methodologies. Explore innovative projects merging ancient wisdom with cutting-edge technology.",
        keywords: "Canadian developer, full-stack development, VibeCoding, VR research, consciousness studies, classical learning, cypherpunk philosophy, reverb256"
      };

    case 'vrchat':
      return {
        ...baseSEO,
        title: "VRChat Research & Digital Consciousness Studies | reverb256",
        description: "Explore groundbreaking VR consciousness research through VRChat worlds. Discover how virtual reality environments amplify human connection and digital presence engineering.",
        keywords: "VRChat research, virtual reality consciousness, digital presence engineering, VR psychology, avatar embodiment, spatial audio, reverb256",
        schemaMarkup: {
          "@context": "https://schema.org",
          "@type": "ResearchProject",
          "name": "VRChat Digital Consciousness Research",
          "description": "Systematic exploration of consciousness and human connection in virtual reality environments",
          "researcher": {
            "@type": "Person",
            "name": "reverb256"
          },
          "about": "Virtual Reality Psychology and Digital Presence Engineering"
        }
      };

    case 'values':
      return {
        ...baseSEO,
        title: "Canadian Charter Values & Digital Rights Philosophy | reverb256",
        description: "Exploring how Canadian Charter of Rights and Freedoms guides ethical technology development, cypherpunk philosophy, and digital freedom advocacy.",
        keywords: "Canadian Charter Rights, digital freedom, cypherpunk philosophy, ethical technology, open source development, privacy rights, reverb256"
      };

    default:
      return baseSEO;
  }
};