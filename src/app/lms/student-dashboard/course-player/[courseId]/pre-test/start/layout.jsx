import PreTestSecurityWrapper from "./components/pre-test-security-wrapper";

export default function PreTestStartLayout({ children }) {
  return <PreTestSecurityWrapper>{children}</PreTestSecurityWrapper>;
}
