"use client";
import { IJob } from "@/types/backend";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { fetchJobs, deleteJob } from "@/config/api";
import Access from "../Access/Access";
import { ALL_PERMISSIONS } from "@/config/permissions";

interface IProps {
  jobs: IJob[] | [];
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  reload: boolean;
  setReload: (v: boolean) => void;
  loading: boolean;
  setJobs: (v: IJob[]) => void;
  current: number;
}

const JobTable = (props: IProps) => {
  const { jobs, meta, reload, setReload, loading, setJobs, current } = props;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const navigate = useRouter();
  const [search, setSearch] = useState<string>("");
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (jobs) setIsFetching(false);
  }, [jobs]);

  const columns: ColumnsType<IJob> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: IJob, b: IJob) => a.name?.localeCompare(b.name),
    },
    {
      title: "Salary(Mức lương)",
      dataIndex: "salary",
      render(salary: any, entity: IJob, index: number) {
        const str = "" + entity.salary;
        return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ</>;
      },
      sorter: (a: IJob, b: IJob) => a.salary - b.salary,
      key: "salary",
    },
    {
      title: "Status(Trạng thái)",
      dataIndex: "is_active",
      render: (is_active: any, record: IJob, index: number) => {
        return (
          <Tag color={is_active ? "lime" : "red"}>
            {is_active ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
      key: "status",
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
      sorter: (a: IJob, b: IJob) =>
        dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix(),

      render: (updated_at: string) => dayjs(updated_at).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",

      width: 50,
      render: (_value: any, entity: any, _index: any) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.JOBS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type=""
              onClick={() => {
                navigate.push(`/admin/jobs/upsert?id=${entity.id}`);
              }}
            />
          </Access>

          <Access permission={ALL_PERMISSIONS.JOBS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa công việc"}
              description={"Bạn có chắc chắn muốn xóa công việc này ?"}
              onConfirm={async () => {
                try {
                  await deleteJob(entity.id);
                  setReload(!reload);
                } catch (err) {
                  notification.error({
                    message: "Có lỗi xảy ra",
                    description: "Bạn không có quyền thực hiện thao tác này",
                  });
                }
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
    const res = await fetchJobs({ current, name: search });
    if (res) {
      setJobs(res.data?.result || []);
      setSearch("");
    }

    setIsFetching(false);
  };

  const HeaderTable = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách công việc</span>

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
          <Access permission={ALL_PERMISSIONS.JOBS.CREATE} hideChildren>
            <Button
              onClick={() => {
                navigate.push(`/admin/jobs/upsert`);
              }}
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
    <div className="Job-table">
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
        dataSource={jobs}
        columns={columns}
      />
    </div>
  );
};

export default JobTable;
