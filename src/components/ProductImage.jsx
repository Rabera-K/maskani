import { useState } from "react";

function ProductImage({ file, alt, className = "" }) {
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
      src={`/images/products/${file}`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default ProductImage;
