import useIsSecondary from "@/hooks/useIsSecondary";

const FooterTop = () => {
  const { isSecondary } = useIsSecondary();

  return (
    <section className=" bg-sky-">
      <div
        className={`grid container pt-10 grid-cols-1 md:grid-cols-2 md:gap-y-0 items-center pb-45px border-b border-gray-200`}
      >
        <div>
          <h4 className="text-4xl md:text-size-25 lg:text-size-40 font-bold text- leading-50px md:leading-10 lg:leading-16">
            Still You Need Our <span className="text-brand">Support</span> ?
          </h4>
          <p className="text- text-opacity-65">
            Don’t wait make a smart & logical quote here. Its pretty easy.
          </p>
        </div>
        <div>
          <form className="max-w-form-xl md:max-w-form-md lg:max-w-form-lg xl:max-w-form-xl 2xl:max-w-form-2xl bg-white ml-auto rounded relative">
            <input
              type="email"
              placeholder="Enter your email here"
              className="h-62px pl-15px focus:outline-none border border-deepgray focus:border-whitegrey bg-transparent rounded w-full"
            />
            <button
              type="submit"
              className="px-3 md:px-10px lg:px-5 bg-deepgray hover:bg-deepgray/90 text-xs lg:text-size-15 text-white block rounded absolute right-0 top-0 h-full"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FooterTop;
