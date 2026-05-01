const TabButtonPrimary = ({
  name,
  handleTabClick,
  idx,
  currentIdx,
  button,
}) => {
  return (
    <button
      onClick={() => handleTabClick(idx)}
      className={`tab-link  text-blackColor  hover:text-primaryColor     hover:bg-white relative group/btn  hover:shadow-bottom  disabled:cursor-pointer rounded-standard ${
        button === "lg" ? "py-9px lg:py-6 " : "py-14px"
      } ${idx === currentIdx ? "bg-white   shadow-bottom" : "bg-lightGrey7 "} `}
      disabled={idx === currentIdx ? true : false}
    >
      <span
        className={`absolute  h-1 bg-primaryColor top-0 left-0 group-hover/btn:w-full ${
          idx === currentIdx ? "w-full" : "w-0"
        }`}
      ></span>

      {name}
    </button>
  );
};

export default TabButtonPrimary;
