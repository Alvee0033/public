import events from "@/../public/fakedata/events.json";
import EventDetailsMain from "@/components/layout/main/EventDetailsMain";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Event Details | ScholarPASS - Education LMS Template",
  description: "Event Details | ScholarPASS - Education LMS Template",
};

const Event_details = (props) => {
  const params = props.params;
  const { id } = params;
  const isExistEvent = events?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistEvent) {
    notFound();
  }
  return <EventDetailsMain />;
};
export async function generateStaticParams() {
  return events?.map(({ id }) => ({ id: id.toString() }));
}
export default Event_details;
