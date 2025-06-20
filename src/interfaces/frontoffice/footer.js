const Footer = () => {
  return (
    <footer className="footer flex flex-col sm:flex-row items-center justify-between bg-[#4D1C87] text-white p-10">
      <nav className="flex flex-col items-center sm:items-start">
        <h6 className="footer-title mb-2">Services</h6>
        <a href="/branding" className="link link-hover text-sm">
          Branding
        </a>
        <a href="/design" className="link link-hover text-sm">
          Design
        </a>
        <a href="/marketing" className="link link-hover text-sm">
          Marketing
        </a>
      </nav>
      <nav className="flex flex-col items-center sm:items-start">
        <h6 className="footer-title mb-2">Company</h6>
        <a href="/about" className="link link-hover text-sm">
          About us
        </a>
        <a href="/contact" className="link link-hover text-sm">
          Contact
        </a>
      </nav>
      <nav className="flex flex-col items-center sm:items-start">
        <h6 className="footer-title mb-2">Legal</h6>
        <a href="/privacy" className="link link-hover text-sm">
          Privacy policy
        </a>
        <a href="/terms" className="link link-hover text-sm">
          Terms of use
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
