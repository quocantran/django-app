"use client";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  Upload,
  Breadcrumb,
  Divider,
  notification,
} from "antd";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { IJob } from "@/types/backend";
import {
  createCompany,
  createJob,
  fetchCompanies,
  fetchJobById,
  updateCompany,
  updateJob,
} from "@/config/api";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { CheckSquareOutlined } from "@ant-design/icons";
import Link from "next/link";
import { LIST_LOCATION, SKILL_LIST } from "@/config/utils";
import { DebounceSelect } from "@/hooks/debounce.select";
import { ICompanySelect } from "../Company/Company.modal";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
const JobUpsert = (props: any) => {
  const [companies, setCompanies] = useState<ICompanySelect[]>([]);

  const navigate = useRouter();
  const [value, setValue] = useState<string>("");
  const searchParams = useSearchParams();

  const id = searchParams?.get("id");
  const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await fetchJobById(id);
        if (res && res.data) {
          setDataUpdate(res.data);
          setValue(res.data.description);
          setCompanies([
            {
              label: res.data.company?.name as string,
              value:
                `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
              key: res.data.company?.id,
            },
          ]);

          form.setFieldsValue({
            ...res.data,
            company: {
              label: res.data.company?.name as string,
              value:
                `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
              key: res.data.company?.id,
            },
          });
        }
      }
    };
    init();
    return () => form.resetFields();
  }, [id]);

  //DebounceSelect
  async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
    const res = await fetchCompanies(undefined, name);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: `${item.id}@#$${item.logo}` as string,
        };
      });
      return temp;
    } else return [];
  }

  const onFinish = async (values: any) => {
    if (dataUpdate?.id) {
      //update
      const cp = values?.company?.value?.split("@#$");
      const job = {
        name: values.name,
        skills: values.skills,
        company: cp && cp.length > 0 ? cp[0] : "",
        location: values.location,
        salary: values.salary,
        quantity: values.quantity,
        level: values.level,
        description: value,
        start_date: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.start_date)
          ? dayjs(values.start_date, "DD/MM/YYYY").toDate()
          : values.start_date,
        end_date: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.end_date)
          ? dayjs(values.end_date, "DD/MM/YYYY").toDate()
          : values.end_date,
        is_active: values.is_active,
      };

      try {
        const res = await updateJob(dataUpdate.id, job);
        if (res.data) {
          message.success(`Cập nhật công việc ${job.name} thành công`);
          navigate.push("/admin/jobs");
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
      const cp = values?.company?.value?.split("@#$");
      const job = {
        name: values.name,
        skills: values.skills,
        company: cp && cp.length > 0 ? cp[0] : "",
        location: values.location,
        salary: values.salary,
        quantity: values.quantity,
        level: values.level,
        description: value,
        start_date: dayjs(values.start_date, "DD/MM/YYYY").toDate(),
        end_date: dayjs(values.end_date, "DD/MM/YYYY").toDate(),
        is_active: values.is_active,
      };

      try {
        const res = await createJob(job);
        if (res.data) {
          message.success(`Tạo mới công việc ${job.name} thành công`);
          navigate.push("/admin/jobs");
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
    <div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link href="/admin/jobs">Về trang quản lý Jobs</Link>,
          },
          {
            title: "Upsert Job",
          },
        ]}
      />

      <div>
        <ProForm
          form={form}
          onFinish={onFinish}
          submitter={{
            searchConfig: {
              resetText: "Hủy",
              submitText: (
                <>{dataUpdate?.id ? "Cập nhật Job" : "Tạo mới Job"}</>
              ),
            },
            onReset: () => navigate.push("/admin/jobs"),
            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
            submitButtonProps: {
              icon: <CheckSquareOutlined />,
            },
          }}
        >
          <Row gutter={[20, 20]}>
            <Col span={24} md={12}>
              <ProFormText
                label="Tên Job"
                name="name"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập tên job"
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormSelect
                name="skills"
                label="Kỹ năng yêu cầu"
                options={SKILL_LIST}
                placeholder="Please select a skill"
                rules={[{ required: true, message: "Vui lòng chọn kỹ năng!" }]}
                allowClear
                mode="multiple"
                fieldProps={{
                  showArrow: false,
                }}
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormSelect
                name="location"
                label="Địa điểm"
                options={LIST_LOCATION.filter((item) => item.value !== "ALL")}
                placeholder="Please select a location"
                rules={[{ required: true, message: "Vui lòng chọn địa điểm!" }]}
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormDigit
                label="Mức lương"
                name="salary"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập mức lương"
                fieldProps={{
                  addonAfter: " đ",
                  formatter: (value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  parser: (value) => +(value || "").replace(/\$\s?|(,*)/g, ""),
                }}
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormDigit
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                placeholder="Nhập số lượng"
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormSelect
                name="level"
                label="Trình độ"
                valueEnum={{
                  INTERN: "INTERN",
                  FRESHER: "FRESHER",
                  JUNIOR: "JUNIOR",
                  MIDDLE: "MIDDLE",
                  SENIOR: "SENIOR",
                }}
                placeholder="Please select a level"
                rules={[{ required: true, message: "Vui lòng chọn level!" }]}
              />
            </Col>

            {(dataUpdate?.id || !id) && (
              <Col span={24} md={6}>
                <ProForm.Item
                  name="company"
                  label="Thuộc Công Ty"
                  rules={[
                    { required: true, message: "Vui lòng chọn company!" },
                  ]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={companies}
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
            )}
          </Row>
          <Row gutter={[20, 20]}>
            <Col span={24} md={6}>
              <ProFormDatePicker
                label="Ngày bắt đầu"
                name="start_date"
                normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                fieldProps={{
                  format: "DD/MM/YYYY",
                }}
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
                placeholder="dd/mm/yyyy"
              />
            </Col>
            <Col span={24} md={6}>
              <ProFormDatePicker
                label="Ngày kết thúc"
                name="end_date"
                normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                fieldProps={{
                  format: "DD/MM/YYYY",
                }}
                // width="auto"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
                placeholder="dd/mm/yyyy"
              />
            </Col>
            <Col span={24} md={6}>
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
              <ProForm.Item
                name="description"
                label="Miêu tả job"
                rules={[
                  { required: true, message: "Vui lòng nhập miêu tả job!" },
                ]}
              >
                <ReactQuill theme="snow" value={value} onChange={setValue} />
              </ProForm.Item>
            </Col>
          </Row>
          <Divider />
        </ProForm>
      </div>
    </div>
  );
};

export default JobUpsert;
