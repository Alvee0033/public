"use client";

import AnnouncementsSection from "./AnnouncementsSection";
import AttendanceCheckinsSection from "./AttendanceCheckinsSection";
import BookSupportSection from "./BookSupportSection";
import CertificatesAchievementsSection from "./CertificatesAchievementsSection";
import ContinueLearningSection from "./ContinueLearningSection";
import HubAssignmentsSection from "./HubAssignmentsSection";
import HubCoursesSection from "./HubCoursesSection";
import MyHubSection from "./MyHubSection";
import MyTutorsMentorsSection from "./MyTutorsMentorsSection";
import RecommendationsSection from "./RecommendationsSection";
import ScholarshipSupportSection from "./ScholarshipSupportSection";
import UpcomingHubSessionsSection from "./UpcomingHubSessionsSection";

export const learningHubSectionComponents = {
  "my-hub": MyHubSection,
  "upcoming-sessions": UpcomingHubSessionsSection,
  "continue-learning": ContinueLearningSection,
  "book-support": BookSupportSection,
  "hub-courses": HubCoursesSection,
  "scholarship-support": ScholarshipSupportSection,
  "my-tutors-mentors": MyTutorsMentorsSection,
  assignments: HubAssignmentsSection,
  "certificates-achievements": CertificatesAchievementsSection,
  announcements: AnnouncementsSection,
  "attendance-checkins": AttendanceCheckinsSection,
  recommendations: RecommendationsSection,
};

