// app/dashboard/page.js (server component)
import { headers } from "next/headers";
import DashboardPage from "./DashboardPage";

export default function Page({ searchParams }) {
  const cookieHeader = headers().get("cookie") || "";
  let sessionToken = null;

  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "next-auth.session-token") {
      sessionToken = decodeURIComponent(value);
    }
  });

  return <DashboardPage  />;
}
