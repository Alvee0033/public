"use client";
import { useCourse } from "@/app/lms/student-dashboard/course-player/[courseId]/CourseContext";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

// Helper to transform backend course data to UI shape
function mapCourseToTabs(course) {
  if (!course)
    return {
      title: "",
      tabs: [],
      description: { title: "", paragraphs: [] },
      attachments: [],
      audioFiles: [],
      codeExamples: [],
    };

  // Tabs: always show description, attachFile, audioFile, codeExamples
  const tabs = [
    { id: "description", label: "Description" },
    {
      id: "attachFile",
      label: "Attached Files",
      count: course.public_url ? "01" : undefined,
    },
    // { id: "audioFile", label: "Lesson Audio File" },
    // { id: "codeExamples", label: "Code Examples" },
  ];

  // Description: use HTML fields, fallback to short_description
  const description = {
    title: "Course Description",
    paragraphs: [
      course.short_description
        ? course.short_description.replace(/<[^>]+>/g, "") // strip HTML
        : "No description available.",
    ],
  };

  // Attachments: if public_url exists, show as downloadable file
  const attachments = course.public_url
    ? [
        {
          id: 1,
          name: "Course Outline / Syllabus",
          size: "External Link",
          icon: FiFileText,
          url: course.public_url,
        },
      ]
    : [];

  // You can extend this to map audioFiles and codeExamples if available
  return {
    title: course.name || "",
    tabs,
    description,
    attachments,
    audioFiles: [],
    codeExamples: [],
  };
}

const NotFound = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
    <AlertCircle className="w-7 h-7 mb-2" />
    <span className="text-sm">{text}</span>
  </div>
);

