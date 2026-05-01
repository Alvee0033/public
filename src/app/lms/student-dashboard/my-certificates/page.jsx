"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

const CertificateCard = ({ cert }) => {
  const [imgError, setImgError] = React.useState(false);

  const hasImage = !!cert?.certificate_picture && !imgError;

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row items-center p-4 gap-4 hover:shadow-lg transition">
      {hasImage ? (
        <img
          src={cert.certificate_picture}
          alt={cert.certificate_title}
          className="w-32 h-32 object-cover rounded-lg border"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border text-sm text-gray-500">
          No image
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {cert.certificate_title}
        </h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Course:</span> {cert.course?.title}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Institute:</span> {cert.institute?.name}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Issued:</span>{" "}
          {new Date(cert.issue_date).toLocaleDateString()}
        </div>
        <div className="flex gap-4 mt-2">
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
            Score: {cert.score}
          </div>
          <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            GPA: {cert.gpa}
          </div>
        </div>
        <div className="mt-2">{/* Share button removed per request */}</div>
      </div>
    </div>
  );
};

const Page = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      setLoading(true);
      try {
        const userStr = localStorage.getItem("user");
        let studentId = null;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            studentId = user?.student_id ?? user?.studentId ?? null;
          } catch (e) {
            studentId = null;
          }
        }

        if (!studentId) {
          setCertificates([]);
          setLoading(false);
          return;
        }

        const filter = { student: studentId };
        const url = `/student-course-certificates?filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`;

        const res = await axios.get(url);
        setCertificates(res.data?.data || []);
      } catch (err) {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 mx-auto text-center">
        My Certificates
      </h1>
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-xl h-36"
            />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          No certificates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard cert={cert} key={cert.id + cert.issue_date} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
