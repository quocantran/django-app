"use client";
import { IResume } from "@/types/backend";
import { AutoComplete, Button, Input, Popconfirm, Space, Table } from "antd";
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
  deleteUser,
  fetchCompanies,
  fetchResumes,
  fetchUsers,
} from "@/config/api";
import CompanyModal from "./Resume.modal";
import Access from "../Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ResumeModal from "./Resume.modal";

interface IProps {
  resumes: IResume[] | [];
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  reload: boolean;
  setReload: (v: boolean) => void;
  loading: boolean;
  setResumes: (v: IResume[]) => void;
  current: number;
}

const ResumeTable = (props: IProps) => {
  const { resumes, meta, reload, setReload, loading, setResumes, current } =
    props;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [search, setSearch] = useState<string>("");
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (resumes) setIsFetching(false);
  }, [resumes]);

  const columns: ColumnsType<IResume> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thuộc về công việc",
      dataIndex: ["job", "name"],
      key: "name",
      sorter: (a: IResume, b: IResume) => a.job.name?.localeCompare(b.job.name),
    },
    {
      title: "Xem hồ sơ",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Nhấn vào đây để xem
        </a>
      ),
    },
    {
      title: "Status(Trạng thái CV)",
      dataIndex: "status",

      sorter: (a: IResume, b: IResume) => a.status.localeCompare(b.status),
    },
    {
      title: "Thuộc về công ty",
      dataIndex: ["company", "name"],
      sorter: (a: IResume, b: IResume) =>
        a.company.name.localeCompare(b.company.name),
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
      sorter: (a: IResume, b: IResume) =>
        dayjs(a.updated_at).unix() - dayjs(b.updated_at).unix(),

      render: (updated_at: string) => dayjs(updated_at).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",

      width: 50,
      render: (_value: any, entity: any, _index: any) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.RESUMES.UPDATE} hideChildren>
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

  const handleChange = (value: string) => {
    setSearch(value);
  };

  const handleSubmit = async () => {
    setIsFetching(true);
    const res = await fetchResumes(current, search);
    if (res) {
      setResumes(res?.data?.result || []);
      setSearch("");
    }

    setIsFetching(false);
  };

  const HeaderTable = () => {
    const options = [
      { value: "PENDING" },
      { value: "REJECTED" },
      { value: "REVIEWING" },
      { value: "APPROVED" },
    ];
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách CV</span>

        <div>
          <AutoComplete
            options={options}
            style={{ width: 300 }}
            onChange={handleChange}
            value={search}
            placeholder="Điền vào trạng thái..."
          />

          <Button
            onClick={handleSubmit}
            type="primary"
            loading={isFetching}
            style={{ marginLeft: 10 }}
          >
            Tìm kiếm theo trạng thái
          </Button>
        </div>

        <div>
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
    <div className="Resume-table">
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
        dataSource={resumes}
        columns={columns}
      />
      <ResumeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
};

export default ResumeTable;
