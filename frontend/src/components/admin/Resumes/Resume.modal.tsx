"use client";
import { Form, message, Select, Descriptions, notification } from "antd";
import {
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { ICompany, IResume } from "@/types/backend";
import { createCompany, updateCompany, updateResumeStatus } from "@/config/api";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: IResume | null;
  setDataInit: (v: IResume | null) => void;

  reload: boolean;

  setReload: (v: boolean) => void;
}

const ResumeModal = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit, reload, setReload } =
    props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleChangeStatus = async () => {
    setIsSubmit(true);

    const status = form.getFieldValue("status");
    const res = await updateResumeStatus(dataInit?.id, status);
    if (res.data) {
      message.success("Update Resume status thành công!");
      setDataInit(null);
      setOpenModal(false);
      setReload(!reload);
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (dataInit) {
      form.setFieldValue("status", dataInit.status);
    }
    return () => form.resetFields();
  }, [dataInit]);

  return (
    <>
      {
        <ModalForm
          title={"Cập nhật trạng thái CV"}
          open={openModal}
          modalProps={{
            onCancel: () => {
              setOpenModal(false);
              setDataInit(null);
            },

            destroyOnClose: true,

            keyboard: false,
            maskClosable: false,
            okText: <>{"Cập nhật trạng thái CV"}</>,

            cancelText: "Hủy",
          }}
          initialValues={dataInit?.id ? dataInit : {}}
          onFinish={handleChangeStatus}
        >
          <Descriptions title="" bordered column={2} layout="vertical">
            <Descriptions.Item label="Thông tin hồ sơ">
              <a href={dataInit?.url} target="_blank" rel="noopener noreferrer">
                Xem hồ sơ
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Form form={form}>
                <Form.Item name={"status"}>
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={dataInit?.status}
                  >
                    <Option value="PENDING">PENDING</Option>
                    <Option value="REVIEWING">REVIEWING</Option>
                    <Option value="APPROVED">APPROVED</Option>
                    <Option value="REJECTED">REJECTED</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Descriptions.Item>
            <Descriptions.Item label="Tên Job">
              {dataInit?.job?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Tên Công Ty">
              {dataInit?.company?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dataInit && dataInit.created_at
                ? dayjs(dataInit.created_at).format("DD-MM-YYYY HH:mm:ss")
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sửa">
              {dataInit && dataInit.updated_at
                ? dayjs(dataInit.updated_at).format("DD-MM-YYYY HH:mm:ss")
                : ""}
            </Descriptions.Item>
          </Descriptions>
        </ModalForm>
      }
    </>
  );
};

export default ResumeModal;
