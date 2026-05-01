const BlogSearch = () => {
  return (
    <div className="p-5 md:p-30px lg:p-5 2xl:p-30px mb-30px border border-borderColor2 ">
      <h4 className="text-size-22 text-blackColor  font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Search here
      </h4>
      <form className="w-full px-4 py-15px text-sm text-contentColor bg-lightGrey10   flex justify-center items-center leading-26px">
        <input
          type="text"
          placeholder="Search Produce"
          className="placeholder:text-placeholder bg-transparent focus:outline-none placeholder:opacity-80 w-full"
        />
        <button type="submit">
          <i className="icofont-search-1 text-base"></i>
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;
