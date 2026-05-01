"use client";

import { useEffect } from "react";
import { useState } from "react";

export default function CodeWriting({ question, answer = "", onAnswer }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [code, setCode] = useState(answer || "");

  const runTests = () => {
    setIsRunning(true);
    try {
      const fn = new Function(`return ${code}`)();
      const results = question.testCases.map((test) => ({
        input: test.input,
        expected: test.expected,
        actual: fn(...test.input),
        passed: fn(...test.input) === test.expected,
      }));
      setTestResults(results);
    } catch (error) {
      setTestResults([{ error: error.message }]);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    onAnswer(code);
  }, [code, onAnswer]);

  if (!question) return null;

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">
        {question.question}
      </div>

      <div className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.question_score}
      </div>

      <div className="flex justify-end">
        <button
          onClick={runTests}
          disabled={isRunning || !code}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Tests"}
        </button>
      </div>

      {testResults && (
        <div className="mt-4 space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                result.error
                  ? "bg-red-100 text-red-700"
                  : result.passed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result.error ? (
                <p>Error: {result.error}</p>
              ) : (
                <>
                  <p>Input: {JSON.stringify(result.input)}</p>
                  <p>Expected: {JSON.stringify(result.expected)}</p>
                  <p>Actual: {JSON.stringify(result.actual)}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
