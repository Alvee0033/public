import {
  AudioQuestion,
  CodeWriting,
  DragDrop,
  FillBlank,
  HotspotQuestion,
  ImageChoice,
  MultipleChoiceMultiple,
  MultipleChoiceSingle,
  MultipleImagesMultiple,
  TrueFalse,
  VideoQuestion,
  WriteDescriptive,
} from "@/app/lms/exam/[examId]/start/(c)/questions";

export function renderQuestion(
  question,
  currentQuestion,
  answers,
  handleAnswer
) {
  switch (question.master_exam_question_answer_type.name) {
    case 'Multiple Choice - Text - Single Answer':
      return (
        <MultipleChoiceSingle
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Multiple Choice - Text - Multiple Answer':
      return (
        <MultipleChoiceMultiple
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'True/False':
      return (
        <TrueFalse
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Multiple Choice - Image - Multiple Answer':
      return (
        <MultipleImagesMultiple
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case "Multiple Choice - Image - Single Answer":
      return (
        <ImageChoice
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Text Answer':
      return (
        <WriteDescriptive
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Video Answer':
      return (
        <VideoQuestion
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Audio Answer':
      return (
        <AudioQuestion
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Coding Answer':
      return (
        <CodeWriting
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 12:
      return (
        <FillBlank
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Find Hotspot':
      return (
        <HotspotQuestion
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    case 'Drag and Drop':
      return (
        <DragDrop
          question={question}
          answer={answers[currentQuestion]}
          onAnswer={handleAnswer}
        />
      );
    default:
      return (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
          Unsupported question type (ID:{" "}
          {question.master_exam_question_answer_type_id})
        </div>
      );
  }
}
