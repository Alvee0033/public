import dashboardLockImage from "@/assets/images/dashbord/lock.png";
import dashboardProdileImage from "@/assets/images/dashbord/profile.png";
import dashboardSuccessImage from "@/assets/images/dashbord/success.png";
import dashboardVerifyImage from "@/assets/images/dashbord/verify.png";
import dashboardVideoImage from "@/assets/images/dashbord/video.png";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import Image from "next/image";
import Link from "next/link";

const Notifications = () => {
  const notifiacations = [
    {
      id: 1,

      title: "latest resume has been updated!",
      image: dashboardProdileImage,
      pulishDate: "1 Hour Ago",
    },
    {
      id: 2,

      title: "Password has been changed 3 times",
      image: dashboardLockImage,
      pulishDate: "2 Min Ago",
    },
    {
      id: 3,

      title: "Successfully applied for a job Developer",
      image: dashboardVerifyImage,
      pulishDate: "30 Min Ago",
    },
    {
      id: 4,

      title: "Multi vendor course updated successfully",
      image: dashboardSuccessImage,
      pulishDate: "3 Hour Ago",
    },
    {
      id: 5,

      title: "latest resume has been updated!",
      image: dashboardVideoImage,
      pulishDate: "1 Hour Ago",
    },
  ];
  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor  shadow-accordion  rounded-5 max-h-137.5 overflow-auto">
      <HeadingDashboard path={"/courses"}>Notifications</HeadingDashboard>

      {/* notification */}
      <ul>
        {notifiacations?.map(({ id, title, pulishDate, image }, idx) => (
          <li
            key={idx}
            className={`flex items-center flex-wrap  ${
              idx === notifiacations?.length - 1
                ? "pt-15px"
                : "py-15px border-b border-borderColor "
            }`}
          >
            {/* avatar */}
            <div className="max-w-full md:max-w-1/5 pr-5">
              <Image src={image} alt="" className="max-w-50px w-full" />
            </div>
            {/* details */}
            <div className="max-w-full md:max-w-4/5 pr-10px">
              <div>
                <h5 className="text-lg leading-1 font-bold text-contentColor  mb-5px">
                  <Link className="hover:text-primaryColor" href="#">
                    {title}
                  </Link>
                </h5>
                <div className="text-darkblack  leading-1.8">
                  <p>{pulishDate}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
