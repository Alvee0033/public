"use client";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import { CircleArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];

const filters = [
  {
    id: "langugage",
    name: "Language",
    options: [
      { value: "English", label: "English", checked: false },
      { value: "Bangla", label: "Bangla", checked: false },
      { value: "Arabic", label: "Arabic", checked: true },
      { value: "Spanish", label: "Spanish", checked: false },
      { value: "Hindi", label: "Hindi", checked: false },
      { value: "Portugues", label: "Portugues", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "type",
    name: "Type",
    options: [
      { value: "Free", label: "Free", checked: false },
      { value: "Paid", label: "Paid", checked: false },
      { value: "Subscription", label: "Subscription", checked: false },

    ],
  },
];

import { categories, tutors } from "@/_data/dummy";
import {
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
export default function AllMentor() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    color: false,
    category: false,
    size: false,
  });

  const [Sort, setSort] = useState(false);

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // State to hold the sort
  const handleSort = () => {
    setSort(!Sort);
  };

  const toggleSection = (sectionId) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const toggleFilterOption = (sectionId, optionIdx) => {
    const updatedFilters = filters.map((section) => {
      if (section.id === sectionId) {
        const updatedOptions = section.options.map((option, idx) => {
          if (idx === optionIdx) {
            return {
              ...option,
              checked: !option.checked,
            };
          }
          return option;
        });
        return {
          ...section,
          options: updatedOptions,
        };
      }
      return section;
    });
    // Update the state with the new filters
    setFiltersState(updatedFilters);
  };

  const [userData, setUserData] = useState(tutors);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const formdata = new FormData();
  //       formdata.set("page", currentPage);
  //       formdata.set("pagination", 6);
  //       formdata.set("role", "instructor");
  //       const res = await fetch("/api/user", {
  //         cache: "no-store",
  //         method: "POST",
  //         body: formdata,
  //       });

  //       const data = await res.json();
  //       setUserData(data.data);
  //       setTotalPages(Math.ceil(data.total / 5));
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, [currentPage]);



  const [catagoryData, setCatagoryData] = useState(categories);

  // useEffect(() => {
  //   const getCategory = async () => {
  //     try {
  //       const formdata = new FormData();
  //       formdata.set("page", 1);
  //       formdata.set("pagination", 5);
  //       const res = await fetch("api/category", {
  //         method: "POST",
  //         body: formdata,

  //       });

  //       const data = await res.json();
  //       setCatagoryData(data.data);
  //     } catch (error) {
  //       console.error("Error fetching category data:", error);
  //     }
  //   };

  //   getCategory();
  // }, []);

  return (
    <div className="">
      <div className="relative">
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
        )}

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Tutors
            </h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    onClick={handleSort}
                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sort
                    <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  </button>
                </div>
                {Sort && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <a
                          key={option.name}
                          href={option.href}
                          className={`block px-4 py-2 text-sm ${option.current
                            ? "font-medium text-gray-900"
                            : "text-gray-500"
                            }`}
                        >
                          {option.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={toggleMobileFilters}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {catagoryData.map((category) => (
                    <li key={category.categoryName}>
                      <button >{category.categoryName}</button>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <div
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center justify-between bg-white p-3 text-sm text-gray-400 hover:text-gray-500"
                      >
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          {openSections[section.id] ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </h3>
                    {openSections[section.id] && (
                      <div className="pt-6 pl-2">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                value={option.value}
                                type="checkbox"
                                checked={option.checked}
                                onChange={() =>
                                  toggleFilterOption(section.id, optionIdx)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* grid course compnant here */}
                <section
                  id="Projects"
                  className=" mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-6 mt-10 mb-5"
                >
                  {userData?.map(m => {
                    return <Link key={m?._id} href={`/tutors/${m.name.split(" ").join("-").toLowerCase()}`} >

                      <div className="mentor-card cursor-pointer max-w-sm mx-auto py-4 px-2  rounded-lg hover:scale-110 transition-all duration-500 ">
                        <div className="mentor-photo w-full ">
                          <Image
                            className="w-40 center rounded-sm  h-40 object-cover"
                            src={m?.image || "https://res.cloudinary.com/dsy2erizv/image/upload/v1732273290/msiqmhpsowwbpt26eigr.png"}
                            height={100}
                            width={100}
                            alt="Profile Image"
                          />
                        </div>
                        <div className="px-6 py-4 text-center">
                          <div className=" font-sans font-semibold truncate text-gray-800" >{m.name}</div>
                          <p className="text-gray-600 text-xs mt-1  ">{m.profession ?? "Profession"}</p>
                        </div>
                        <div className="px-4  text-center">
                          <span className="inline-block px-2 text-xs py-1 font-semibold text-teal-900 bg-gray-100 rounded-full">
                            Web
                          </span>
                          <span className="inline-block px-2 py-1 ml-1 text-xs font-semibold text-teal-900 bg-gray-100  rounded-full">
                            UI/UX
                          </span>
                          <span className="inline-block px-2 py-1 ml-1 text-xs font-semibold text-teal-900  bg-gray-100 rounded-full">
                            Design
                          </span>
                        </div>
                        <div className="view-main px-2 py-2">
                          <p className="view-icon bg-purple-400">
                            <CircleArrowRight />
                          </p>
                        </div>
                      </div>
                    </Link>
                  })}

                </section>

                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
                    <strong>{(currentPage - 1) * 5 + 5}</strong> Course
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages).keys()].map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={() => setCurrentPage(page + 1)}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>


              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
