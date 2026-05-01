export default function TagFormSkeleton() {
  // Skeleton shimmer animation
  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
  `;

  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200px 100%",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <div>
      <style>{shimmerKeyframes}</style>
      <div
        style={{
          minHeight: "90vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          fontFamily: "Inter, Roboto, sans-serif",
          padding: "20px 16px",
        }}
      >
        <div
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
          {/* Header skeleton */}
          <div
            style={{
              ...shimmerStyle,
              height: "32px",
              width: "40%",
              maxWidth: "200px",
              margin: "0 auto 32px auto",
              borderRadius: "8px",
            }}
          />

          {/* Category cards skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              style={{
                marginBottom: 28,
                background: "#f3f4f6",
                borderRadius: 12,
                padding: "20px 16px",
                boxShadow: "0 1px 4px 0 rgba(80,112,255,0.04)",
              }}
            >
              {/* Category title skeleton */}
              <div
                style={{
                  ...shimmerStyle,
                  height: "20px",
                  width: `${60 + index * 10}%`,
                  maxWidth: "300px",
                  marginBottom: 16,
                  borderRadius: "6px",
                }}
              />

              {/* Options skeleton - responsive grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "12px 16px",
                  alignItems: "flex-start",
                }}
              >
                {Array.from({ length: 6 }).map((_, optionIndex) => (
                  <div
                    key={optionIndex}
                    style={{
                      ...shimmerStyle,
                      height: "34px",
                      borderRadius: "6px",
                      minWidth: "90px",
                      maxWidth: "160px",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Submit button skeleton */}
          <div
            style={{
              ...shimmerStyle,
              width: "100%",
              height: "56px",
              borderRadius: "8px",
              marginTop: 16,
            }}
          />
        </div>
      </div>
    </div>
  );
}