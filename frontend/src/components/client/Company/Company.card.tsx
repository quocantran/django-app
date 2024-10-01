"use client";
import { ICompany } from "@/types/backend";
import { Card, Pagination } from "antd";
import React from "react";
import styles from "../../../styles/CompanyClient.module.scss";
import classNames from "classnames/bind";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

interface IProps {
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: ICompany;
}

const CompanyCard = (props: IProps) => {
  const { meta, result } = props;
  const navigate = useRouter();
  return (
    <div>
      <Card onClick={() => navigate.push(`/companies/${result.id}`)} hoverable>
        <div className={cx("card-header")}>
          <img src={result.logo} alt="logo" />
          <div className={cx("card-name")}>
            <p>{result.name}</p>
            <span>{result.address}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyCard;
