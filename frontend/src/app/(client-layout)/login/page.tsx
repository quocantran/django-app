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
              label="Email (test_admin@gmail.com)"
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
                label="Mật khẩu (123456)"
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

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`}
              className={cx("social-login")}
            >
              <div className={cx("gsi-material-button")}>
                <div className={cx("gsi-material-button-state")}></div>
                <div className={cx("gsi-material-button-content-wrapper")}>
                  <div className={cx("gsi-material-button-icon")}>
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ display: "block" }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className={cx("gsi-material-button-contents")}>
                    Sign in with Google
                  </span>
                  <span style={{ display: "none" }}>Sign in with Google</span>
                </div>
              </div>
            </a>

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
