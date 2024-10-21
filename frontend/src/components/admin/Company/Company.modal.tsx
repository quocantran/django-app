"use client";
import { Form, Row, Col, message, Upload, notification } from "antd";
import {
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { ICompany } from "@/types/backend";
import { createCompany, updateCompany } from "@/config/api";
import { useEffect, useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill, this will make it only load in the browser
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: ICompany | null;
  setDataInit: (v: ICompany | null) => void;

  reload: boolean;

  setReload: (v: boolean) => void;
}

export interface ICompanySelect {
  label: string;
  value: string;
  key?: string;
}

const CompanyModal = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit, reload, setReload } =
    props;

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    if (dataInit) {
      setValue(dataInit.description || "");
    }
  }, [dataInit]);

  useEffect(() => {
    if (openModal) {
      setLogo(dataInit?.logo || "");
    }
  }, [openModal]);

  const handleUploadFile = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    } else if (info.file.status === "done") {
      setLoadingUpload(false);
      setLogo(info.file.response.data.url);
    } else if (info.file.status === "error") {
      setLoadingUpload(false);
      notification.error({
        message: "Upload file thất bại",
        description: "Chỉ chấp nhận định dạng .png, .jpg, .jpeg, .webp",
      });
    }
  };

  const handleSubmit = async (valuesForm: any) => {
    const { name, address } = valuesForm;
    if (dataInit?.id) {
      //update
      const company = {
        id: dataInit.id,
        name,
        address,
        description: value,
        logo: logo,
      };

      try {
        const res = await updateCompany(company.id, company);

        if (res) {
          message.success(`Cập nhật công ty (${company.name}) thành công`);
          setOpenModal(false);
          setDataInit(null);
          setValue("");
          setReload(!reload);
          setLogo("");
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
      const company: ICompany = {
        name,
        address,
        description: value,
        logo: logo,
      };
      const { id, ...dataCreate } = company;

      try {
        const res = await createCompany(dataCreate);

        company.id = res?.data.id;

        if (res.data) {
          message.success(`Thêm mới công ty (${company.name}) thành công`);
          setOpenModal(false);
          setValue("");
          setReload(!reload);
          setLogo("");
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
    <>
      {openModal && (
        <ModalForm
          title={dataInit?.id ? "Cập nhật công ty" : "Tạo mới công ty"}
          open={openModal}
          modalProps={{
            onCancel: () => {
              setOpenModal(false);
              setDataInit(null);
              setValue("");
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
            <Col span={24}>
              <ProFormText
                label="Tên công ty"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập tên công ty"
              />
            </Col>

            <Col span={8}>
              <Form.Item labelCol={{ span: 24 }} label="Ảnh Logo" name="logo">
                <Upload
                  name="fileUpload"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  onChange={handleUploadFile}
                  multiple={false}
                  onPreview={() => {
                    window.open(logo);
                  }}
                  action={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/upload`}
                  defaultFileList={
                    dataInit?.logo
                      ? [
                          {
                            uid: "-1",
                            name: "logo.png",
                            status: "done",
                            url: dataInit.logo,
                          },
                        ]
                      : []
                  }
                >
                  <div>
                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}

                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={16}>
              <ProFormTextArea
                label="Địa chỉ công ty"
                name="address"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập địa chỉ công ty"
              />
            </Col>
            <ProCard
              title="Miêu tả"
              subTitle="mô tả công ty"
              headStyle={{ color: "#d81921" }}
              style={{ marginBottom: 20 }}
              headerBordered
              size="small"
              bordered
            >
              <Col span={24}>
                <ProFormTextArea
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                    },
                  ]}
                >
                  <ReactQuill
                    style={{ height: 400 }}
                    theme="snow"
                    value={value}
                    onChange={setValue}
                  />
                </ProFormTextArea>
              </Col>
            </ProCard>
          </Row>
        </ModalForm>
      )}
    </>
  );
};

export default CompanyModal;
