import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LessonAssignmetnPrimary from "@/components/sections/lesson-assignment/LessonAssignmetnPrimary";

const LessonAssignmentMain = () => {
  return (
    <div className="container">
      <HeroPrimary path={"Assignment"} title={"Assignment"} />
      <LessonAssignmetnPrimary />
    </div>
  );
};

export default LessonAssignmentMain;
