import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const ContactFrom = () => {
  return (
    <section>
      <div className="container pb-100px">
        <form className="p-5 md:p-70px md:pt-90px border border-borderColor2">
          {/* heading  */}
          <div className="mb-10">
            <h4 className="text-size-23 md:text-size-44 font-bold leading-10 md:leading-70px text-blackColor ">
              Drop Us a Line
            </h4>
            <p className="text-size-13 md:text-base leading-5 md:leading-30px text-contentColor ">
              Your email address will not be published. Required fields are
              marked *
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 mb-30px gap-30px">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your name*"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor  border border-borderColor2  placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-businessman"></i>
              </div>
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Address*"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor  border border-borderColor2  placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-envelope"></i>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Write Service Type"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor  border border-borderColor2  placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-edit"></i>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Your Phone"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor  border border-borderColor2  placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
              />

              <div className="text-xl leading-23px text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-ui-call"></i>
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="Enter your Massage here"
              className="w-full pl-26px bg-transparent text-contentColor  border border-borderColor2  placeholder:text-placeholder placeholder:opacity-80 rounded"
              cols="30"
              rows="10"
            />
            <div className="text-xl leading-23px text-primaryColor absolute right-6 top-[17px]">
              <i className="icofont-pen-alt-2"></i>
            </div>
          </div>

          <div className="mt-30px">
            <ButtonPrimary type={"submit"}>Post a Comment</ButtonPrimary>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactFrom;
