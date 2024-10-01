"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchAccount } from "@/lib/redux/slice/auth.slice";
import { Skeleton, message } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";

interface IProps {
  children: React.ReactNode;
}

const LayoutApp = (props: IProps) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {
    dispatch(fetchAccount());
  }, [pathname]);

  return <>{children}</>;
};

export default LayoutApp;
