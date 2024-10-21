"use client";
import { Modal, Input, Form, Row, Col, message, notification } from "antd";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "@/hooks/debounce.select";
import {
  createUser,
  fetchCompanies,
  fetchRoles,
  updateUser,
} from "@/config/api";
import { useEffect, useState } from "react";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: IUser | null;
  setDataInit: (v: IUser | null) => void;

  reload: boolean;

  setReload: (v: boolean) => void;
}

export interface ICompanySelect {
  label: string;
  value: string;
  key?: string;
}

const UserModal = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit, reload, setReload } =
    props;

  const [form] = Form.useForm();

  const [companies, setCompanies] = useState<ICompanySelect[]>([]);
  const [roles, setRoles] = useState<ICompanySelect[]>([]);

  async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
    const res = await fetchRoles();

    if (res && res.data) {
      const list = res.data.result;
      const data = list.map((item) => {
        return {
          label: item.name as string,
          value: item.id as string,
        };
      });
      return data;
    } else return [];
  }

  async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
    const res = await fetchCompanies();
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item.id as string,
        };
      });
      return temp;
    } else return [];
  }

  const handleSubmit = async (valuesForm: any) => {
    const { name, email, password, address, age, gender, role, company } =
      valuesForm;
    if (dataInit?.id) {
      //update
      const user = {
        id: dataInit.id,
        name,
        email,
        age,
        gender,
        address,
        role: role?.value,
        company: company?.value ?? dataInit.company?.id,
      };
      try {
        const res = await updateUser(user.id, user);
        if (res.data) {
          message.success("Cập nhật user thành công");
          setOpenModal(false);
          setDataInit(null);
          setReload(!reload);
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: res.message,
          });
        }
      } catch (err) {
        notification.error({
          message: "Có lỗi xảy ra",
          description: "Bạn không có quyền thực hiện thao tác này",
        });
      }
    } else {
      //create
      const user = {
        name,
        email,
        password,
        age,
        gender,
        address,
        role: role.value,
        company: company.value,
      };
      try {
        const res = await createUser(user);
        if (res.data) {
          message.success("Thêm mới user thành công");
          setOpenModal(false);
          setDataInit(null);
          setReload(!reload);
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: res.message,
          });
        }
      } catch (err) {
        notification.error({
          message: "Có lỗi xảy ra",
          description: "Bạn không có quyền thực hiện thao tác này",
        });
      }
    }
  };

  return (
    <ModalForm
      title={dataInit?.id ? "Cập nhật người dùng" : "Tạo mới người dùng"}
      open={openModal}
      modalProps={{
        onCancel: () => {
          setOpenModal(false);
          setDataInit(null);
        },

        destroyOnClose: true,

        keyboard: false,
        maskClosable: false,
        okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
        cancelText: "Hủy",
      }}
      initialValues={dataInit?.id ? dataInit : {}}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng không bỏ trống" },
              { type: "email", message: "Vui lòng nhập email hợp lệ" },
            ]}
            placeholder="Nhập email"
          />
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText.Password
            label="Password"
            name="password"
            disabled={dataInit?.id ? true : false}
            rules={[
              {
                required: !dataInit?.id ? true : false,
                message: "Vui lòng không bỏ trống",
              },
            ]}
            placeholder="Nhập password"
          />
        </Col>
        <Col lg={6} md={6} sm={24} xs={24}>
          <ProFormText
            label="Tên hiển thị"
            name="name"
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            placeholder="Nhập tên hiển thị"
          />
        </Col>
        <Col lg={6} md={6} sm={24} xs={24}>
          <ProFormDigit
            label="Tuổi"
            name="age"
            rules={[
              {
                required: true,
                message: "Vui lòng không bỏ trống",
              },
              {
                validator: (_, value) => {
                  if (value < 1 || value > 100) {
                    return Promise.reject(new Error("Vui lòng nhập lại tuổi"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            placeholder="Vui lòng nhập tuổi"
          />
        </Col>
        <Col lg={6} md={6} sm={24} xs={24}>
          <ProFormSelect
            name="gender"
            label="Giới Tính"
            valueEnum={{
              MALE: "male",
              FEMALE: "female",
              OTHER: "other",
            }}
            placeholder="Vui lòng chọn giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          />
        </Col>

        <Col lg={6} md={6} sm={24} xs={24}>
          <ProForm.Item
            name="role"
            label="Vai trò"
            rules={[
              {
                required: !dataInit?.id && true,
                message: "Vui lòng chọn vai trò!",
              },
            ]}
          >
            <DebounceSelect
              allowClear
              showSearch
              defaultValue={dataInit?.role?.name}
              value={roles}
              placeholder="Chọn vai trò"
              fetchOptions={fetchRoleList}
              onChange={(newValue: any) => {
                if (newValue?.length === 0 || newValue?.length === 1) {
                  setRoles(newValue as ICompanySelect[]);
                }
              }}
              style={{ width: "100%" }}
            />
          </ProForm.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProForm.Item
            name="company"
            label="Thuộc Công Ty"
            rules={[
              {
                required: !dataInit?.id && true,
                message: "Vui lòng chọn công ty!",
              },
            ]}
          >
            <DebounceSelect
              allowClear
              showSearch
              defaultValue={dataInit?.company?.name}
              value={companies}
              placeholder="Chọn công ty"
              fetchOptions={fetchCompanyList}
              onChange={(newValue: any) => {
                if (newValue?.length === 0 || newValue?.length === 1) {
                  setCompanies(newValue as ICompanySelect[]);
                }
              }}
              style={{ width: "100%" }}
            />
          </ProForm.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <ProFormText
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            placeholder="Nhập địa chỉ"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UserModal;
