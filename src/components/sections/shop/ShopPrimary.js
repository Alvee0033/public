"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Columns3,
  Columns4,
  Filter,
  Search,
  MapPin,
  Globe,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Star,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const ShopPrimary = () => {
  const [stores, setStores] = useState([]);
  const [currentStores, setCurrentStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState(3); // 2, 3, or 4 columns
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStoreType, setFilterStoreType] = useState("all");
  const router = useRouter();

  const storesPerPage = 12;

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/stores");
        const fetchedStores = response.data.data || [];
        setStores(fetchedStores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Apply filters, sorting, and pagination
  useEffect(() => {
    let filteredStores = [...stores];

    if (searchQuery) {
      filteredStores = filteredStores.filter((store) =>
        store.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStoreType !== "all") {
      filteredStores = filteredStores.filter(
        (store) =>
          store.physical_store_or_online_store ===
          (filterStoreType === "physical")
      );
    }

    switch (sortOption) {
      case "rating-high":
        filteredStores.sort((a, b) => b.rating_score - a.rating_score);
        break;
      case "rating-low":
        filteredStores.sort((a, b) => a.rating_score - b.rating_score);
        break;
      case "name-asc":
        filteredStores.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredStores.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filteredStores.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    const startIndex = (currentPage - 1) * storesPerPage;
    const paginatedStores = filteredStores.slice(
      startIndex,
      startIndex + storesPerPage
    );

    setCurrentStores(paginatedStores);

    if (currentPage !== 1 && paginatedStores.length === 0) {
      setCurrentPage(1);
    }
  }, [stores, currentPage, sortOption, searchQuery, filterStoreType]);

  const totalPages = Math.ceil(stores.length / storesPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  const storeTypes = [
    { id: "all", name: "All Stores" },
    { id: "physical", name: "Physical Stores" },
    { id: "online", name: "Online Stores" },
  ];

  // Store Card Component
  const StoreCard = ({ store }) => {
    const handleCardClick = () => {
      router.push(`/store/${store.id}`);
    };

    return (
      <div
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full cursor-pointer"
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`View store ${store.name}`}
      >
        <div className="relative">
          <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-500">
                  {store.name?.charAt(0) || "S"}
                </span>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {store.verified && (
              <Badge
                variant="outline"
                className="bg-white border-green-400 text-green-700 flex items-center gap-1 px-2 py-1"
              >
                <CheckCircle2 className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-xl text-gray-800">{store.name}</h3>
            <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
              <span>{store.rating_score}/5</span>
            </div>
          </div>
          {store.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{store.address}</span>
            </div>
          )}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {store.description}
          </p>
          {store.year_of_establishment && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Calendar className="h-3 w-3" />
              <span>Est. {store.year_of_establishment}</span>
            </div>
          )}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              {store.facebook && (
                <a
                  href={store.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {store.instagram && (
                <a
                  href={store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {store.website && (
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="text-gray-600 hover:text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="text-gray-600 hover:text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
            </div>
            <Link href={`/store/${store.id}`} onClick={(e) => e.stopPropagation()}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                View Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Explore Our Stores
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of stores offering quality products and
            services. Browse, compare, and find the perfect store for your
            needs.
          </p>
        </div>

        {/* Shop Header with Search, Filters, and Grid View */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="w-full lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stores..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter Stores</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Store Types</h3>
                    <div className="space-y-2">
                      {storeTypes.map((type) => (
                        <div key={type.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`store-type-${type.id}`}
                            name="store-type"
                            value={type.id}
                            checked={filterStoreType === type.id}
                            onChange={() => setFilterStoreType(type.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                          <label
                            htmlFor={`store-type-${type.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {type.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional filters can be added here */}
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                <SelectItem value="rating-low">Rating: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={gridView === 2 ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setGridView(2)}
                aria-label="Two column view"
              >
                <Columns2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridView === 3 ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setGridView(3)}
                aria-label="Three column view"
              >
                <Columns3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridView === 4 ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setGridView(4)}
                aria-label="Four column view"
              >
                <Columns4 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Store Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Showing {currentStores.length} of {stores.length} stores
          </p>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No stores found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridView} gap-6`}
          >
            {currentStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && stores.length > 0 && (
          <div className="flex items-center justify-center mt-12">
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-l-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`${currentPage === page ? "z-10" : ""}`}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                className="rounded-r-md"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopPrimary;
