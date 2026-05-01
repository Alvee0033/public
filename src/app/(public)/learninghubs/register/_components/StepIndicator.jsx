"use client";

const STEPS = [
  { label: "Hub Profile", description: "Basic info" },
  { label: "Location", description: "Address & map pin" },
  { label: "Documents", description: "KYC upload" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isComplete = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          return (
            <div key={stepNum} className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  isComplete
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-white border-green-500 text-green-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isComplete ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-green-600" : isComplete ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">{step.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
