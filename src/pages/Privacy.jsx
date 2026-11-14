import "./Legal.css";

function Privacy() {
  return (
    <div className="legal">
      <h1>Privacy Policy</h1>
      <p className="legal-date">Last updated: [14th November, 2026]</p>

      <p>
        Maskani is a website that helps people find furniture and décor from
        local Kenyan suppliers and contact them directly. This page explains
        what personal information we collect, why, and what your rights are. It
        follows Kenya’s Data Protection Act, 2019.
      </p>

      <h2>Who we are</h2>
      <p>
        Maskani is run by [Maskani living]. You can reach us at
        [maskaniliving@gmail.com] about anything on this page.
      </p>

      <h2>What we collect and why</h2>

      <h3>If you are a supplier and submit a listing</h3>
      <p>
        We collect your business name, location, phone number, optional WhatsApp
        number, and the details and photos of the product you submit. We use
        them to review your listing, to contact you about it, and, once
        approved, to publish it.{" "}
        <strong>
          Your business name, location, phone and WhatsApp numbers and product
          details are shown publicly
        </strong>{" "}
        so buyers can contact you. We also keep a record of when you agreed to
        this.
      </p>

      <h3>If you are a buyer browsing the site</h3>
      <p>
        You don’t need an account, and we don’t ask for your name or contact
        details. Your conversation with a supplier happens on WhatsApp or by
        phone, outside Maskani, and is between you and them.
      </p>

      <h3>If you send us feedback</h3>
      <p>
        If you use the feedback form, we store your message, whether you are a
        buyer or supplier, your answer to the optional question, the page you
        were on, and your contact details only if you choose to give them. We
        use this to improve Maskani and to reply if you asked us to.
      </p>

      <h3>Your enquiry list</h3>
      <p>
        Products you save are stored in your own browser, on your device. We
        don’t receive that list. Clearing your browser data removes it.
      </p>

      <h2>Cookies and similar storage</h2>
      <p>
        Maskani does not use advertising or tracking cookies. We use your
        browser’s storage only to remember your enquiry list and, for our
        administrator, to keep a login session.
      </p>

      <h2>Who we share information with</h2>
      <p>
        Public listing details are visible to everyone who visits the site. We
        use the following services to run Maskani, and they handle data on our
        behalf: Supabase (database and image storage, servers in [Ireland]) and
        Netlify (website hosting). We don’t sell personal information.
      </p>
      <p>
        Because these services are based outside Kenya, your information may be
        stored or processed outside Kenya.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Listing details stay while your listing is live. If you ask us to remove
        your listing, we delete it and its photos. Submissions we reject are
        deleted after [60 days].
      </p>

      <h2>Your rights</h2>
      <p>
        Under the Data Protection Act you can ask to see the personal
        information we hold about you, correct it, object to how we use it, or
        have it deleted. To do any of these, contact us at
        [maskaniliving@gmail.com] and we will respond within a reasonable time.
      </p>
      <p>
        If you believe we have mishandled your information, you can complain to
        the Office of the Data Protection Commissioner (ODPC) in Kenya.
      </p>

      <h2>Children</h2>
      <p>
        Maskani is not aimed at children, and we don’t knowingly collect their
        information.
      </p>

      <h2>Changes to this page</h2>
      <p>
        If we change this policy, we will update the date at the top. If a
        change affects how we use your information, we will tell suppliers who
        have listed products.
      </p>
    </div>
  );
}

export default Privacy;
