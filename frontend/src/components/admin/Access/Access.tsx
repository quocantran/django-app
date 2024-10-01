"use client";
import { useEffect, useState } from "react";
import { Result } from "antd";
import { useAppSelector } from "@/lib/redux/hooks";

interface IProps {
  hideChildren?: boolean;
  children: React.ReactNode;
  permission: { method: string; api_path: string; module: string };
}

const Access = (props: IProps) => {
  const { permission, hideChildren = false } = props;
  const [allow, setAllow] = useState<boolean>(true);

  const permissions = useAppSelector((state) => state.auth.user.permissions);

  useEffect(() => {
    if (permissions.length) {
      const check = permissions.find(
        (item: any) =>
          item.api_path === permission.api_path &&
          item.method === permission.method &&
          item.module === permission.module
      );
      if (check) {
        setAllow(true);
      } else setAllow(false);
    }
  }, [permissions]);

  return (
    <>
      {allow === true ? (
        <>{props.children}</>
      ) : (
        <>
          {hideChildren === false ? (
            <Result
              status="403"
              title="Truy cập bị từ chối"
              subTitle="Xin lỗi, bạn không có quyền truy cập thông tin này"
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Access;
