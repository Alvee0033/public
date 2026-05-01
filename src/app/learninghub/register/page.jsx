import { redirect } from "next/navigation";

export default function LearningHubRegisterRedirect() {
  redirect("/lms/hub-dashboard");
}
