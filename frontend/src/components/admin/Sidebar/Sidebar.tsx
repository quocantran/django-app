"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBriefcase,
  faBuilding,
  faChartLine,
  faIdCard,
  faLink,
  faPeopleGroup,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import SidebarItem from "./SidebarItem";
import { useAppSelector } from "@/lib/redux/hooks";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { isMobile } from "react-device-detect";

const cx = classNames.bind(styles);

const Sidebar = () => {
  const permissions = useAppSelector((state) => state.auth.user.permissions);
  const [menuItems, setMenuItems] = useState<any>([]);

  useEffect(() => {
    if (permissions?.length) {
      const viewCompany = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
      );

      const viewUser = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.USERS.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const viewJob = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.JOBS.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
      );

      const viewResume = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
      );

      const viewRole = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.ROLES.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      );

      const viewPermission = permissions.find(
        (item) =>
          item.api_path === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.api_path &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const MENU_ITEMS = [
        ...(viewUser
          ? [
              <SidebarItem
                key={1}
                title="User"
                href="/admin/user"
                icon={<FontAwesomeIcon icon={faUserCircle} />}
              />,
            ]
          : []),

        ...(viewCompany
          ? [
              <SidebarItem
                key={2}
                title="Companies"
                href="/admin/companies"
                icon={<FontAwesomeIcon icon={faBuilding} />}
              />,
            ]
          : []),

        ...(viewJob
          ? [
              <SidebarItem
                key={3}
                title="Jobs"
                href="/admin/jobs"
                icon={<FontAwesomeIcon icon={faBriefcase} />}
              />,
            ]
          : []),
        ...(viewResume
          ? [
              <SidebarItem
                key={4}
                title="Resumes"
                href="/admin/resumes"
                icon={<FontAwesomeIcon icon={faIdCard} />}
              />,
            ]
          : []),
        ...(viewPermission
          ? [
              <SidebarItem
                key={5}
                title="Permission"
                href="/admin/permissions"
                icon={<FontAwesomeIcon icon={faLink} />}
              />,
            ]
          : []),
        ...(viewRole
          ? [
              <SidebarItem
                key={6}
                title="Roles"
                href="/admin/roles"
                icon={<FontAwesomeIcon icon={faPeopleGroup} />}
              />,
            ]
          : []),
      ];
      setMenuItems(MENU_ITEMS);
    }
  }, [permissions]);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("title")}>
          <FontAwesomeIcon icon={faUser} />
          {!isMobile && <h4>Admin</h4>}
        </div>

        <div className={cx("content")}>
          <SidebarItem
            title="Home Page"
            href="/"
            icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
          />

          <SidebarItem
            title="Dashboard"
            href="/admin"
            icon={<FontAwesomeIcon icon={faChartLine} />}
          />

          {menuItems.map((item: any, index: number) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
