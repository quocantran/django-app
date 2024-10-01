"use client";
import { IPermission } from "@/types/backend";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deletePermission, fetchPermissions } from "@/config/api";
import Access from "../Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { colorMethod } from "@/config/utils";
import PermissionModal from "./Permission.modal";

interface IProps {
  permissions: IPermission[] | [];
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  reload: boolean;
  setReload: (v: boolean) => void;
  loading: boolean;
  setPermissons: (v: IPermission[]) => void;
  current: number;
}

const PermissionTable = (props: IProps) => {
  const {
    permissions,
    meta,
    reload,
    setReload,
    loading,
    setPermissons,
    current,
  } = props;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);
  const [search, setSearch] = useState<string>("");
  const [module, setModule] = useState<string>("");
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (permissions) setIsFetching(false);
  }, [permissions]);

  const columns: ColumnsType<IPermission> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: IPermission, b: IPermission) => a.name.localeCompare(b.name),
    },
    {
      title: "Api Endpoint",
      dataIndex: "api_path",
      key: "api_path",
      sorter: (a: IPermission, b: IPermission) =>
        a.api_path.localeCompare(b.api_path),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render(method: string) {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: "bold",
              marginBottom: 0,
              color: colorMethod(method as string),
            }}
          >
            {method || ""}
          </p>
        );
      },
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => dayjs(created_at).format("YYYY-MM-DD"),
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      key: "updated_at",
      sorter: (a: IPermission, b: IPermission) =>
        dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),

      render: (updated_at: string) => dayjs(updated_at).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",

      width: 50,
      render: (_value: any, entity: any, _index: any) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            />
          </Access>

          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa quyền hạn"}
              description={"Bạn có chắc chắn muốn xóa quyền hạn này ?"}
              onConfirm={async () => {
                await deletePermission(entity.id);
                setReload(!reload);
              }}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: 20,
                    color: "#ff4d4f",
                  }}
                />
              </span>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const onChange = async (pagination: any, filters: any, sorter: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams();
      params.set("page", pagination.current.toString());

      if (sorter && sorter.field && sorter.order) {
        const order = sorter.order === "ascend" ? "" : "-";
        params.set("sort", `${order}${sorter.field}`);
      } else {
        params.delete("sort");
      }
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async () => {
    setIsFetching(true);
    const res = await fetchPermissions(current, search);
    if (res) {
      setPermissons(res?.data?.result || []);
      setSearch("");
    }

    setIsFetching(false);
  };

  const handleChangeModule = (e: any) => {
    setModule(e.target.value);
  };

  const handleSubmitModule = async () => {
    setIsFetching(true);
    const res = await fetchPermissions(current, "", module);
    if (res) {
      setPermissons(res?.data?.result || []);
      setModule("");
    }

    setIsFetching(false);
  };

  const HeaderTable = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách quyền hạn</span>

        <div>
          <Input
            onChange={handleChange}
            value={search}
            placeholder="Điền vào tên..."
            style={{ width: 300 }}
          />

          <Button
            onClick={handleSubmit}
            type="primary"
            style={{ marginLeft: 10 }}
            loading={isFetching}
          >
            Tìm kiếm theo tên
          </Button>
        </div>

        <div>
          <Input
            onChange={handleChangeModule}
            value={module}
            placeholder="Điền vào module..."
            style={{ width: 300 }}
          />

          <Button
            onClick={handleSubmitModule}
            type="primary"
            style={{ marginLeft: 10 }}
          >
            Tìm kiếm theo module
          </Button>
        </div>

        <div>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.CREATE} hideChildren>
            <Button
              onClick={() => setOpenModal(true)}
              icon={<FontAwesomeIcon icon={faPlus} />}
              type="primary"
            >
              Thêm mới
            </Button>
          </Access>

          <Button
            type="default"
            style={{ marginLeft: 10 }}
            onClick={() => setReload(!reload)}
          >
            Làm mới
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="Permisson-table">
      <Table
        title={HeaderTable}
        loading={isFetching || loading}
        pagination={{
          ...meta,
          showTotal: (total, range) => {
            return (
              <div>{`${range[0]} - ${range[1]} trên ${total} bản ghi`}</div>
            );
          },
        }}
        onChange={onChange}
        rowKey="id"
        bordered
        dataSource={permissions}
        columns={columns}
      />
      <PermissionModal
        dataInit={dataInit}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setDataInit={setDataInit}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
};

export default PermissionTable;
