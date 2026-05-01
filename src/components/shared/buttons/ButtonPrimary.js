"use client";
import Link from "next/link";

const ButtonPrimary = ({
  children,
  color,
  type,
  path,
  arrow,
  width,
  size = "md",
  onClick,
  disabled,
}) => {
  const sizeClasses = {
    sm: "text-size-12 px-15px py-1",
    md: "text-size-15 px-25px py-10px",
    lg: "text-size-18 px-35px py-15px",
  };

  const buttonClassNames = `text-whiteColor border hover:bg-whiteColor inline-flex items-center rounded   ${
    width === "full" ? "w-full" : ""
  } ${
    color === "secondary"
      ? "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
      : color === "danger"
      ? "bg-red-500 border-red-500 hover:text-red-500"
      : "bg-primaryColor border-primaryColor hover:text-primaryColor"
  } ${sizeClasses[size]}`;

  if (type === "button" || type === "submit") {
    return (
      <button
        disabled={disabled}
        type={type === "submit" ? "submit" : "button"}
        onClick={onClick ? onClick : () => {}}
        className={buttonClassNames}
      >
        {children} {arrow && <i className="icofont-long-arrow-right"></i>}
      </button>
    );
  }

  return (
    <Link href={path} className={buttonClassNames}>
      {children} {arrow && <i className="icofont-long-arrow-right"></i>}
    </Link>
  );
};

export default ButtonPrimary;
