import { Link } from "react-router-dom";
import "../styles/pages/HomePage.css";
function HomePage() {
  return (
    <>
      <section className="hero">
        <p>New collection</p>
        <h1>Style made for you</h1>
        <p>
          Discover women’s clothing designed for everyday confidence.
        </p>

        <Link to="/products">Shop the collection</Link>
      </section>
    </>
  );
}

export default HomePage;