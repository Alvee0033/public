export const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#5f2ded" : "#3386ff",
    boxShadow: state.isFocused ? "0 0 0 1px #5f2ded" : "none",
    "&:hover": {
      borderColor: "#5f2ded",
    },
    borderRadius: "0.375rem",
    minHeight: "40px",
    fontSize: "13px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    borderRadius: "0.375rem",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    marginTop: "4px",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d1d5db",
      borderRadius: "4px",
      "&:hover": {
        background: "#9ca3af",
      },
    },
  }),
  menuList: (base) => ({
    ...base,
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d1d5db",
      borderRadius: "4px",
      "&:hover": {
        background: "#9ca3af",
      },
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#5f2ded"
      : state.isFocused
      ? "#f3f4f6"
      : "transparent",
    color: state.isSelected ? "white" : "#374151",
    cursor: "pointer",
    fontSize: "13px",
    padding: "6px 12px",
  }),
  input: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "13px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "13px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "13px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "13px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#374151",
    "&:hover": {
      backgroundColor: "#ef4444",
      color: "white",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#9ca3af",
    padding: "4px",
    "&:hover": {
      color: "#5f2ded",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#9ca3af",
    padding: "4px",
    "&:hover": {
      color: "#ef4444",
    },
  }),
};
