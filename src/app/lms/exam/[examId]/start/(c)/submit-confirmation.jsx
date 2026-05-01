"use client";

export default function SubmitConfirmation({
    examData,
    answers,
    isSubmitting,
    onCancel,
    onConfirm
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Submit Exam?</h3>
                <p className="text-gray-600 mb-6">
                    You have answered {Object.keys(answers).length} out of{" "}
                    {examData?.exam_questions?.length} questions. Are you sure you want to
                    submit?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Exam"}
                    </button>
                </div>
            </div>
        </div>
    );
} 