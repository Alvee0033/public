const AboutListItem = ({ item }) => {
  const { title } = item;
  return (
    <li className="flex items-center group">
      <i className="icofont-check text-primaryColor mr-15px border border-primaryColor rounded-full"></i>
      <p className="text-sm md:text-base text-blackColor ">{title}</p>
    </li>
  );
};

export default AboutListItem;
