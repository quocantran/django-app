"use client";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/Sidebar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMobile } from "react-device-detect";

const cx = classNames.bind(styles);

interface IProps {
  icon: any;
  title: string;
  href: string;
}

const SidebarItem = (props: IProps) => {
  const { icon, title, href } = props;
  const pathname = usePathname();

  const is_active = pathname === href;
  const linkClass = cx("item", { active: is_active });
  return (
    <div className={linkClass}>
      <Link href={href}>
        <div className={cx("nav-item")}>
          {icon}
          {!isMobile && <span>{title}</span>}
        </div>
      </Link>
    </div>
  );
};

export default SidebarItem;
