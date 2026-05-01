const BlogContactForm = () => {
  return (
    <div className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 ">
      <h4 className="text-size-22 text-blackColor  font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Get in Touch
      </h4>
      <form className="space-y-5">
        <input
          type="text"
          placeholder="Enter Name*"
          className="w-full text-contentColor leading-7 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b border-borderColor2  "
        />
        <input
          type="email"
          placeholder="Enter your mail*"
          className="w-full text-contentColor leading-7 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b border-borderColor2  "
        />
        <input
          type="text"
          placeholder="Message*"
          className="w-full text-contentColor leading-7 pb-10px bg-transparent focus:outline-none placeholder:text-placeholder placeholder:opacity-80 border-b border-borderColor2  "
        />
        <button
          type="submit"
          className="text-size-15 text-whiteColor uppercase bg-primaryColor border border-primaryColor px-55px py-13px hover:text-primaryColor hover:bg-whiteColor rounded inline-block  "
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default BlogContactForm;
