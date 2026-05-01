const Accordion = ({ children, isActive, accordion, idx }) => {
  return (
    <li
      className={`accordion  ${
        accordion === "secondary" ? "accordion-seondary mb-25px" : ""
      } ${isActive ? "active" : ""}`}
    >
      {accordion === "secondary" ? (
        <div className="bg-whiteColor border border-borderColor   rounded-t-md">
          {children}
        </div>
      ) : accordion === "secondaryLg" ? (
        <div
          className={`bg-whiteColor border border-borderAccordion    ${
            idx === 3 ? "" : "border-b-0"
          }`}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </li>
  );
};

export default Accordion;
