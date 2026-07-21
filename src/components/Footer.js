import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

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
          <FaGithub size={18} />
        </a>
        <a
          href="https://linkedin.com/in/sixtus-nwaogu/"
          title="linkedin link"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin size={18} />
        </a>
        <a
          href="https://wa.me/2347031520147"
          title="whatsapp link"
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp size={18} />
        </a>
        <a
          href="https://www.instagram.com/6two_s55/"
          title="instagram link"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram size={18} />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
