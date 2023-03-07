import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container">
      <Link to="/" className="logo-font">
        Overcloud
      </Link>
      <span className="attribution">
        An interactive learning project from{" "}
        <a href="https://overcloud.io">Overcloud</a>..
      </span>

    </div>
  );
}

export default Footer;
