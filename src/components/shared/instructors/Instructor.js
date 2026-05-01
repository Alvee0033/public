import Image from "next/image";
import Link from "next/link";

const Instructor = ({ instructor }) => {
  const { name, image, desig, id } = instructor;
  return (
    <div>
      <div className="mb-5 relative group">
        <Image src={image} alt="" className="w-full" />
        {/* social icons */}
        <div className="absolute transition-all duration-300 right-0 top-5 opacity-0 group-hover:opacity-100 group-hover:right-5">
          <ul className="flex flex-col gap-10px">
            <li>
              <Link
                href="#"
                className="w-41px h-41px leading-41px bg-whiteColor text-darkdeep4 hover:bg-primaryColor hover:text-whiteColor    text-base rounded text-center"
              >
                <i className="icofont-facebook"></i>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="w-41px h-41px leading-41px bg-whiteColor text-darkdeep4 hover:bg-primaryColor hover:text-whiteColor    text-base rounded text-center"
              >
                <i className="icofont-twitter"></i>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="w-41px h-41px leading-41px bg-whiteColor text-darkdeep4 hover:bg-primaryColor hover:text-whiteColor    text-base rounded text-center"
              >
                <i className="icofont-instagram"></i>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="w-41px h-41px leading-41px bg-whiteColor text-darkdeep4 hover:bg-primaryColor hover:text-whiteColor    text-base rounded text-center"
              >
                <i className="icofont-youtube-play"></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p className="text-base text-contentColor  uppercase mb-1">{desig}</p>
        <h5>
          <Link
            href={`instructors/${id}`}
            className="text-2xl font-semibold text-contentColor  hover:text-primaryColor  mb-15px"
          >
            {name}
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default Instructor;
