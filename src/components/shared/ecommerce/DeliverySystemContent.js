import React from "react";
import ProductDescriptionText from "./ProductDescriptionText";

const DeliverySystemContent = ({ product }) => {
  return (
    <div>
      <ProductDescriptionText>
        {product?.deliverySystem || "No delivery system information available."}
      </ProductDescriptionText>
    </div>
  );
};

export default DeliverySystemContent;
