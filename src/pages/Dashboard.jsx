import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (profileLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-2 text-xs text-gray-500">
          <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden text-[0.7rem] sm:text-[0.75rem] md:text-sm">
      {}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
