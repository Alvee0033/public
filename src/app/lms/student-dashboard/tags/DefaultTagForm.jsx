import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import TagFormSkeleton from "./TagFormSkeleton";

const API_URL = "/master-tag-categories/by-entity-type/student";

export default function DefaultTagForm({ title, entity, submitUrl }) {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]); // grouped by master_tag_category_id
  const [masterCategories, setMasterCategories] = useState({}); // id -> name mapping
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Get user data from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const studentId = user?.student_id;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("/master-tag-categories?limit=210"),
      axios.get(API_URL),
    ])
      .then(([masterRes, catRes]) => {
        // Build a map of master category id -> name
        const masterList = masterRes?.data?.data || [];
        const masterMap = masterList.reduce((acc, m) => {
          acc[m.id] = m.name;
          return acc;
        }, {});
        setMasterCategories(masterMap);

        const cats = catRes?.data?.data || [];
        setCategories(cats);

        // Initialize form state
        const initialForm = {};
        cats.forEach((cat) => {
          initialForm[cat.tag_category_name] =
            cat.type === "Boolean/Radio" ? "" : [];
        });
        setForm(initialForm);

        // Group categories by master_tag_category_id
        const groupsMap = {};
        cats.forEach((cat) => {
          // Get master_tag_category_id from the first master_tag
          const masterId = cat.master_tags?.[0]?.master_tag_category_id ?? null;
          const key = masterId ?? "ungrouped";

          if (!groupsMap[key]) {
            groupsMap[key] = [];
          }
          groupsMap[key].push(cat);
        });

        // Convert to array format
        const groupArray = Object.entries(groupsMap).map(([key, catsArr]) => ({
          masterId: key === "ungrouped" ? null : Number(key),
          name:
            key === "ungrouped"
              ? "Other Questions"
              : masterMap[key] || `Group ${key}`,
          categories: catsArr,
        }));

        setGroups(groupArray);
      })
      .catch((err) => {
        console.error("Failed to load tag categories", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Student ID is now obtained directly from Redux state

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Student ID not found. Please make sure you're logged in.");
      return;
    }

    // Prepare all requests
    const requests = categories.flatMap((cat) => {
      const value = form[cat.tag_category_name];
      if (cat.type === "Boolean/Radio" && value) {
        // Find the tag object
        const tagObj = cat.master_tags.find((t) => t.id === value);
        return [
          {
            tag: tagObj?.name || "",
            tag_value: "as", // or whatever value you want
            display_sequence: 0,
            rating_score: 0,
            student_id: studentId,
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
        // Multi-select: send one request per tag, or combine as comma-separated if your API expects that
        // Here, let's send as comma-separated (like your example)
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
            student_id: studentId,
            master_tag_category_id: cat.master_tags[0]?.master_tag_category_id,
            master_tag_id: null,
            default_tag: false,
          },
        ];
      }
      return [];
    });

    try {
      await Promise.all(
        requests.map((body) => axios.post("/student-tags", body))
      );
      alert("Tags saved successfully!");
    } catch (err) {
      alert("Failed to save tags.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              border: "4px solid rgba(102, 126, 234, 0.2)",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
          <p
            style={{
              color: "#64748b",
              fontSize: 16,
              fontWeight: 500,
              margin: 0,
            }}
          >
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 900,
            width: "100%",
            margin: "0 auto",
            padding: "40px 32px",
            background: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Complete Your Profile
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: "clamp(14px, 2.5vw, 16px)",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Help us personalize your learning experience
            </p>
          </div>

          {/* Render grouped questions */}
          {groups.map((group, groupIndex) => (
            <div
              key={String(group.masterId ?? "other")}
              style={{ marginBottom: 48 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {groupIndex + 1}
                </div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(20px, 3.5vw, 24px)",
                    color: "#1e293b",
                    margin: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {group.name}
                </h2>
              </div>

              {group.categories.map((cat) => (
                <div
                  key={cat.tag_category_name}
                  style={{
                    marginBottom: 24,
                    background: "#f8fafc",
                    borderRadius: 16,
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: "clamp(15px, 2.8vw, 17px)",
                      marginBottom: 16,
                      color: "#334155",
                      display: "block",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {cat.tag_category_name}
                  </label>

                  {cat.type === "Boolean/Radio" ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 12,
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
                            color:
                              form[cat.tag_category_name] === tag.id
                                ? "#fff"
                                : "#475569",
                            fontSize: "clamp(14px, 2.5vw, 15px)",
                            gap: 10,
                            padding: "12px 16px",
                            borderRadius: 10,
                            background:
                              form[cat.tag_category_name] === tag.id
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "#fff",
                            border: "2px solid",
                            borderColor:
                              form[cat.tag_category_name] === tag.id
                                ? "#667eea"
                                : "#e2e8f0",
                            transition: "all 0.25s ease",
                            boxShadow:
                              form[cat.tag_category_name] === tag.id
                                ? "0 4px 12px rgba(102, 126, 234, 0.25)"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (form[cat.tag_category_name] !== tag.id) {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.background = "#f1f5f9";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (form[cat.tag_category_name] !== tag.id) {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.background = "#fff";
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name={cat.tag_category_name}
                            value={tag.id}
                            checked={form[cat.tag_category_name] === tag.id}
                            onChange={() =>
                              handleChange(
                                cat.tag_category_name,
                                tag.id,
                                cat.type
                              )
                            }
                            style={{
                              accentColor: "#667eea",
                              width: 18,
                              height: 18,
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                          />
                          <span>{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 12,
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
                            color: form[cat.tag_category_name]?.includes(tag.id)
                              ? "#fff"
                              : "#475569",
                            fontSize: "clamp(14px, 2.5vw, 15px)",
                            gap: 10,
                            padding: "12px 16px",
                            borderRadius: 10,
                            background: form[cat.tag_category_name]?.includes(
                              tag.id
                            )
                              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              : "#fff",
                            border: "2px solid",
                            borderColor: form[cat.tag_category_name]?.includes(
                              tag.id
                            )
                              ? "#667eea"
                              : "#e2e8f0",
                            transition: "all 0.25s ease",
                            boxShadow: form[cat.tag_category_name]?.includes(
                              tag.id
                            )
                              ? "0 4px 12px rgba(102, 126, 234, 0.25)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (
                              !form[cat.tag_category_name]?.includes(tag.id)
                            ) {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.background = "#f1f5f9";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (
                              !form[cat.tag_category_name]?.includes(tag.id)
                            ) {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.background = "#fff";
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            name={cat.tag_category_name}
                            value={tag.id}
                            checked={form[cat.tag_category_name]?.includes(
                              tag.id
                            )}
                            onChange={() =>
                              handleChange(
                                cat.tag_category_name,
                                tag.id,
                                cat.type
                              )
                            }
                            style={{
                              accentColor: "#667eea",
                              width: 18,
                              height: 18,
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                          />
                          <span>{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "18px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "clamp(16px, 3vw, 18px)",
              letterSpacing: "0.5px",
              marginTop: 32,
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(102, 126, 234, 0.3)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
