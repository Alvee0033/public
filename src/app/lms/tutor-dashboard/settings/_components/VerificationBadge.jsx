import { CheckCircle, AlertCircle } from "lucide-react";

const VerificationBadge = ({ isVerified, className = "" }) => {
  if (isVerified) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium ${className}`}>
        <CheckCircle className="h-4 w-4" />
        Verified Tutor
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium ${className}`}>
      <AlertCircle className="h-4 w-4" />
      Pending Verification
    </div>
  );
};

export default VerificationBadge;