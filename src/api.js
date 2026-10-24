export async function submitListing(listing) {
  // TEMPORARY: nothing is saved anywhere yet.
  // In the backend phase, this will send the listing to the database.
  console.log("Submission (not saved anywhere yet):", listing);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true };
}
