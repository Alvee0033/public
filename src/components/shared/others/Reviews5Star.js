const Reviews5Star = ({ reviews, type }) => {
  const fullStars = Math.floor(reviews); // Calculate the number of full stars
  const emptyStars = 5 - fullStars; // Calculate the number of empty stars

  return (
    <div
      className={`flex gap-1 text-size-15 items-center justify-start md:justify-end`}
    >
      {/* Render full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <i key={`full-${index}`} className="icofont-star text-yellow"></i>
      ))}

      {/* Render empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <i key={`empty-${index}`} className="icofont-star text-lightGrey"></i>
      ))}

      <span
        className={
          type === "lg" ? "text-blackColor" : "text-xs text-lightGrey6"
        }
      >
        ({reviews})
      </span>
    </div>
  );
};

export default Reviews5Star;
