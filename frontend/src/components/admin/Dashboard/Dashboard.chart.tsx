"use client";
import { IReport } from "@/types/backend";
import { Tooltip } from "antd";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface IProps {
  data: {
    usersRecord: number;
    companiesRecord: number;
    jobsRecord: number;
    reportsRecord: IReport;
  };
}

const DashboardChart = (props: IProps) => {
  const { data } = props;

  const currentData = {
    users: data.usersRecord,
    companies: data.companiesRecord,
    jobs: data.jobsRecord,
  };

  const previousData = {
    users: data.usersRecord - data.reportsRecord.user_count,
    companies: data.companiesRecord - data.reportsRecord.company_count,
    jobs: data.jobsRecord - data.reportsRecord.job_count,
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const dataChart = [
    {
      name: "7 ngày trước",
      users: previousData.users,
      companies: previousData.companies,
      jobs: previousData.jobs,
    },
    {
      name: "Hiện tại",
      users: currentData.users,
      companies: currentData.companies,
      jobs: currentData.jobs,
    },
  ];

  const pieData = [
    { name: "7 ngày trước", value: previousData.jobs },
    { name: "Hiện tại", value: currentData.jobs },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div>
      <h3
        style={{
          marginTop: "25px",
          textAlign: "center",
          fontWeight: "600",
          color: "rgb(1, 126, 183)",
        }}
      >
        So sánh số liệu hiện tại và 7 ngày trước
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "30px",
        }}
      >
        <div>
          <h3>Biểu đồ người dùng</h3>
          <LineChart width={500} height={500} data={dataChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label value="Thời gian" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis />
            <Tooltip showArrow />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </div>

        <div>
          <h3>Biểu đồ công ty</h3>
          <BarChart width={500} height={500} data={dataChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label value="Thời gian" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar barSize={100} values={"12"} dataKey="companies" fill="#82ca9d">
              {dataChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </div>

        <div>
          <h3>Biểu đồ công việc</h3>
          <PieChart width={500} height={500}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
