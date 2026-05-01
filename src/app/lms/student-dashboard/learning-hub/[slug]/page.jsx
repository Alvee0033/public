import { notFound } from "next/navigation";
import LearningHubWorkspace from "../_components/LearningHubWorkspace";
import { getLearningHubSection } from "../_lib/hub-sections";

export default async function StudentLearningHubSectionPage({ params }) {
  const { slug } = await params;
  const hasSection = Boolean(getLearningHubSection(slug));

  if (!hasSection) {
    notFound();
  }

  return <LearningHubWorkspace sectionSlug={slug} />;
}
