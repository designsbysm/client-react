import "../styles/components/footer.scss";
import React from "react";

const Footer = ({ title, version }) => {
  return (
    <footer>
      <div className="credits">
        <span>{title}</span> <span>v{version}</span>
      </div>
    </footer>
  );
};

export default Footer;
