const PLACE_ID_PREFIXES = ["ChIJ", "GhIJ"];
const G_PAGE_CODE_PREFIX = "CUv_";

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function extractGPageCode(value: string): string | null {
  const trimmed = value.trim();
  const fromUrl = trimmed.match(/g\.page\/r\/([^/?#]+)/i);
  if (fromUrl?.[1]) {
    return fromUrl[1];
  }

  if (trimmed.startsWith(G_PAGE_CODE_PREFIX)) {
    return trimmed;
  }

  return null;
}

function extractPlaceIdFromUrl(value: string): string | null {
  try {
    const url = new URL(normalizeUrl(value));
    const placeId = url.searchParams.get("placeid");
    if (placeId && isPlaceId(placeId)) {
      return placeId;
    }
  } catch {
    return null;
  }
  return null;
}

export function isPlaceId(value: string): boolean {
  const trimmed = value.trim();
  return PLACE_ID_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function isGPageShortCode(value: string): boolean {
  return extractGPageCode(value) !== null;
}

export function isValidGoogleReviewInput(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return /writereview|g\.page\/r\/|maps\.app\.goo\.gl|google\.com\/maps/i.test(
      trimmed
    );
  }

  if (/writereview|g\.page\/r\/|maps\.app\.goo\.gl|google\.com\/maps/i.test(trimmed)) {
    return true;
  }

  if (isGPageShortCode(trimmed) || isPlaceId(trimmed)) {
    return true;
  }

  const fromQuery = extractPlaceIdFromUrl(trimmed);
  if (fromQuery) {
    return true;
  }

  return trimmed.length >= 10 && !/\s/.test(trimmed) && !trimmed.startsWith("0x");
}

export function getGoogleReviewUrl(input: string): string {
  const trimmed = input.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (/g\.page\/r\//i.test(trimmed)) {
    const code = extractGPageCode(trimmed);
    if (code) {
      return `https://g.page/r/${code}/review`;
    }
    return normalizeUrl(trimmed);
  }

  const gPageCode = extractGPageCode(trimmed);
  if (gPageCode) {
    return `https://g.page/r/${gPageCode}/review`;
  }

  if (/maps\.app\.goo\.gl|google\.com\/maps/i.test(trimmed)) {
    return normalizeUrl(trimmed);
  }

  const placeIdFromQuery = extractPlaceIdFromUrl(trimmed);
  const placeId = placeIdFromQuery ?? trimmed;

  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export const GOOGLE_REVIEW_INPUT_ERROR =
  "Paste your Google review link (g.page/r/.../review), a g.page short code (CUv_...), or a Place ID (ChIJ...) from Google's Place ID Finder.";
