"use client";

import { Button } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";

const DashboardButton = () => {
  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8888/api/v1/reports/export",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Thống-Kê.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to export statistics");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "right", marginBottom: "30px" }}>
      <Button
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size="large"
        onClick={handleExport}
      >
        Tải xuống dữ liệu thống kê
      </Button>
    </div>
  );
};

export default DashboardButton;
