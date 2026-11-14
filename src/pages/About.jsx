import { Link } from "react-router-dom";
import "./Legal.css";

function About() {
  return (
    <div className="legal">
      <h1>About Maskani</h1>

      <p>
        Finding furniture and décor in Kenya usually means scrolling social
        media, searching Google, and visiting shops, with prices and
        availability scattered across all of them. Finding something that fits
        your style and your budget takes far more time than it should.
      </p>
      <p>
        Maskani brings local suppliers, shops and craftspeople into one
        catalogue you can search and filter by category and budget, so you can
        compare options and contact the supplier directly.
      </p>

      <h2>How it works</h2>
      <ul>
        <li>
          <strong>Browse or search</strong> by item, category or the amount you
          want to spend.
        </li>
        <li>
          <strong>Compare</strong> prices, materials and availability in one
          place.
        </li>
        <li>
          <strong>Contact the supplier directly</strong> by phone or WhatsApp to
          confirm details and arrange your purchase.
        </li>
      </ul>
      <p>
        Maskani is a discovery platform, not a shop. We don’t take payments or
        deliver, so the purchase is always between you and the supplier.
      </p>

      <h2>How we build trust</h2>
      <p>
        Every listing is checked by our team before it is published. Suppliers
        who pass all three of our checks (phone number confirmed, premises
        visited, and customer reviews received) get a{" "}
        <strong>Verified supplier</strong> label. If a supplier hasn’t been
        verified yet, we tell you plainly, and we show “price on request”
        instead of guessing a price.
      </p>

      <h2>For suppliers and makers</h2>
      <p>
        If you sell or make furniture or décor, you can{" "}
        <Link to="/submit">submit your products</Link>. Our team reviews each
        submission before it appears.
      </p>

      <h2>Who is behind Maskani</h2>
      <p>
        My name is Rosemary Rabera, an interior designer and interior design
        educator at Ikigai College of Interior Design. Through my experience in
        the industry, I've come to appreciate how challenging it can be to find
        the right furniture and home décor, especially when balancing personal
        taste, quality and budget. I started Maskani to make discovering locally
        available interior products easier, bringing inspiration, products and
        local suppliers together in one place.
      </p>

      <h2>Get in touch</h2>
      <p>[maskaniliving@gmail.com] · [07xxxxxxxx]</p>
    </div>
  );
}

export default About;
