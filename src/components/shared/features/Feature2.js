const Feature2 = ({ feature, idx }) => {
  return (
    <div>
      <a
        href="#"
        className={`text-3xl ${
          idx % 2 === 0
            ? "text-primaryColor hover:text-secondaryColor "
            : "text-darkdeep2 hover:text-primaryColor"
        }  font-medium whitespace-nowrap px-4`}
      >
        {feature}
      </a>
    </div>
  );
};

export default Feature2;
