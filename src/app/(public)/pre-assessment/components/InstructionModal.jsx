import { Button } from '@/components/ui/button';

const InstructionModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <h2 className="text-2xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">
            Pre-Assessment Instructions
          </span>
        </h2>

        <div className="space-y-4 mb-6">
          <p>Please read the following instructions carefully:</p>

          <ul className="list-disc pl-5 space-y-2">
            <li>The assessment consists of multiple-choice questions.</li>
            <li>You will have a limited time to complete the assessment.</li>
            <li>Once started, you cannot pause the assessment.</li>
            <li>Answer all questions to the best of your ability.</li>
            <li>
              Your results will help us personalize your learning experience and
              recommend courses for you.
            </li>
          </ul>

          <p className="font-medium">
            Note: This is a one-time assessment. You won&apos;t be able to retake it
            once completed.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            size="lg"
            className="hover:scale-105 text-white rounded-xl px-8 py-3 text-lg border-none sm:py-5"
            style={{
              background:
                'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
            }}
          >
            I Understand, Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;
