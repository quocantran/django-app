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
  Skeleton,
} from "antd";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { ICompany, IPermission, IRole } from "@/types/backend";
import { useEffect, useState } from "react";
import ModuleApi from "./RoleModule.api";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  createRole,
  fetchPermissions,
  fetchRoleById,
  updateRole,
} from "@/config/api";
import { CheckSquareOutlined } from "@ant-design/icons";
import _ from "lodash";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reload: boolean;
  setReload: (v: boolean) => void;
  isEdit: boolean;
  setIsEdit: (v: boolean) => void;
  dataInit: IRole | null;
}

const RoleModal = (props: IProps) => {
  const {
    openModal,
    setOpenModal,
    reload,
    setReload,
    isEdit,
    setIsEdit,
    dataInit,
  } = props;

  const [form] = Form.useForm();
  const [singleRole, setSingleRole] = useState<IRole | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    if (openModal && isEdit) {
      setIsFetching(true);
      const fetchRoleUser = async () => {
        const res = await fetchRoleById(dataInit?.id);
        if (res?.data) {
          setSingleRole(res.data);
          setIsFetching(false);
        }
      };
      fetchRoleUser();
    }
  }, [openModal]);

  useEffect(() => {
    const fetchPermissionRole = async () => {
      const res = await fetchPermissions(1, "", "", 100);
      if (res?.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    fetchPermissionRole();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && singleRole?.id) {
      form.setFieldsValue({
        name: singleRole.name,
        is_active: singleRole.is_active,
        description: singleRole.description,
      });
      const userPermissions = groupByPermission(singleRole.permissions);

      listPermissions.forEach((data) => {
        let allCheck = true;
        data.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === data.module);

          if (temp) {
            const isExist = temp.permissions.find((k) => k.id === y.id);
            if (isExist) {
              form.setFieldValue(["permissions", y.id as string], true);
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        });
        form.setFieldValue(["permissions", data.module], allCheck);
      });
    }
  }, [listPermissions, singleRole]);

  const handleReset = () => {
    setIsFetching(false);
    setOpenModal(false);
    setSingleRole(null);
    setIsEdit(false);
    setReload(!reload);
  };

  const submitRole = async (valuesForm: any) => {
    const { description, is_active, name, permissions } = valuesForm;
    const checkedPermissions = [];
    setIsFetching(true);
    if (permissions) {
      for (const key in permissions) {
        if (key.match(/^[0-9a-fA-F]{24}$/) && permissions[key] === true) {
          checkedPermissions.push(key);
        }
      }
    }

    if (singleRole?.id) {
      //update
      const role = {
        name,
        description,
        is_active,
        permissions: checkedPermissions,
      };
      const res = await updateRole(singleRole.id, role);
      if (res) {
        message.success("Cập nhật role thành công");
        form.resetFields();
        handleReset();
      }
    } else {
      //create

      const role = {
        name,
        description,
        is_active,
        permissions: checkedPermissions,
      };
      const res = await createRole(role);
      if (res) {
        message.success("Thêm mới role thành công");
        form.resetFields();
        handleReset();
      }
    }
  };

  return (
    <>
      {
        <ModalForm
          title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
          open={openModal}
          modalProps={{
            onCancel: () => {
              form.resetFields();
              setSingleRole(null);
              setIsEdit(false);
              setOpenModal(false);
            },
            destroyOnClose: true,

            keyboard: false,
            maskClosable: false,
            okText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
            cancelText: "Hủy",
          }}
          form={form}
          loading={isFetching}
          onFinish={submitRole}
        >
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormText
                label="Tên Role"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập name"
              />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProFormSwitch
                label="Trạng thái"
                name="is_active"
                checkedChildren="ACTIVE"
                unCheckedChildren="INACTIVE"
                initialValue={true}
                fieldProps={{
                  defaultChecked: true,
                }}
              />
            </Col>

            <Col span={24}>
              <ProFormTextArea
                label="Miêu tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập miêu tả role"
                fieldProps={{
                  autoSize: { minRows: 2 },
                }}
              />
            </Col>
            <Col span={24}>
              <ProCard
                title="Quyền hạn"
                subTitle="Các quyền hạn được phép cho vai trò này"
                headStyle={{ color: "#d81921" }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <ModuleApi form={form} listPermissions={listPermissions} />
              </ProCard>
            </Col>
          </Row>
        </ModalForm>
      }
    </>
  );
};

export default RoleModal;
