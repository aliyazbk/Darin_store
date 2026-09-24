function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {currentYear} Darin Store. All rights reserved.</p>
      <p>Cash on delivery available.</p>
    </footer>
  );
}

export default Footer;