import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { IncomeOverview } from "../../components/income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUserAuth } from "../../hooks/useUserAuth";
import Modal from "../../components/ui/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/income/IncomeList";
import DeleteAlert from "../../components/ui/DeleteAlert";
import {
  BarChartSkeleton,
  RecentTransactionsSkeleton
} from "../../components/dashboard/DashboardSkeletons";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  //getting income data
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    // Temporary 1 second delay for testing skeleton loading
    //await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Error fetching income data", error);
    } finally {
      setLoading(false);
    }
  };

  // handling add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    //valirdation checks
    if (!source.trim()) {
      toast.error("Please enter income source");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    if (!date) {
      toast.error("Please select date");
      return;
    }

    // Temporary 1 second delay for testing skeleton loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income",
        error.response?.data?.message || error.message
      );
    }
  };

  // handling delete income
  const handleDeleteIncome = async (id) => {
    // Temporary 1 second delay for testing skeleton loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income",
        error.response?.data?.message || error.message
      );
    }
  };

  // handling download income details
  const handleDownloadIncomeDetails = async () => {
    // Temporary 1 second delay for testing skeleton loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob"
        }
      );

      //url for the blob file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details", error);
      toast.error("Error downloading income details");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="mx-auto my-5">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            {loading ? (
              <BarChartSkeleton />
            ) : (
              <IncomeOverview
                transactions={incomeData}
                onAddIncome={() => setOpenAddIncomeModal(true)}
              />
            )}
          </div>

          {loading ? (
            <RecentTransactionsSkeleton />
          ) : (
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onDownload={handleDownloadIncomeDetails}
            />
          )}
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => handleDeleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
