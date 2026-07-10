export type GoogleReview = {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
};

export type PlaceDetails = {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  url: string;
};

const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
const PLACE_NAME = "Stickerverse USA";

async function findPlaceId(): Promise<string | null> {
  if (!API_KEY) return null;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(PLACE_NAME)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  const data = await res.json();
  return data.candidates?.[0]?.place_id ?? null;
}

export async function getGoogleReviews(): Promise<PlaceDetails | null> {
  if (!API_KEY) return null;
  try {
    const placeId = await findPlaceId();
    if (!placeId) return null;
    const base = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
    // The Places API caps every request at 5 reviews, and some of those may be
    // rating-only (no text). Fetching both sort orders yields two mostly
    // distinct sets, so after merging there are enough text reviews to fill
    // the 6-card grid.
    const [newestRes, relevantRes] = await Promise.all([
      fetch(`${base}&fields=name,rating,user_ratings_total,reviews,url&reviews_sort=newest`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${base}&fields=reviews`, { next: { revalidate: 3600 } }),
    ]);
    const newest = await newestRes.json();
    if (newest.status !== "OK") return null;
    const result = newest.result as PlaceDetails;

    const merged: GoogleReview[] = [...(result.reviews ?? [])];
    const relevant = await relevantRes.json().catch(() => null);
    for (const review of (relevant?.result?.reviews ?? []) as GoogleReview[]) {
      const isDuplicate = merged.some(
        (r) => r.author_name === review.author_name && r.time === review.time
      );
      if (!isDuplicate) merged.push(review);
    }
    merged.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));

    return { ...result, reviews: merged };
  } catch {
    return null;
  }
}
