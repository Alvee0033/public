import Spinner from "./spinner.jsx";

export default function FetchLoading({ msg }) {
  return (
    <div className="p-4 my-10 text-center text-blue-400 bg-blue-400/5 border-l-4 border-blue-400 max-w-2xl mx-auto flex justify-center items-center">
      <Spinner
        title={msg || "Loading remote data..."}
        className="text-blue-400"
      />
    </div>
  );
}