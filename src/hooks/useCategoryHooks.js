"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
export const useCategoryData = (currentPage) => {
  const [categoryData, setCategoryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.set("page", currentPage);
      formData.set("pagination", 15);
      const res = await fetch("/api/category", {
        cache: "no-store",
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCategoryData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
    } catch (error) {
      console.error("Error fetching category data:", error);
      toast.error("Failed to fetch category data");
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categoryData, totalPages, fetchCategories };
};

export const useUpdateCategoryStatus = (fetchCategories) => {
  const updateCategoryStatus = async (category) => {
    const formData = new FormData();
    formData.set("id", category._id);
    formData.set(
      "status",
      category.status === "active" ? "inactive" : "active"
    );

    const toastId = toast.loading("Updating category status...");
    try {
      const res = await fetch("/api/category/update-status", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        toast.dismiss(toastId);
        toast.success("Category status updated successfully");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.dismiss(toastId);
      toast.error("Failed to update category status");
    }
  };

  return { updateCategoryStatus };
};
