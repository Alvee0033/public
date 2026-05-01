"use client";

import "react-quill-new/dist/quill.snow.css";
import { useField } from "formik";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

export default function RichText({ label, name, disableErrorMsg }) {
  const [field, meta, helpers] = useField(name);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium my-3 ">
          {label}
        </label>
      )}
      <ReactQuill
        theme="snow"
        value={field.value}
        onChange={(content) => helpers?.setValue(content)}
        onBlur={() => helpers.setTouched(true)}
        modules={modules}
        formats={formats}
        className="rounded-t"
        style={{ }}
      />
      <style>{`
        .ql-container {
          min-height: 150px;
        }
        .ql-editor {
          min-height: 150px;
          height: 150px;
        }
      `}</style>
      {!disableErrorMsg && meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-600">{meta.error}</p>
      )}
    </div>
  );
}
