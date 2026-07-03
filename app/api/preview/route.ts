import * as cheerio from "cheerio";

function extractMLId(url: string) {
  const match = url.match(/MLB\d+/);
  return match?.[0];
}

async function resolveRedirect(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
  });

  return res.url;
}

async function handleSingleUrl(url: string) {
  let finalUrl = url;

  // resolve meli.la
  if (url.includes("meli.la")) {
    finalUrl = await resolveRedirect(url);
  }

  // Mercado Livre
  if (finalUrl.includes("mercadolivre")) {
    const id = extractMLId(finalUrl);

    if (id) {
      const mlRes = await fetch(`https://api.mercadolibre.com/items/${id}`);

      const product = await mlRes.json();

      return {
        title: product.title,
        summary: product.title,
        thumbnail: product.thumbnail,
        url: product.permalink,
      };
    }
  }

  // fallback cheerio
  const res = await fetch(finalUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  return {
    title: $('meta[property="og:title"]').attr("content") || $("title").text(),

    summary: $('meta[property="og:description"]').attr("content") || "",

    thumbnail: $('meta[property="og:image"]').attr("content") || "",

    url: finalUrl,
  };
}

export async function POST(req: Request) {
  const { urls } = await req.json();

  if (!Array.isArray(urls)) {
    return Response.json({ error: "urls deve ser um array" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      urls.map((url: string) => handleSingleUrl(url).catch(() => null)),
    );

    return Response.json(results.filter(Boolean));
  } catch (error) {
    return Response.json({ error: "Erro ao gerar previews" }, { status: 500 });
  }
}
