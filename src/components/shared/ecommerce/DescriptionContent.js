import ProductDescriptionText from "@/components/shared/ecommerce/ProductDescriptionText";
import React from "react";

const DescriptionContent = ({ product }) => {
  return (
    <div>
      <ProductDescriptionText>
        {product?.description || "No description available."}
      </ProductDescriptionText>
    </div>
  );
};

export default DescriptionContent;
