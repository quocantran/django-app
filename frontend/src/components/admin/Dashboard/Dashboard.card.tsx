"use client";
import { Card, Col, Row, Statistic } from "antd";
import React from "react";
import CountUp from "react-countup";

interface IProps {
  data: {
    usersRecord: number;
    companiesRecord: number;
    jobsRecord: number;
  };
}

const DashboardCard = (props: IProps) => {
  const { data } = props;
  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />;
  };
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} md={8}>
        <Card title="Tổng số người dùng" bordered={false}>
          <Statistic
            title="Số lượng người dùng trên hệ thống"
            value={data.usersRecord}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={24} md={8}>
        <Card title="Tổng số công ty" bordered={false}>
          <Statistic
            title="Số lượng công ty trên hệ thống"
            value={data.companiesRecord}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={24} md={8}>
        <Card title="Tổng số công việc" bordered={false}>
          <Statistic
            title="Số lượng công việc trên hệ thống"
            value={data.jobsRecord}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCard;
