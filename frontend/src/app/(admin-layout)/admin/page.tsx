"use server";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Dashboard.module.scss";
import DashboardCard from "@/components/admin/Dashboard/Dashboard.card";
import {
  countCompanies,
  countJobs,
  countUsers,
  fetchJobs,
  fetchReports,
} from "@/config/api";
import DashboardChart from "@/components/admin/Dashboard/Dashboard.chart";
import { IReport } from "@/types/backend";
import DashboardButton from "@/components/admin/Dashboard/Dashboard.button";

const cx = classNames.bind(styles);

const Admin = async () => {
  const jobsRecord = await countJobs();
  const usersRecord = await countUsers();
  const companiesRecord = await countCompanies();
  const reportsRecord = await fetchReports();
  const data = {
    jobsRecord: jobsRecord.data as number,
    usersRecord: usersRecord.data as number,
    companiesRecord: companiesRecord.data as number,
    reportsRecord: reportsRecord.data as IReport,
  };
  return (
    <div className={cx("wrapper")}>
      <DashboardButton />
      <div className={cx("container")}>
        <DashboardCard data={data} />
      </div>
      <DashboardChart data={data} />
    </div>
  );
};

export default Admin;
