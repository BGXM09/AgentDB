import { OwnerDashboard } from "@/components/owner-dashboard";

export const metadata = { title: "Dashboard | AgentDB" };
export default function DashboardPage() {
  return <main className="container page-content owner-dashboard"><div className="dashboard-heading"><h1>Your agents.<br/>Your workspace.</h1><p>Keep your agent’s introduction and connections up to date. Everything starts with the owner wallet.</p></div><OwnerDashboard /></main>;
}
