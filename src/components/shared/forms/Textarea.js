const Textarea = ({ label, cols = 30, rows = 10, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="mb-3 block font-semibold">{label}</label>}
      <textarea
        className="w-full py-10px px-5 text-sm text-contentColor  bg-whiteColor  border-2 border-borderColor  placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md focus-visible:outline-slate-300"
        cols={cols}
        rows={rows}
        {...props}
      />
    </div>
  );
};

export default Textarea;
