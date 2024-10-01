"use server";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Dashboard.module.scss";
import DashboardCard from "@/components/admin/Dashboard/Dashboard.card";
import { countCompanies, countJobs, countUsers, fetchJobs } from "@/config/api";
import DashboardChart from "@/components/admin/Dashboard/Dashboard.chart";

const cx = classNames.bind(styles);

const Admin = async () => {
  const jobsRecord = await countJobs();
  const usersRecord = await countUsers();
  const companiesRecord = await countCompanies();
  const data = {
    jobsRecord: jobsRecord.data as number,
    usersRecord: usersRecord.data as number,
    companiesRecord: companiesRecord.data as number,
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <DashboardCard data={data} />
      </div>
      <DashboardChart data={data} />
    </div>
  );
};

export default Admin;
