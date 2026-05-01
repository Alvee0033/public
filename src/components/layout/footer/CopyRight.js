import logo from "@/assets/icons/admin_logo.png";
import Image from "next/image";
import Link from "next/link";

const CopyRight = () => {
  const socialLinks = [
    {
      href: "https://www.facebook.com/tutorsplans",
      icon: "icofont-facebook",
      label: "Facebook",
    },
    {
      href: "https://x.com/X337489576498",
      icon: "icofont-twitter",
      label: "Twitter",
    },
    {
      href: "https://www.linkedin.com/company/tutorsplan/",
      icon: "icofont-linkedin",
      label: "LinkedIn",
    },
  ];

  return (
    <div className="bg-brand text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 py-6 lg:py-3 items-center">
          {/* Logo Section */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image src={logo} alt="ScholarPASS Logo" width={30} height={30} />
              <span className="text-lg sm:text-xl font-bold">ScholarPASS</span>
            </Link>
          </div>

          {/* Copyright Text */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <p className="text-sm sm:text-base text-white/90">
              Copyright © <span className="font-medium">2024</span> by
              ScholarPASS. All Rights Reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <ul className="flex gap-2 sm:gap-3">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-brand rounded transition-all duration-300 hover:scale-110"
                    aria-label={link.label}
                  >
                    <i className={`${link.icon} text-sm sm:text-base`}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
