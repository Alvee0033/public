// "use client";

// import CourseList from "@/components/shared/CourseList";
// import DataPagination from "@/components/shared/DataPagination";
// import PageTitle from "@/components/shared/pageTitle";
// import ProductCard from "@/components/shared/products/ProductCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { useState } from "react";
// import useSWR from "swr";

// function ZoneHubPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 6; // Show fewer courses for this section

//   const getCourses = async () => {
//     const skip = (currentPage - 1) * pageSize;
//     const queryString = new URLSearchParams({
//       pagination: true,
//       limit: pageSize,
//       skip,
//     }).toString();
//     const res = await axios.get(`/courses?${queryString}`);
//     return res?.data;
//   };

//   const { data: coursesData, isLoading } = useSWR(["learning-hub-courses", currentPage], getCourses, { keepPreviousData: true });
//   const courses = coursesData?.data || [];
//   const totalItems = coursesData?.pagination?.total || 0;

//   return (
//     <>
//       <PageTitle title={<span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Learning Hub List</span>} path="Learning Hub List" />
//       <div className="container mx-auto px-4">
//         <div className="flex justify-center items-center w-full">
//           <div className="flex flex-row gap-4 w-full max-w-xl">
//             <Input
//               type="text"
//               placeholder="Zip Code"
//               className="flex-1"
//               name="zipCode"
//               autoComplete="postal-code"
//             />
//             <Input
//               type="text"
//               placeholder="Country"
//               className="flex-1"
//               name="country"
//               autoComplete="country"
//             />
//             <Button type="submit" className="md:w-auto w-full">
//               Search
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col items-center justify-center mt-12 w-full">
//         <h2 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold leading-18 md:leading-15 lg:leading-18 mb-4 text-center bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//           Learning Hub Courses
//         </h2>
//         <p className="text-lg text-gray-600 text-center mb-8">Brooklyn - courses</p>
//         <div className="w-full max-w-6xl">
//           <CourseList
//             courses={courses}
//             isLoading={isLoading}
//             currentPage={currentPage}
//             totalItems={totalItems}
//             pageSize={pageSize}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//       {/* Learning Hub Products Section */}
//       <div className="flex flex-col items-center justify-center mt-16 w-full">
//         <h2 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold leading-18 md:leading-15 lg:leading-18 mb-4 text-center bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//           Learning Hub Products
//         </h2>
//         <div className="w-full flex justify-center">
//           <div className="w-full max-w-7xl">
//             <ZoneProductList />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // Add ZoneProductList component to fetch and display products
// function ZoneProductList() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 3;
//   const [totalItems, setTotalItems] = useState(0);


//   const skip = (currentPage - 1) * pageSize;
//   const { data, isLoading, error } = useSWR(['products'], async () => {
//     const res = await axios.get(`/products?pagination=true&limit=${pageSize}&skip=${skip}`)
//     return res.data;
//   })

//   const handleCurrentProduct = () => { };

//   if (isLoading) return <div className="text-center py-8">Loading products...</div>;
//   if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {data?.data?.map(product => (
//           <ProductCard key={product.id} product={product} handleCurrentProduct={handleCurrentProduct} />
//         ))}
//       </div>
//       {/* Only show pagination if there are products */}
//       {data?.total > pageSize && (
//         <div className="pb-12">
//           <DataPagination
//             currentPage={currentPage}
//             totalItems={data?.total}
//             pageSize={pageSize}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </>
//   );
// }

// export default ZoneHubPage;