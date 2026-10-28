import { supabase } from "./supabaseClient";

// Turn a database row into the shape our components already use
function toProduct(row) {
  const s = row.supplier;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    priceFrom: row.price_from,
    priceTo: row.price_to,
    images: row.images,
    availability: row.availability,
    dimensions: row.dimensions,
    materials: row.materials,
    colours: row.colours,
    featured: row.featured,
    location: s.location,
    supplier: {
      id: s.id,
      name: s.name,
      location: s.location,
      phone: s.phone,
      whatsapp: s.whatsapp,
      summary: s.summary,
      verified: s.verified,
      checks: {
        phoneConfirmed: s.phone_confirmed,
        premisesVisited: s.premises_visited,
        customerReviews: s.customer_reviews,
      },
    },
  };
}

export async function fetchApprovedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, supplier:suppliers(*)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .order("name");

  if (error) throw error;
  return data.map(toProduct);
}

export async function submitListing(listing) {
  // STILL TEMPORARY: connected to the database in the next step
  console.log("Submission (not saved anywhere yet):", listing);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true };
}