const CourseDescTabs = ({
  defaultActiveTab = "description",
  onFileDownload = (file) => {
    // If file has a url, open in new tab
    if (file.url) window.open(file.url, "_blank");
    else console.log("Downloading file:", file);
  },
  styles = {},
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [screenSize, setScreenSize] = useState("desktop");
  const tabsContainerRef = useRef(null);

  // Get course data from context
  const { course, courseLoading, courseError } = useCourse();

  // Map backend data to UI shape
  const courseData = mapCourseToTabs(course);

  // Responsive logic (unchanged)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    checkScreenSize();
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Scroll to active tab (unchanged)
  useEffect(() => {
    if (
      tabsContainerRef.current &&
      (screenSize === "mobile" || screenSize === "tablet")
    ) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      );
      if (activeTabElement) {
        const containerWidth = tabsContainerRef.current.offsetWidth;
        const elementLeft = activeTabElement.offsetLeft;
        const elementWidth = activeTabElement.offsetWidth;
        const scrollLeft = elementLeft - containerWidth / 2 + elementWidth / 2;
        tabsContainerRef.current.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }
  }, [activeTab, screenSize]);

  // Loading and error UI
  if (courseLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading course details...
      </div>
    );
  }
  if (courseError) {
    return <div className="p-6 text-center text-red-500">{courseError}</div>;
  }

  const { title, tabs, description, attachments, audioFiles, codeExamples } =
    courseData;

  return (
    <div
      className="w-full bg-white font-sans"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        ...styles.container,
      }}
    >
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Title is displayed at the top of the course player page (parent). */}
        {/* Kept title in courseData for other uses but removed duplicate heading here. */}
        <div className="relative">
          <div
            className="border-b border-gray-200 w-full overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              ...styles.tabContainer,
            }}
            ref={tabsContainerRef}
          >
            <div
              className="flex w-max min-w-full pb-1"
              style={{
                gap:
                  screenSize === "mobile"
                    ? "8px"
                    : screenSize === "tablet"
                    ? "14px"
                    : "24px",
                ...styles.tabsWrapper,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  className={`py-1.5 sm:py-2 lg:py-3 px-2 sm:px-2 lg:px-3 whitespace-nowrap transition-all duration-200 rounded-t-lg
                    ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 bg-white shadow-md text-blue-700 scale-105"
                        : "border-b-2 border-transparent hover:border-gray-300 hover:bg-gray-50 text-gray-500"
                    }`}
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 700, // Always bold to prevent width jump
                    fontSize:
                      screenSize === "mobile"
                        ? "11px"
                        : screenSize === "tablet"
                        ? "12px"
                        : "14px",
                    lineHeight:
                      screenSize === "mobile"
                        ? "16px"
                        : screenSize === "tablet"
                        ? "18px"
                        : "20px",
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    color: activeTab === tab.id ? "#2563eb" : "#6B7280", // blue-600
                    boxShadow:
                      activeTab === tab.id
                        ? "0 2px 8px 0 rgba(37,99,235,0.08)"
                        : undefined,
                    zIndex: activeTab === tab.id ? 2 : 1,
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.count && (
                    <span
                      className="ml-1 inline-flex items-center justify-center"
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontWeight: 600,
                        fontSize:
                          screenSize === "mobile"
                            ? "8px"
                            : screenSize === "tablet"
                            ? "9px"
                            : "10px",
                        lineHeight: "1",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "#2C60EB",
                        backgroundColor: "#EBF2FF",
                        padding:
                          screenSize === "mobile" ? "2px 3px" : "2px 4px",
                        borderRadius: "3px",
                        ...styles.tabCount,
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mt-3 sm:mt-4 lg:mt-6 transition-all duration-300"
          style={{
            minHeight: "220px", // Adjust as needed for your design
            ...styles.contentContainer,
          }}
        >
          {activeTab === "description" && (
            <div
              className="space-y-4 sm:space-y-6 lg:space-y-8"
              style={styles.descriptionTab}
            >
              <div>
                <h2
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight"
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    letterSpacing: "-0.01em",
                    ...styles.sectionTitle,
                  }}
                >
                  {description.title}
                </h2>
                <div
                  className="space-y-2 sm:space-y-3 lg:space-y-4"
                  style={styles.paragraphsContainer}
                >
                  {description.paragraphs &&
                  description.paragraphs[0] &&
                  description.paragraphs[0] !== "No description available." ? (
                    description.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed"
                        style={{
                          fontFamily: "system-ui, sans-serif",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          ...styles.paragraph,
                        }}
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <NotFound text="No description found" />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attachFile" && (
            <div
              className="space-y-4 sm:space-y-6"
              style={styles.attachFileTab}
            >
              <h2
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                  ...styles.sectionTitle,
                }}
              >
                Attached Files
              </h2>
              {attachments.length > 0 ? (
                <div>
                  <div className="space-y-2 sm:space-y-3">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-3 sm:p-4 transition-colors duration-200 border border-gray-200"
                        style={{
                          ...styles.fileCard,
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div
                            className="flex items-center space-x-2 sm:space-x-3"
                            style={styles.fileInfo}
                          >
                            <div
                              className="text-blue-600 text-xl sm:text-2xl lg:text-3xl"
                              style={styles.fileIcon}
                            >
                              <file.icon />
                            </div>
                            <div
                              className="flex-1 min-w-0"
                              style={styles.fileDetails}
                            >
                              <p
                                className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 truncate"
                                style={{
                                  fontFamily: "system-ui, sans-serif",
                                  ...styles.fileName,
                                }}
                              >
                                {file.name}
                              </p>
                              <p
                                className="text-[10px] sm:text-xs text-gray-500"
                                style={{
                                  fontFamily: "system-ui, sans-serif",
                                  ...styles.fileSize,
                                }}
                              >
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <button
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                            style={{
                              fontFamily: "system-ui, sans-serif",
                              fontWeight: 600,
                              fontSize:
                                screenSize === "mobile"
                                  ? "11px"
                                  : screenSize === "tablet"
                                  ? "12px"
                                  : "13px",
                              textTransform: "capitalize",
                              ...styles.downloadButton,
                            }}
                            onClick={() => onFileDownload(file)}
                          >
                            <FiDownload className="text-xs sm:text-sm" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <NotFound text="No files attached" />
              )}
            </div>
          )}

          {/* {activeTab === "audioFile" && (
            <div className="space-y-4 sm:space-y-6 min-h-[120px] flex items-center justify-center">
              <h2 className="sr-only">Lesson Audio File</h2>
              {audioFiles.length > 0 ? (
                <div></div>
              ) : (
                <NotFound text="No audio files found" />
              )}
            </div>
          )}

          {activeTab === "codeExamples" && (
            <div className="space-y-4 sm:space-y-6 min-h-[120px] flex items-center justify-center">
              <h2 className="sr-only">Code Examples</h2>
              {codeExamples.length > 0 ? (
                <div></div>
              ) : (
                <NotFound text="No code examples found" />
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CourseDescTabs;
