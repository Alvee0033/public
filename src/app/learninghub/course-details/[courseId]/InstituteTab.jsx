import { Card } from "@/components/ui/card";
import axios from "@/lib/axios";
import {
  AlertCircle,
  BookOpen,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function InstituteTab({ course, institute: instituteProp }) {
  const instituteId = course?.institute_id;

  const normalizeInstitute = (source) => {
    if (!source) return null;

    const data = source?.data && !source?.hub_name ? source.data : source;

    return {
      id: data.id,
      name: data.hub_name || data.name || "Learning Hub",
      logo: data.logo || data.logo_url || "",
      website: data.website_url || data.website || "",
      email: data.email || "",
      phone: data.phone || "",
      city: data.city || "",
      state: data.master_state?.name || data.state_code || "",
      country: data.master_country?.name || data.country_code || "",
      description: data.hub_description || data.public_profile || "",
      status: data.status || "",
      rating: Number(data.avg_rating || data.rating_score || 0),
      services: Array.isArray(data.services_offered) ? data.services_offered : [],
    };
  };

  const [institute, setInstitute] = useState(normalizeInstitute(instituteProp));
  const [loading, setLoading] = useState(!instituteProp && !!instituteId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (instituteProp) {
      setInstitute(normalizeInstitute(instituteProp));
      setLoading(false);
      return;
    }

    if (!instituteId) {
      setInstitute(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`/learning-hub/${instituteId}`)
      .then((res) => setInstitute(normalizeInstitute(res?.data?.data || res?.data)))
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [instituteId, instituteProp]);

  const hasValue = (value) => value !== undefined && value !== null && value !== "";
  const location = [institute?.city, institute?.state, institute?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="animate-spin">⏳</span>
            <span>Loading institute information...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : !institute ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <AlertCircle className="w-5 h-5" />
            <span>No institute found</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {hasValue(institute.logo) ? (
                <img
                  src={institute.logo}
                  alt={institute.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-600 font-semibold">
                  {String(institute.name || "L").charAt(0)}
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-900">{institute.name}</h3>

                {hasValue(location) && (
                  <div className="text-sm text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {institute.rating > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      {institute.rating.toFixed(1)}
                    </span>
                  )}

                  {institute.status === "active" && (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {institute.services.length} services
                  </span>
                </div>
              </div>
            </div>

            {hasValue(institute.description) && (
              <p className="text-sm text-gray-700 leading-6">{institute.description}</p>
            )}

            {institute.services.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {institute.services.map((service, index) => (
                    <span
                      key={`${service}-${index}`}
                      className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {hasValue(institute.website) && (
                <a
                  href={institute.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  {String(institute.website).replace(/^https?:\/\//, "")}
                </a>
              )}

              {hasValue(institute.email) && (
                <a
                  href={`mailto:${institute.email}`}
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {institute.email}
                </a>
              )}

              {hasValue(institute.phone) && (
                <a
                  href={`tel:${institute.phone}`}
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {institute.phone}
                </a>
              )}

              {!hasValue(institute.website) &&
                !hasValue(institute.email) &&
                !hasValue(institute.phone) && (
                  <div className="text-gray-500 inline-flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Contact details unavailable
                  </div>
                )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
