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

const BUCKET = "listing-images";

// Shrink a photo to at most 1600px on its longest side, as a JPEG
async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not process photo")),
      "image/jpeg",
      0.82,
    );
  });
}

export async function submitListing(listing) {
  // 1. upload the photos
  const paths = [];
  for (const file of listing.images) {
    const blob = await compressImage(file);
    const path = `submissions/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: "image/jpeg" });
    if (error) throw error;
    paths.push(path);
  }

  // 2. save the listing as a pending submission
  const { error } = await supabase.from("submissions").insert({
    product_name: listing.productName,
    category: listing.category,
    description: listing.description,
    price_from: listing.priceFrom,
    price_to: listing.priceTo,
    availability: listing.availability,
    dimensions: listing.dimensions,
    materials: listing.materials,
    colours: listing.colours,
    business_name: listing.businessName,
    location: listing.location,
    phone: listing.phone,
    whatsapp: listing.whatsapp,
    image_paths: paths,
  });
  if (error) throw error;
}
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("slug, label, image, sort_order")
    .order("sort_order")
    .order("label");

  if (error) throw error;

  // keep the same field names the components already use
  return data.map((c) => ({ value: c.slug, label: c.label, image: c.image }));
}
