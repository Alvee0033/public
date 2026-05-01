import Link from "next/link";

const FooterNavList = () => {
  const navItems = [
    {
      title: "Company",
      links: [
        { href: "/about-us", label: "About Us" },
        { href: "/cookie-policy", label: "Cookie Policy" },
        { href: "/terms-of-use", label: "Terms of Use" },
        { href: "/children-privacy-policy", label: "Children Privacy Policy" },
        { href: "/partnership-program", label: "Partnership Program" },
        { href: "/register", label: "Join ScholarPASS" },
      ],
    },
    {
      title: "Product & Services",
      links: [
        { href: "/learning-art", label: "LearningART" },
        { href: "/learninghub/zone-list", label: "Learning Hub List" },
        { href: "/courses", label: "Courses" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 py-8 lg:py-12">
        {navItems.map((item, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <ul className="space-y-2 lg:space-y-3">
              {item.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-all duration-300 hover:translate-x-1 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterNavList;
