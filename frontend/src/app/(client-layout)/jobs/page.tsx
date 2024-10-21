"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import styles from "../../../styles/JobClient.module.scss";
import classNames from "classnames/bind";
import { fetchJobs } from "@/config/api";
import { IJob } from "@/types/backend";
import {
  Button,
  Card,
  Flex,
  Result,
  Select,
  Skeleton,
  Spin,
  Tag,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocation,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import vi_VN from "dayjs/locale/vi";
import ResumeModalClient from "@/components/client/Resume/ResumeClient.modal";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { formatNumberToMillions } from "@/helpers/index";
import { isMobile } from "react-device-detect";
import { LoadingOutlined } from "@ant-design/icons";
dayjs.extend(relativeTime);
dayjs.locale(vi_VN);

const cx = classNames.bind(styles);

const PAGE = 1;

const JobClient = (props: any) => {
  const params = useSearchParams();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [current, setCurrent] = useState<number>(PAGE);
  const [name, setName] = useState<string | undefined>(
    params.get("name") || undefined
  );

  const [location, setLocation] = useState<string | undefined>(
    params.get("location") || undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("created_at");
  const [jobSelect, setJobSelect] = useState<IJob | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [meta, setMeta] = useState({} as any);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useRouter();
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const firstRender = useRef(true);
  const sortChanged = useRef(false);
  const options = [
    { value: "created_at", label: "Mới đăng tuyển" },
    { value: "updated_at", label: "Mới cập nhật" },
  ];

  const handleClick = () => {
    if (!isAuth) {
      message.error("Vui lòng đăng nhập để ứng tuyển công việc!");
      return;
    }
    setOpenModal(true);
  };

  useEffect(() => {
    if (sortChanged.current) {
      sortChanged.current = false;
    }
    if (current > meta?.pages) return;
    const fetchData = async (page: number) => {
      if (current == 1) setLoading(true);
      const res = await fetchJobs({ current, name, sort, location });
      setShouldRender(true);
      if (res?.data?.meta) setMeta(res?.data?.meta);
      if (res?.data?.result) {
        setJobs((prevJobs) => [...prevJobs, ...(res?.data?.result as IJob[])]);
        setLoading(false);
      }
    };

    fetchData(current);
  }, [current]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    sortChanged.current = true;
    setCurrent(1);
    const fetchData = async (page: number) => {
      setLoading(true);
      const res = await fetchJobs({ current: 1, sort: sort });
      if (res?.data?.result) {
        setJobs(res?.data?.result as IJob[]);
        setLoading(false);
      }
    };

    fetchData(current);
  }, [sort]);
  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      setCurrent((prevCurrent) => prevCurrent + 1);
    }
  };

  useEffect(() => {
    setJobSelect(jobs[0]);
  }, [jobs]);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  });

  return !shouldRender ? (
    <></>
  ) : !jobs.length ? (
    <Result
      status="404"
      title="Không tìm thấy công việc"
      subTitle="Không tìm thấy công việc phù hợp với yêu cầu của bạn. Vui lòng thử lại với từ khóa khác!"
      extra={
        <Button href="/" type="primary">
          Back Home
        </Button>
      }
    />
  ) : (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("job-heading")}>
          <h1>Gợi ý công việc dành cho bạn</h1>
        </div>
        <div className={cx("job-content")}>
          <div className={cx("job-select")}>
            <h4>Sắp xếp theo</h4>
            <Select
              defaultValue={sort}
              placeholder="Chọn thứ tự sắp xếp"
              options={options}
              onChange={(value) => setSort(value)}
              style={{ width: "100%" }}
            />
          </div>
          {loading ? (
            <Skeleton style={{ marginTop: "25px" }} active />
          ) : (
            <div className={cx("job-list")}>
              <div className={cx("job-item")} ref={divRef}>
                {jobs?.map((job) => {
                  return (
                    <Card
                      hoverable
                      key={job.id}
                      style={{
                        marginTop: "15px",
                        cursor: "pointer",
                        backgroundColor:
                          job.id === jobSelect?.id ? "#e6f4ff" : "",
                      }}
                      onClick={() => {
                        if (isMobile) {
                          navigate.push(`/jobs/${job.id}`);
                          return;
                        }
                        setJobSelect(job);
                      }}
                      title={job.name}
                      loading={loading}
                    >
                      {job.skills.map((skill, idx) => {
                        return (
                          <Tag key={idx} color="blue">
                            {skill}
                          </Tag>
                        );
                      })}
                      <div className={cx("item-content")}>
                        <img src={job.company?.logo} alt="logo" />
                        <div className={cx("company-info")}>
                          <Link href={`/companies/${job.company?.id}`}>
                            {job.company?.name}
                          </Link>
                          <p>
                            <FontAwesomeIcon icon={faLocationArrow} />
                            {job.location}
                          </p>
                        </div>
                      </div>
                      <div className={cx("job-time")}>
                        <Tag color="rgb(100, 100, 100)">
                          <FontAwesomeIcon icon={faClock} />
                          {dayjs(job.updated_at).fromNow()}
                        </Tag>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className={cx("job-description")}>
                <div className={cx("header")}>
                  <div className={cx("header-info")}>
                    <img src={jobSelect?.company?.logo} alt="logo" />

                    <div className={cx("company")}>
                      <h3
                        onClick={() => {
                          navigate.push(`/jobs/${jobSelect?.id}`);
                        }}
                      >
                        {jobSelect?.name}
                      </h3>

                      <Link href={`/companies/${jobSelect?.company?.id}`}>
                        {jobSelect?.company?.name}
                      </Link>
                    </div>
                  </div>
                  <button onClick={handleClick} className={cx("submit-job")}>
                    Ứng tuyển nhanh
                  </button>
                </div>

                <div className={cx("job-info")}>
                  <Tag color="rgb(100, 100, 100)">
                    <FontAwesomeIcon icon={faClock} /> Đăng{" "}
                    {dayjs(jobSelect?.created_at).fromNow()}
                  </Tag>
                  <Tag color="green">
                    <FontAwesomeIcon icon={faClock} /> Cập nhật{" "}
                    {dayjs(jobSelect?.updated_at).fromNow()}
                  </Tag>

                  <h3 className={cx("job-title")}>Thông tin công việc</h3>
                  <Tag color="green">
                    {"₫" + formatNumberToMillions(jobSelect?.salary as number)}{" "}
                    triệu
                  </Tag>
                  <Tag color="blue">{`Trình độ ${jobSelect?.level}`}</Tag>
                  <Tag color="rgb(100, 100, 100)">{jobSelect?.location}</Tag>
                  <h3>Số lượng tuyển</h3>
                  <Tag color="blue">{`${jobSelect?.quantity} người`}</Tag>

                  <h3>Skills</h3>
                  {jobSelect?.skills.map((skill, idx) => {
                    return (
                      <Tag key={skill} color="blue" bordered>
                        {skill}
                      </Tag>
                    );
                  })}
                  <h3>{`Chi tiết công việc ${jobSelect?.name} tại ${jobSelect?.company?.name}`}</h3>
                  <div
                    className={cx("job-detail")}
                    dangerouslySetInnerHTML={{
                      __html: jobSelect?.description as string,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <ResumeModalClient
          openModal={openModal}
          setOpenModal={setOpenModal}
          dataInit={jobSelect}
        />
      </div>
    </div>
  );
};

const JobClientWithSuspense = (props: any) => (
  <Suspense
    fallback={
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "15px 0",
        }}
      >
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      </div>
    }
  >
    <JobClient {...props} />
  </Suspense>
);

export default JobClientWithSuspense;
