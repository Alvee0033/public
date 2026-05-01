const BlogSocials = () => {
  return (
    <div className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 ">
      <h4 className="text-size-22 text-blackColor  font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Follow Us
      </h4>
      <div>
        <ul className="flex gap-10px items-center">
          {[
            { url: "https://www.facebook.com/", icon: "facebook" },
            { url: "https://www.youtube.com/", icon: "youtube-play" },
            { url: "https://www.instagram.com/", icon: "instagram" },
            { url: "https://x.com/", icon: "twitter" },
            { url: "https://www.linkedin.com/", icon: "linkedin" },
          ].map(({ url, icon }) => (
            <li key={icon}>
              <a
                href={url}
                className="w-38px h-38px leading-38px text-center text-blackColor2 bg-whitegrey2 hover:text-whiteColor hover:bg-primaryColor rounded"
              >
                <i className={`icofont-${icon}`}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogSocials;
