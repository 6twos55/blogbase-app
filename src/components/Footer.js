import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="copyright">&copy;BlogBase 2023. All Rights Reserved.</p>
      <p>Built with MERN and Sass.</p>
      <p className="icons">
        <a
          href="https://github.com/6twos55"
          title="github link"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://linkedin.com/in/sixtus-nwaogu-654005240/"
          title="linkedin link"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://x.com/6two_s55"
          title="twitter link"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://www.instagram.com/6two_s55/"
          title="instagram link"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram size={24} />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
