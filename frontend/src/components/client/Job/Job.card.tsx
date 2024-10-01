"use client";

import React from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/CompanyInfo.module.scss";
import { ICompany, IJob } from "@/types/backend";
import { formatNumberToMillions } from "@/helpers/index";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface IProps {
  job: IJob;
  company: ICompany;
}

const cx = classnames.bind(styles);

const JobCard = (props: IProps) => {
  const { job, company } = props;

  const navigate = useRouter();

  return (
    <div
      onClick={() => navigate.push(`/jobs/${job.id}`)}
      className={cx("job-item")}
    >
      <img src={company.logo} alt="logo" />
      <div className={cx("job-content")}>
        <div className={cx("body-content")}>
          <div className={cx("title-block")}>
            <div>
              <h3 className={cx("job-name")}>{job.name}</h3>
              <p className={cx("job-company")}>{company.name}</p>
            </div>

            <div className={cx("box-right")}>
              <p className={cx("salary")}>
                {formatNumberToMillions(job.salary)} triệu
              </p>
            </div>
          </div>
        </div>

        <div className={cx("job-info")}>
          <div className={cx("job-location")}>
            <span>{job.location}</span>
            <span>{dayjs(job.end_date).format("DD/MM/YYYY")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
