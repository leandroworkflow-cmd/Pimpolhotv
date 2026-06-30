import { db } from "@/api/base44Client";

import { useEffect } from "react";

export default function SEOHead({ title, description, image, url, type = "website", videoUrl }) {
  const siteName = "Pimpolho TV";
  const defaultDesc = "Plataforma de vídeos 100% segura e divertida para crianças até 12 anos! Desenhos, músicas, histórias e muito mais.";
  const defaultImage = "https://media.db.com/images/public/6a3bf9e58663112b2c03128d/ce1b6d14f_generated_image.png";

  const finalTitle = title ? `${title} | ${siteName}` : `${siteName} - Vídeos Infantis Seguros 🌟`;
  const finalDesc = description || defaultDesc;
  const finalImage = image || defaultImage;
  const finalUrl = url || window.location.href;

  useEffect(() => {
    document.title = finalTitle;
    setMeta("description", finalDesc);

    // Open Graph
    setOg("title", finalTitle);
    setOg("description", finalDesc);
    setOg("image", finalImage);
    setOg("url", finalUrl);
    setOg("type", type);
    setOg("site_name", siteName);
    setOg("locale", "pt_BR");

    // Twitter Card
    setTwitter("card", "summary_large_image");
    setTwitter("title", finalTitle);
    setTwitter("description", finalDesc);
    setTwitter("image", finalImage);

    // Keywords
    setMeta("keywords", "Pimpolho TV, vídeos infantis, desenhos animados, músicas infantis, crianças, educativo, seguro, kids, histórias infantis, Peppa Pig, Galinha Pintadinha, Turma da Mônica");
    setMeta("robots", "index, follow");
    setMeta("author", "KidsTV");
    setMeta("rating", "Safe for Kids");

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = finalUrl;

    // Schema.org JSON-LD
    const existingSchema = document.getElementById("schema-org");
    if (existingSchema) existingSchema.remove();

    const schema = document.createElement("script");
    schema.id = "schema-org";
    schema.type = "application/ld+json";

    if (type === "video.other" && videoUrl) {
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: finalTitle,
        description: finalDesc,
        thumbnailUrl: finalImage,
        contentUrl: videoUrl,
        uploadDate: new Date().toISOString(),
        isFamilyFriendly: true,
      });
    } else {
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: window.location.origin,
        description: defaultDesc,
        potentialAction: {
          "@type": "SearchAction",
          target: `${window.location.origin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }
    document.head.appendChild(schema);
  }, [finalTitle, finalDesc, finalImage, finalUrl]);

  return null;
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name='${name}']`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOg(property, content) {
  let el = document.querySelector(`meta[property='og:${property}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", `og:${property}`);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setTwitter(name, content) {
  let el = document.querySelector(`meta[name='twitter:${name}']`);
  if (!el) {
    el = document.createElement("meta");
    el.name = `twitter:${name}`;
    document.head.appendChild(el);
  }
  el.content = content;
}