import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DataSourceNotice from "./DataSourceNotice";

export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <main className="px-5 py-6 md:px-8 md:py-8 max-w-5xl">
          <DataSourceNotice />
          {children}
        </main>
      </div>
    </div>
  );
}
