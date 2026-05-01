import Link from "next/link";
const PageTitle = ({ title, path }) => {
    return (
        <section>
            {/* banner section  */}
            <div className="bg-lightGrey10  relative z-0 overflow-y-visible py-10 md:py-12 lg:py-14">
                <div className="container">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold  leading-18 md:leading-15 lg:leading-18">
                            {title}
                        </h1>
                        <ul className="flex gap-1 justify-center  ">
                            <li>
                                <Link href="/" className="text-lg hover:text-primaryColor">
                                    Home <i className="icofont-simple-right"></i>
                                </Link>
                            </li>
                            <li>
                                <span className="text-lg mr-1.5">{path}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageTitle;
