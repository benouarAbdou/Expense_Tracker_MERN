import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
const Home = () => {
  useUserAuth();
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="flex flex-col items-center justify-center h-screen text-2xl font-bold text-gray-700">
        Welcome to the Expense Tracker Dashboard!
      </div>
    </DashboardLayout>
  );
};

export default Home;
