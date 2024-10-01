"use client";
import { Row, Col, message } from "antd";
import {
  ModalForm,
  ProCard,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { IPermission } from "@/types/backend";
import { createPermission, updatePermission } from "@/config/api";
import { ALL_MODULES } from "@/config/permissions";
interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;

  dataInit: IPermission | null;
  setDataInit: (v: IPermission | null) => void;

  reload: boolean;

  setReload: (v: boolean) => void;
}

const PermissionModal = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit, reload, setReload } =
    props;

  const handleSubmit = async (valuesForm: any) => {
    const { name, api_path, method, module } = valuesForm;
    if (dataInit?.id) {
      //update
      const permission = {
        name,
        api_path,
        method,
        module,
      };

      const res = await updatePermission(dataInit.id, permission);
      if (res.data) {
        message.success(`Cập nhật quyền hạn ${permission.name} thành công`);
        setOpenModal(false);
        setReload(!reload);
      }
    } else {
      //create
      const permission = {
        name,
        api_path,
        method,
        module,
      };
      const res = await createPermission(permission);
      if (res.data) {
        message.success(`Thêm mới quyền hạn ${permission.name} thành công`);
        setOpenModal(false);
        setReload(!reload);
      }
    }
  };

  return (
    <>
      {
        <ModalForm
          title={dataInit?.id ? "Cập nhật quyền hạn" : "Tạo mới quyền hạn"}
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
                label="Tên Permission"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập name"
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText
                label="API Path"
                name="api_path"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập path"
              />
            </Col>

            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormSelect
                name="method"
                label="Method"
                valueEnum={{
                  GET: "GET",
                  POST: "POST",
                  PUT: "PUT",
                  PATCH: "PATCH",
                  DELETE: "DELETE",
                }}
                placeholder="Please select a method"
                rules={[{ required: true, message: "Vui lòng chọn method!" }]}
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormSelect
                name="module"
                label="Thuộc Module"
                valueEnum={ALL_MODULES}
                placeholder="Please select a module"
                rules={[{ required: true, message: "Vui lòng chọn module!" }]}
              />
            </Col>
          </Row>
        </ModalForm>
      }
    </>
  );
};

export default PermissionModal;
