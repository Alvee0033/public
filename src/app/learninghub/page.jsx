import { HubSearchExperience } from "./_components/HubSearchExperience";

export const dynamic = "force-dynamic";

/**
 * LearningHub Discovery Page.
 * Uses force-dynamic to ensure the latest hub data and UI are always served.
 */
export default function LearningHubSearchPage() {
  return <HubSearchExperience />;
}
