export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/10 rounded-full animate-pulse"></div>
      <div
        className="absolute top-1/4 right-20 w-96 h-96 bg-purple-200/8 rounded-full animate-bounce"
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-64 h-64 bg-pink-200/12 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-300/15 rounded-full animate-bounce"
        style={{ animationDuration: "8s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-1/3 right-10 w-80 h-80 bg-purple-300/10 rounded-full animate-pulse"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-3/4 left-1/3 w-56 h-56 bg-pink-300/12 rounded-full animate-bounce"
        style={{ animationDuration: "7s" }}
      ></div>
      <div
        className="absolute top-40 left-1/2 w-40 h-40 bg-blue-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>
  );
}