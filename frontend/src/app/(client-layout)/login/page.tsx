"use client";
import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd";
import classNames from "classnames/bind";
import styles from "../../../styles/Login.module.scss";
import Link from "next/link";
import { callLogin, createOtp } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUserLoginInfo } from "@/lib/redux/slice/auth.slice";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

type FieldType = {
  email: string;
  password: string;
  remember?: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const navigate = useRouter();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        navigate.push("/");
        notification.error({
          message: "Bạn đã đăng nhập rồi!",
        });
        return;
      } else {
        setShow(true);
      }
    }
  }, [isLoading]);

  const handleClick = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (isForgotPassword) {
      const { email } = values;
      setLoading(true);
      const res = await createOtp(email);
      const data = await res.json();

      if (!res.ok) {
        notification.error({
          message: "Có lỗi xảy ra!",
          description: data.message,
        });
        setLoading(false);
        return;
      }

      notification.success({
        message: "Thành công!",
        description:
          "Vui lòng kiểm tra email của bạn (có thể mất từ 1 đến 5 phút)",
      });
      setLoading(false);
    } else {
      const { email, password } = values;
      setLoading(true);
      const res = await callLogin(email, password);

      if (res?.data) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("userId", res.data.user.id);
        dispatch(setUserLoginInfo(res.data.user));
        setLoading(false);
        message.success("Đăng nhập tài khoản thành công!");
        navigate.push("/");
      } else {
        setLoading(false);
      }
    }
  };

  return (
    show && (
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <h1 className={cx("title")}>
            {isForgotPassword ? "Quên mật khẩu" : "Đăng nhập"}
          </h1>
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              required
              rules={[
                { required: true, message: "Email không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>

            {isForgotPassword ? (
              <></>
            ) : (
              <Form.Item
                labelCol={{ span: 24 }}
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isForgotPassword ? "Xác nhận" : "Đăng nhập"}
              </Button>
            </Form.Item>
            <Divider>Or</Divider>

            <p className="text text-normal">
              Chưa có tài khoản ?
              <span>
                <Link href="/register"> Đăng Ký </Link>
              </span>
            </p>

            <p style={{ marginTop: "10px" }} className="text text-normal">
              {isForgotPassword ? "" : "Quên mật khẩu ?"}
              <span>
                <Link href="#" onClick={handleClick}>
                  {" "}
                  {isForgotPassword ? "Trở lại đăng nhập" : "Nhấn vào đây"}
                </Link>
              </span>
            </p>
          </Form>
        </div>
      </div>
    )
  );
};

export default Login;
