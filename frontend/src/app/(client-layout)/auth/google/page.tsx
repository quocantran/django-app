"use client";
import Loading from "@/app/(admin-layout)/admin/loading";
import { callFetchAccount } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/lib/redux/slice/auth.slice";
import { message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const GoogleAuth = (props: any) => {
  const searchParams = useSearchParams();

  const navigate = useRouter();

  const token = searchParams.get("token");

  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (!token || isAuth) {
        navigate.push("/");
        return;
      }

      const handleCheckAccount = async () => {
        const res = await callFetchAccount(token);

        if (res?.statusCode !== 200) {
          navigate.push("/");
          return;
        }

        localStorage.setItem("access_token", token);
        localStorage.setItem("userId", res.data?.user.id as string);
        dispatch(setUserLoginInfo(res.data?.user));
        message.success("Đăng nhập thành công!");
        navigate.push("/");
      };

      handleCheckAccount();
    }
  }, [isLoading]);

  return <></>;
};

export default GoogleAuth;
