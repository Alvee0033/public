'use client';
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import BaseQuestion from './BaseQuestion';

export default function CodeWriting({ question, answer = '', onAnswer }) {
    const [testResults, setTestResults] = useState(null);

    const runTests = () => {
        try {
            const fn = new Function(`return ${answer}`)();
            const results = question.testCases.map(test => {
                const result = fn(...test.input);
                return {
                    input: test.input,
                    expected: test.expected,
                    actual: result,
                    passed: result === test.expected
                };
            });
            setTestResults(results);
        } catch (error) {
            setTestResults([{ error: error.message }]);
        }
    };

    return (
        <BaseQuestion number={question.number} text={question.text}>
            <div className="space-y-4">
                <Editor
                    height="300px"
                    defaultLanguage={question.language}
                    defaultValue={question.initialCode}
                    value={answer}
                    onChange={onAnswer}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        automaticLayout: true
                    }}
                />

                <div className="flex justify-between items-center">
                    <button
                        onClick={runTests}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Run Tests
                    </button>
                </div>

                {testResults && (
                    <div className="mt-4 space-y-2">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg ${result.error ? 'bg-red-50 text-red-700' :
                                        result.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}
                            >
                                {result.error ? (
                                    <div>Error: {result.error}</div>
                                ) : (
                                    <>
                                        <div>Input: {JSON.stringify(result.input)}</div>
                                        <div>Expected: {result.expected}</div>
                                        <div>Actual: {result.actual}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BaseQuestion>
    );
} 