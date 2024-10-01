"use client";
import { IRole } from "@/types/backend";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  deleteCompany,
  deleteRole,
  deleteUser,
  fetchCompanies,
  fetchRoles,
  fetchUsers,
} from "@/config/api";
import CompanyModal from "./Role.modal";
import Access from "../Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import RoleModal from "./Role.modal";
import { set } from "lodash";

interface IProps {
  roles: IRole[] | [];
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  reload: boolean;
  setReload: (v: boolean) => void;
  loading: boolean;
  setRoles: (v: IRole[]) => void;
  current: number;
}

const RoleTable = (props: IProps) => {
  const { roles, meta, reload, setReload, loading, setRoles, current } = props;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IRole | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (roles) setIsFetching(false);
  }, [roles]);

  const columns: ColumnsType<IRole> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: IRole, b: IRole) => a.name?.localeCompare(b.name),
    },
    {
      title: "Description( Mô tả )",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status( Trạng thái)",
      dataIndex: "is_active",
      key: "status",
      render: (is_active: any, record: IRole, index: number) => {
        return (
          <Tag color={is_active ? "lime" : "red"}>
            {is_active ? "ACTIVE" : "INACTIVE"}
          </Tag>
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
      sorter: (a: IRole, b: IRole) =>
        dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),

      render: (updated_at: string) => dayjs(updated_at).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",

      width: 50,
      render: (_value: any, entity: any, _index: any) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                setOpenModal(true);
                setIsEdit(true);
                setDataInit(entity);
              }}
            />
          </Access>

          <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa vai trò"}
              description={"Bạn có chắc chắn muốn xóa vai trò này ?"}
              onConfirm={async () => {
                await deleteRole(entity.id);
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
    const res = await fetchRoles(current, search);
    if (res) {
      setRoles(res.data?.result || []);
      setSearch("");
    }

    setIsFetching(false);
  };

  const HeaderTable = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách vai trò</span>

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
          <Access permission={ALL_PERMISSIONS.ROLES.CREATE} hideChildren>
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
    <div className="Role-table">
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
        dataSource={roles}
        columns={columns}
      />
      <RoleModal
        dataInit={dataInit}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        openModal={openModal}
        setOpenModal={setOpenModal}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
};

export default RoleTable;
