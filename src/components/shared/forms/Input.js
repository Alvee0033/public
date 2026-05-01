const Input = ({ label, type = "text", placeholder, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="mb-3 block font-semibold">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor  bg-whiteColor  border-2 border-borderColor  placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md focus-visible:border-slate-300 font-no"
        {...props}
      />
    </div>
  );
};

export default Input;
