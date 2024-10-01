"use client";
import { Tooltip } from "antd";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

interface IProps {
  data: {
    usersRecord: number;
    companiesRecord: number;
    jobsRecord: number;
  };
}

const DashboardChart = (props: IProps) => {
  const { data } = props;
  const dataChart = [
    {
      month: "2024.02",
      "Số lượng người dùng": 0,
      "Số lượng công việc": 0,
      "Số lượng công ty": 0,
      "Tổng số lượng": 0,
    },
    {
      month: "2024.03",
      "Số lượng người dùng": data.usersRecord,
      "Số lượng công việc": data.jobsRecord,
      "Số lượng công ty": data.companiesRecord,
      "Tổng số lượng":
        data.usersRecord + data.jobsRecord + data.companiesRecord,
    },
  ];
  const total = dataChart.reduce((sum, item) => sum + item["Tổng số lượng"], 0);

  const formatYAxis = (tickItem: any) => {
    return `${total * tickItem}`;
  };
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      className="dashboard-chart"
    >
      <div>
        <AreaChart
          width={700}
          height={500}
          data={dataChart}
          stackOffset="expand"
          margin={{
            top: 50,
            right: 30,
            left: 30,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatYAxis}>
            <Label offset={-30} value="Tổng số lượng" position="insideTop" />
          </YAxis>

          <Legend />

          <Area
            type="monotone"
            dataKey="Số lượng người dùng"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="Số lượng công việc"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="Số lượng công ty"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
          />
        </AreaChart>
      </div>

      <div>
        <BarChart
          width={700}
          height={500}
          data={dataChart}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Số lượng người dùng" fill="#8884d8" />
          <Bar dataKey="Số lượng công việc" fill="#82ca9d" />
          <Bar dataKey="Số lượng công ty" fill="#ffc658" />
        </BarChart>
      </div>
    </div>
  );
};

export default DashboardChart;
