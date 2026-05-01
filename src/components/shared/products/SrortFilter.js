const SrortFilter = ({ sortInput, setSortInput, setIsPriceRange }) => {
  const inputs = [
    { name: "Featured", value: "featured" },
    { name: "Best Selling", value: "best-selling" },
    { name: "Alphabetically, A-Z", value: "title-ascending" },
    { name: "Alphabetically, Z-A", value: "title-descending" },
    { name: "Price, low to high", value: "price-ascending" },
    { name: "Price, high to low", value: "price-descending" },
    { name: "Date, new to old", value: "created-descending" },
    { name: "Date, old to new", value: "created-ascending" },
  ];
  return (
    <div className="mr-50px">
      <label className="text-blackColor  mr-6px">Sort by :</label>
      <select
        onChange={(e) => {
          setSortInput(e.target.value);
          setIsPriceRange(false);
        }}
        value={sortInput}
        className="text-blackColor  p-10px w-185px rounded-md bg-transparent box-border"
      >
        {inputs?.map(({ name, value }, idx) => (
          <option key={idx} className="" value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SrortFilter;
