import { useState } from "react";
import { supabase } from "../supabaseClient";

function imageUrl(file, folder) {
  if (file.includes("/")) {
    return supabase.storage.from("listing-images").getPublicUrl(file).data
      .publicUrl;
  }
  return `/images/${folder}/${file}`;
}

function ProductImage({ file, alt, className = "", folder = "products" }) {
  const [failed, setFailed] = useState(!file);

  if (failed) {
    return (
      <div
        className={`img-placeholder ${className}`}
        role="img"
        aria-label={alt}
      >
        <span>Photo coming soon</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl(file, folder)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default ProductImage;
