import { useState, useEffect } from "react";
export const useMentorSalesHooks = () => {
    const [salesSummeryData, setSalesSummeryData] = useState(null);
  
    const fetchMenorSalesSummery = async () => {
      try {
        const formData = new FormData();
        const res = await fetch("/api/mentorship-plan/sales-summery", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        setSalesSummeryData(data);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };
  
    useEffect(() => {
      fetchMenorSalesSummery();
    }, []);
  
    return { salesSummeryData, fetchMenorSalesSummery };

}