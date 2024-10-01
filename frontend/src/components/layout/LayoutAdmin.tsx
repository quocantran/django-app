"use client";

import { Skeleton, message, notification } from "antd";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

interface IProps {
  children: React.ReactNode;
}

const LayoutAdmin = (props: IProps) => {
  const { children } = props;
  const role = useAppSelector((state) => state.auth.user.role.name);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.isLoading);
  const navigate = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuth) {
        navigate.push("/login", { scroll: false });
        return;
      }
      if (role === "NORMAL_USER") {
        notification.error({
          message: "Unauthorized",
          description: "Bạn không có quyền truy cập vào trang này!",
        });
        setTimeout(() => {
          navigate.push("/");
        }, 2000);
        return;
      }
      setShouldRender(true);
    }
  }, [loading]);

  return loading ? <Skeleton /> : <>{shouldRender && children}</>;
};

export default LayoutAdmin;
