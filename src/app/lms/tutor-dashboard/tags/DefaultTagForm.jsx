
import axios from "axios";
import { useEffect, useState } from "react";
import TagFormSkeleton from "./TagFormSkeleton";
import { ChevronDown, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

const API_URL = "/master-tag-categories/by-entity-type/tutor";

export default function DefaultTagForm({ title, entity, submitUrl }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [tutorId, setTutorId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setCategories(res.data.data || []);
        const initialForm = {};
        (res.data.data || []).forEach((cat) => {
          initialForm[cat.tag_category_name] =
            cat.type === "Boolean/Radio" ? "" : [];
        });
        setForm(initialForm);
        // By default, show all categories
        setSelectedCategories((res.data.data || []).map((cat) => cat.tag_category_name));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Get tutor ID from Redux state
    const getTutorId = () => {
      try {
        const tutor_id = user?.tutor_id;
        
        if (tutor_id) {
          setTutorId(tutor_id);
          console.log("Tutor ID from user data:", tutor_id);
        } else {
          console.warn("Tutor ID not found in user data");
        }
      } catch (err) {
        console.error("Error getting tutor ID from user data:", err);
      }
    };

    if (user) {
      getTutorId();
    }
  }, [user]);

  const handleChange = (category, value, type) => {
    setForm((prev) => {
      if (type === "Boolean/Radio") {
        return { ...prev, [category]: value };
      } else {
        const arr = prev[category] || [];
        if (arr.includes(value)) {
          return { ...prev, [category]: arr.filter((v) => v !== value) };
        } else {
          return { ...prev, [category]: [...arr, value] };
        }
      }
    });
  };

  // Filtering UI handler
  const handleCategoryFilterChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tutor_id = tutorId;

    console.log("Current tutorId from user data:", tutorId);
    console.log("Form data:", form);

    if (!tutor_id) {
      console.error("Tutor ID is not set. Make sure user data contains tutor_id.");
      alert("Tutor ID not found. Please refresh the page or contact support.");
      return;
    }

    // Prepare all requests - submit ALL selected items, not just visible ones
    const requests = categories.flatMap((cat) => {
      const value = form[cat.tag_category_name];
      if (cat.type === "Boolean/Radio" && value) {
        const tagObj = cat.master_tags.find((t) => t.id === value);
        return [
          {
            tag: tagObj?.name || "",
            tag_value: "as",
            display_sequence: 0,
            rating_score: 0,
            tutor_id,
            master_tag_category_id: cat.master_tags[0]?.master_tag_category_id,
            master_tag_id: value,
            default_tag: false,
          },
        ];
      } else if (
        cat.type !== "Boolean/Radio" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        const tagNames = cat.master_tags
          .filter((t) => value.includes(t.id))
          .map((t) => t.name)
          .join(", ");
        return [
          {
            tag: tagNames,
            tag_value: "as",
            display_sequence: 0,
            rating_score: 0,
            tutor_id,
            master_tag_category_id: cat.master_tags[0]?.master_tag_category_id,
            master_tag_id: null,
            default_tag: false,
          },
        ];
      }
      return [];
    });

    try {
      console.log("Submitting requests with tutor_id:", tutor_id);
      console.log("Requests payload:", requests);
      await Promise.all(
        requests.map((body) => axios.post("/tutor-tags", body))
      );
      alert("Tags saved successfully!");
    } catch (err) {
      alert("Failed to save tags.");
      console.error("Error submitting tags:", err);
    }
  };

  if (loading) {
    return <TagFormSkeleton />;
  }

  // Get all category names for filter UI
  const allCategoryNames = categories.map((cat) => cat.tag_category_name);

  return (
    <div>
      <div
        style={{
          minHeight: "90vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          fontFamily: "Inter, Roboto, sans-serif",
          padding: "20px 16px",
        }}
      >
        {/* Filter UI - Modern Dropdown */}
        <div style={{ marginBottom: 24, position: "relative" }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: "#3730a3", fontSize: "14px" }}>
            Filter by Tag Category:
          </div>
          
          {/* Dropdown Button */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 8,
              border: "2px solid #e0e7ff",
              background: "#ffffff",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: dropdownOpen ? "0 4px 12px rgba(99, 102, 241, 0.15)" : "none",
              borderColor: dropdownOpen ? "#6366f1" : "#e0e7ff",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
              {selectedCategories.length === 0 ? (
                <span style={{ color: "#9ca3af", fontSize: "14px" }}>Select categories...</span>
              ) : selectedCategories.length === allCategoryNames.length ? (
                <span style={{ color: "#3730a3", fontSize: "14px", fontWeight: 500 }}>All categories selected</span>
              ) : (
                <>
                  {selectedCategories.map((cat) => (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: "#e0e7ff",
                        color: "#3730a3",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      <span>{cat}</span>
                      <X
                        size={14}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryFilterChange(cat);
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
            <ChevronDown
              size={20}
              style={{
                color: "#6366f1",
                transition: "transform 0.2s ease",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 8,
                borderRadius: 8,
                border: "2px solid #e0e7ff",
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {/* Select All Option */}
              <div
                onClick={() => {
                  if (selectedCategories.length === allCategoryNames.length) {
                    setSelectedCategories([]);
                  } else {
                    setSelectedCategories(allCategoryNames);
                  }
                }}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  background: selectedCategories.length === allCategoryNames.length ? "#f0f4ff" : "transparent",
                  color: selectedCategories.length === allCategoryNames.length ? "#6366f1" : "#334155",
                  fontWeight: selectedCategories.length === allCategoryNames.length ? 600 : 500,
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.length === allCategoryNames.length}
                  onChange={() => {}}
                  style={{
                    accentColor: "#6366f1",
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
                <span>Select All</span>
              </div>

              {/* Category Options */}
              {allCategoryNames.map((catName) => (
                <div
                  key={catName}
                  onClick={() => handleCategoryFilterChange(catName)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    background: selectedCategories.includes(catName) ? "#f0f4ff" : "transparent",
                    color: selectedCategories.includes(catName) ? "#6366f1" : "#334155",
                    fontWeight: selectedCategories.includes(catName) ? 600 : 500,
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = selectedCategories.includes(catName) ? "#e0e7ff" : "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedCategories.includes(catName) ? "#f0f4ff" : "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(catName)}
                    onChange={() => {}}
                    style={{
                      accentColor: "#6366f1",
                      marginRight: 10,
                      cursor: "pointer",
                    }}
                  />
                  <span>{catName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close dropdown when clicking outside */}
        {dropdownOpen && (
          <div
            onClick={() => setDropdownOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "100%",
            width: "100%",
            margin: "0 auto",
            padding: "24px 20px",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px 0 rgba(80, 112, 255, 0.10)",
            border: "1px solid #e0e7ff",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 32,
              color: "#4f46e5",
              fontWeight: 800,
              letterSpacing: 1,
              fontSize: "clamp(20px, 4vw, 24px)",
            }}
          >
            Tutor Tags
          </h2>

          {categories
            .filter((cat) => selectedCategories.includes(cat.tag_category_name))
            .map((cat) => (
              <div
                key={cat.tag_category_name}
                style={{
                  marginBottom: 28,
                  background: "#f3f4f6",
                  borderRadius: 12,
                  padding: "20px 16px",
                  boxShadow: "0 1px 4px 0 rgba(80,112,255,0.04)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(16px, 3vw, 17px)",
                    marginBottom: 12,
                    color: "#3730a3",
                  }}
                >
                  What is your {cat.tag_category_name.toLowerCase()}?
                </div>

                {cat.type === "Boolean/Radio" ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px 16px",
                      alignItems: "flex-start",
                    }}
                  >
                    {cat.master_tags.map((tag) => (
                      <label
                        key={tag.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: 500,
                          color: "#334155",
                          fontSize: "clamp(13px, 2.5vw, 15px)",
                          gap: 7,
                          padding: "6px 8px",
                          borderRadius: 6,
                          backgroundColor:
                            form[cat.tag_category_name] === tag.id
                              ? "#e0e7ff"
                              : "transparent",
                          border:
                            form[cat.tag_category_name] === tag.id
                              ? "1px solid #6366f1"
                              : "1px solid transparent",
                          transition: "all 0.2s ease",
                          minWidth: "fit-content",
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="radio"
                          name={cat.tag_category_name}
                          value={tag.id}
                          checked={form[cat.tag_category_name] === tag.id}
                          onChange={() =>
                            handleChange(cat.tag_category_name, tag.id, cat.type)
                          }
                          style={{
                            accentColor: "#6366f1",
                            width: 16,
                            height: 16,
                            marginRight: 6,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ whiteSpace: "nowrap" }}>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px 16px",
                      alignItems: "flex-start",
                    }}
                  >
                    {cat.master_tags.map((tag) => (
                      <label
                        key={tag.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: 500,
                          color: "#334155",
                          fontSize: "clamp(13px, 2.5vw, 15px)",
                          gap: 7,
                          padding: "6px 8px",
                          borderRadius: 6,
                          backgroundColor: form[cat.tag_category_name]?.includes(tag.id)
                            ? "#e0e7ff"
                            : "transparent",
                          border: form[cat.tag_category_name]?.includes(tag.id)
                            ? "1px solid #6366f1"
                            : "1px solid transparent",
                          transition: "all 0.2s ease",
                          minWidth: "fit-content",
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          name={cat.tag_category_name}
                          value={tag.id}
                          checked={form[cat.tag_category_name]?.includes(tag.id)}
                          onChange={() =>
                            handleChange(cat.tag_category_name, tag.id, cat.type)
                          }
                          style={{
                            accentColor: "#6366f1",
                            width: 16,
                            height: 16,
                            marginRight: 6,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ whiteSpace: "nowrap" }}>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px 0",
              background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "clamp(15px, 3vw, 17px)",
              letterSpacing: 1,
              marginTop: 16,
              boxShadow: "0 2px 8px 0 rgba(99,102,241,0.10)",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #818cf8 0%, #6366f1 100%)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)")
            }
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}