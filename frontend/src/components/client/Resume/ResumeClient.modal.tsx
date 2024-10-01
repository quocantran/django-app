"use client";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  Upload,
  notification,
} from "antd";
import { ModalForm, ProForm } from "@ant-design/pro-components";
import { IJob } from "@/types/backend";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { createResume } from "@/config/api";
interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: IJob | null;
}

const ResumeModalClient = (props: IProps) => {
  const { openModal, setOpenModal, dataInit } = props;
  const [url, setUrl] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const handleUploadFile = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    } else if (info.file.status === "done") {
      setLoadingUpload(false);
      setUrl(info.file.response.data.url);
    } else if (info.file.status === "error") {
      setLoadingUpload(false);
      notification.error({
        message: "Upload file thất bại",
        description: "Chỉ chấp nhận định dạng .png, .jpg, .jpeg, .webp",
      });
    }
  };

  const handleSubmit = async (valuesForm: any) => {
    const resume = {
      url: url,
      company: dataInit?.company?.id as string,
      job: dataInit?.id as string,
    };

    const res = await createResume(resume);
    if (res) {
      setOpenModal(false);
      message.success("Nộp hồ sơ thành công!");
    }
  };

  return (
    <>
      <ModalForm
        title={`Nộp hồ sơ cho công việc ${dataInit?.name}`}
        open={openModal}
        modalProps={{
          onCancel: () => {
            setOpenModal(false);
          },

          destroyOnClose: true,

          keyboard: false,
          maskClosable: false,
          okText: <>{"Nộp hồ sơ"}</>,
          cancelText: "Hủy",
        }}
        initialValues={dataInit?.id ? dataInit : {}}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProForm.Item label="Tên công việc" name="name">
              <Input readOnly />
            </ProForm.Item>
          </Col>

          <Col span={24}>
            <ProForm.Item label="Tên công ty" name="name">
              <Input value={dataInit?.company?.name} readOnly />
            </ProForm.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Upload CV (Chỉ chấp nhận định dạng .png, .jpg, .jpeg, .webp)"
              name="CV"
            >
              <Upload
                name="fileUpload"
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                onChange={handleUploadFile}
                multiple={false}
                onPreview={() => {
                  window.open(url);
                }}
                action={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`}
              >
                <div>
                  {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}

                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ResumeModalClient;
