import ExamSecurityWrapper from "./components/exam-security-wrapper";

export default function ExamLayout({ children }) {
  return <ExamSecurityWrapper>{children}</ExamSecurityWrapper>;
}
