import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: "website" | "product";
}

function SEO({ title, description, image, canonical, type }: SEOProps) {
  const siteName = "Repuestos Palacios";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={fullTitle} />

      <meta property="og:description" content={description} />

      <meta property="og:type" content={type} />

      <meta property="og:site_name" content={siteName} />

      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={fullTitle} />

      <meta name="twitter:description" content={description} />

      {image && <meta name="twitter:image" content={image} />}

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}

export default SEO;
