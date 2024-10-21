"use client";

import { Button, Result, Skeleton, message, notification } from "antd";

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
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuth) {
        navigate.push("/login", { scroll: false });
        return;
      }
      if (role === "NORMAL_USER") {
        setIsShow(true);
      }
      setShouldRender(true);
    }
  }, [loading]);

  return loading ? (
    <Skeleton />
  ) : isShow ? (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Result
          title="Truy cập bị từ chối"
          status={"403"}
          subTitle="Bạn không có quyền truy cập trang này!"
        />
        <Button type="primary" onClick={() => navigate.push("/")}>
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  ) : (
    <>{shouldRender && children}</>
  );
};

export default LayoutAdmin;
