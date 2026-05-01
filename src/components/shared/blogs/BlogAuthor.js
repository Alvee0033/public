import blogImag10 from "@/assets/images/blog/blog_10.png";
import Image from "next/image";
import Link from "next/link";

const BlogAuthor = () => {
  return (
    <div className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2  text-center">
      {/* athor avatar */}
      <div className="mb-30px flex justify-center">
        <Image src={blogImag10} alt="" className="w-24 h-24 rounded-full" />
      </div>
      {/* author name */}
      <div className="mb-3">
        <h3 className="mb-7px">
          <Link
            href="/instructors/2"
            className="text-xl font-bold text-blackColor2 "
          >
            Rosalina D. Willaim
          </Link>
        </h3>
        <p className="text-xs text-contentColor2 ">Blogger/Photographer</p>
      </div>
      {/* description */}
      <p className="text-sm text-contentColor  mb-15px">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.Veritatis
        distinctio suscipit reprehenderit atque
      </p>
      {/* social */}
      <div>
        <ul className="flex gap-10px justify-center items-center">
          <li>
            <a
              href="https://www.facebook.com/"
              className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor     rounded"
            >
              <i className="icofont-facebook"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/"
              className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor     rounded"
            >
              <i className="icofont-youtube-play"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/"
              className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor     rounded"
            >
              <i className="icofont-instagram"></i>
            </a>
          </li>
          <li>
            <a
              href="https://x.com/"
              className="w-35px h-35px leading-35px text-center border border-borderColor2 text-contentColor hover:text-whiteColor hover:bg-primaryColor     rounded"
            >
              <i className="icofont-twitter"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlogAuthor;
