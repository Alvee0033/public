import lessons from "@/../public/fakedata/lessons.json";
import LessonMain from "@/components/layout/main/LessonMain";
import { notFound } from "next/navigation";
export async function generateMetadata(props) {
  const params = props.params;
  const { id } = lessons?.find(({ id }) => id == params.id) || { id: 1 };
  return {
    title: `Lesson ${
      id == 1 ? "" : id < 10 ? "0" + id : id
    } | ScholarPASS - Education LMS Template`,
    description: `Lesson ${
      id == 1 ? "" : "0" + id
    } | ScholarPASS - Education LMS Template`,
  };
}
const Lesson = (props) => {
  const params = props.params;
  const { id } = params;
  const isExistLesson = lessons?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistLesson) {
    notFound();
  }
  return <LessonMain id={params?.id} />;
};
export async function generateStaticParams() {
  return lessons?.map(({ id }) => ({ id: id.toString() }));
}
export default Lesson;
