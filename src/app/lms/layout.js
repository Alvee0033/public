export const dynamic = "force-dynamic";

import LmsLayoutClient from "./LmsLayoutClient";

export default function Layout({ children }) {
  return <LmsLayoutClient>{children}</LmsLayoutClient>;
}
