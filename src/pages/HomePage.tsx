import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page__header">Home Page</header>
      <br />
      <br />

      <Link className="page-link" to={"/currency-input-examples"}>
        Currency Input
      </Link>

      <Link className="page-link" to={"/phone-number-input-examples"}>
        Phone Number Input
      </Link>
    </div>
  );
}
