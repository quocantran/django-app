"use client";

import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/JobInfo.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ResumeModalClient from "../Resume/ResumeClient.modal";
import { IJob } from "@/types/backend";
import { useAppSelector } from "@/lib/redux/hooks";
import { message } from "antd";

const cx = classNames.bind(styles);

interface IProps {
  dataInit: IJob | null;
}

const JobButton = (props: IProps) => {
  const { dataInit } = props;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const handleClick = () => {
    if (!isAuth) {
      message.error("Vui lòng đăng nhập để ứng tuyển!");
      return;
    }
    setOpenModal(true);
  };
  return (
    <>
      <div onClick={handleClick} className={cx("job-btn")}>
        <FontAwesomeIcon icon={faPaperPlane} />
        <span>Ứng tuyển ngay</span>
      </div>

      <ResumeModalClient
        dataInit={dataInit}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default JobButton;
