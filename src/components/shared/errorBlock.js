export default function ErrorBlock({ title, message }) {
  return (
    <div className="container mx-auto">
      <div className="text-center bg-red-50 p-8 rounded-lg border border-red-100">
        <h3 className="text-red-500 text-xl font-semibold mb-2">
          {title || "Error"}
        </h3>
        <p className="text-gray-600">
          {message ||
            "Something went wrong while loading resources. Please try again later."}
        </p>
      </div>
    </div>
  );
}
