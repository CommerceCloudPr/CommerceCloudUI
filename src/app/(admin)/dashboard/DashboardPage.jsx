// app/dashboard/DashboardPage.jsx (client component)
'use client';
import { useEffect } from "react";
import { Row } from "react-bootstrap";
import Stats from "./components/Stats";
import Conversions from "./components/Conversions";
import Orders from "./components/Orders";
import { useSession } from "next-auth/react";

export default function DashboardPage({  }) {

  const { data: session } = useSession();

  useEffect(() => {
    localStorage.setItem("session_token", session?.accessToken);
  }, []);

  return (
    <Row>
      <Stats />
      <Conversions />
      <Orders />
    </Row>
  );
}
