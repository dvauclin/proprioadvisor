import React from 'react'
import Head from 'next/head'
import { generateMetadata } from '@/lib/metadata'

interface DynamicMetadataProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noindex?: boolean
  nofollow?: boolean
}

const DynamicMetadata: React.FC<DynamicMetadataProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  noindex = false,
  nofollow = false,
}) => {
  const metadata = generateMetadata(title, description, keywords, image, url)

  return (
    <Head>
      {/* Titre */}
      <title>{metadata.title}</title>
      
      {/* Description */}
      <meta name="description" content={metadata.description} />
      
      {/* Mots-clés */}
      {metadata.keywords && (
        <meta name="keywords" content={metadata.keywords.join(', ')} />
      )}
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Open Graph */}
      {metadata.openGraph && (
        <>
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta property="og:description" content={metadata.openGraph.description} />
          <meta property="og:type" content={metadata.openGraph.type} />
          <meta property="og:url" content={metadata.openGraph.url} />
          <meta property="og:site_name" content={metadata.openGraph.siteName} />
          <meta property="og:locale" content={metadata.openGraph.locale} />
          {metadata.openGraph.images?.map((img, index) => (
            <meta key={index} property="og:image" content={img.url} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      {metadata.twitter && (
        <>
          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="twitter:title" content={metadata.twitter.title} />
          <meta name="twitter:description" content={metadata.twitter.description} />
          {metadata.twitter.images?.map((img, index) => (
            <meta key={index} name="twitter:image" content={img} />
          ))}
        </>
      )}
      
      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
    </Head>
  )
}

export default DynamicMetadata 