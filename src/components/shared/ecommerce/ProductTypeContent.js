import React from "react";
import ProductDescriptionText from "./ProductDescriptionText";

const ProductTypeContent = ({ product }) => {
  return (
    <div>
      <ProductDescriptionText>
        {product?.type || "No product type information available."}
      </ProductDescriptionText>
    </div>
  );
};

export default ProductTypeContent;
