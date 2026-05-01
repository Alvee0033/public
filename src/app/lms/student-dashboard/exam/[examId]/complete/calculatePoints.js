import { examStore } from "@/app/lms/exam/[examId]/start/utils/exam-store";

export const calculateCorrectPoints = (examQuestions, examId,sq) => {
  const userAnswers = examStore.getExamProgress(examId).answers;
  let correctPoints = 0;

  for(let i=0;i<examQuestions.length;i++){
    if(examQuestions[i].master_exam_question_answer_type.name==='True/False' ||examQuestions[i].master_exam_question_answer_type.name==='Multiple Choice - Image - Single Answer' ||examQuestions[i].master_exam_question_answer_type.name==='Multiple Choice - Text - Single Answer'){
        for(let j=0;j<examQuestions[i].exam_question_details.length;j++){
            if(userAnswers[i]?.id==examQuestions[i]?.exam_question_details[j].id){
                if(examQuestions[i]?.exam_question_details[j]?.is_right_answer){
                    correctPoints+=sq;
                }
            }
        }
    }
    if(examQuestions[i].master_exam_question_answer_type.name==='Text Answer'||examQuestions[i].master_exam_question_answer_type.name==='Coding Answer'){
       if(userAnswers[i]== examQuestions[i].exam_question_details[0].answer){
              correctPoints+=sq;
       }
    }
    if(examQuestions[i].master_exam_question_answer_type.name==='Multiple Choice - Text - Multiple Answer' || examQuestions[i].master_exam_question_answer_type.name==='Multiple Choice - Image - Multiple Answer'){
        let correctAnswers = examQuestions[i]?.exam_question_details.filter((detail) => detail.is_right_answer).map((detail) => detail.id);
        let userSelectedAnswers = userAnswers[i]?.map((answer) => answer.id);
        if(correctAnswers.length === userSelectedAnswers?.length && correctAnswers.every((answerId) => userSelectedAnswers.includes(answerId))){

            correctPoints+=sq;
        }
    }
  }


  return correctPoints;
};