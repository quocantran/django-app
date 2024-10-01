"use client";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Header.module.scss";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Dropdown,
  Skeleton,
  Space,
  message,
  Button,
  notification,
} from "antd";
import {
  ContactsOutlined,
  DashOutlined,
  FileWordOutlined,
  InsertRowLeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { setLogoutAction } from "@/lib/redux/slice/auth.slice";
import ManageUser from "./User.manage";
import { logout } from "@/config/api";
const cx = classnames.bind(styles);

interface IMessageFromServer {
  message: string;
  companyName: string;
  job: string;
  type: string;
}

const Header: React.FC = () => {
  const isAuth = useAppSelector((state) => state?.auth.isAuthenticated);
  const user = useAppSelector((state) => state?.auth.user);
  const [open, setOpen] = useState<boolean>(false);
  const loading = useAppSelector((state) => state?.auth.isLoading);
  const [isNoti, setIsNoti] = useState<boolean>(false);
  const [isNewNoti, setIsNewNoti] = useState<boolean>(false);
  const userRole = user?.role.name;
  const notiRef = useRef<HTMLDivElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    const data = await logout();

    dispatch(setLogoutAction({}));
    window.location.reload();
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setIsNoti(true);
    setIsNewNoti(false);
  };

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setIsNoti(false);
      }
    });

    return () => {
      document.body.removeEventListener("click", () => {});
    };
  }, []);

  const itemsDropdown = [
    {
      label: (
        <label onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          Quản lý tài khoản
        </label>
      ),
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    userRole !== "NORMAL_USER" && {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: <Link href={"/jobs"}>Tìm việc làm</Link>,
      key: "jobs",
      icon: <FileWordOutlined />,
    },
    {
      label: <Link href={"/companies"}>Danh sách công ty</Link>,
      key: "companies",
      icon: <InsertRowLeftOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Link href="/">
          <img className={cx("logo")} src="/images/logo.webp" alt="logo" />
        </Link>
        <div className={cx("header-left")}>
          <div className={cx("header-item")}>
            <Link href="/jobs">TÌM VIỆC LÀM</Link>
          </div>
          <div className={cx("header-item")}>
            <Link href="/companies">DANH SÁCH CÔNG TY</Link>
          </div>
        </div>

        {loading ? (
          <Skeleton.Avatar style={{ width: "50px", height: "50px" }} active />
        ) : (
          <div className={cx("header-right")}>
            {isAuth ? (
              <div className={cx("right-items")}>
                <Dropdown
                  menu={{ items: itemsDropdown as any }}
                  trigger={["click"]}
                  arrow={true}
                >
                  <Space style={{ cursor: "pointer" }}>
                    <span>Xin chào {user?.name}</span>
                    <Avatar>
                      {" "}
                      {user?.name?.substring(0, 2)?.toUpperCase()}{" "}
                    </Avatar>
                  </Space>
                </Dropdown>
              </div>
            ) : (
              <>
                <div className={cx("header-item")}>
                  <Link href="/login">ĐĂNG NHẬP</Link>
                </div>
                <div className={cx("header-item")}>
                  <Link href="/register">ĐĂNG KÝ</Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <ManageUser open={open} setOpen={setOpen} />
      <>{contextHolder}</>
    </div>
  );
};

export default Header;
