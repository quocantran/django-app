import React from "react";
import classNames from "classnames/bind";
import styles from "../../../../styles/JobInfo.module.scss";
import { fetchJobById } from "@/config/api";
import { Button, Result, Tag } from "antd";
import { formatNumberToMillions } from "@/helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCommentDollar,
  faHourglass,
  faHourglass1,
  faLocationDot,
  faPaperPlane,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import JobButton from "@/components/client/Job/Job.button";
import { IJob } from "@/types/backend";
import Link from "next/link";
import JobTransaction from "@/components/client/Job/Job.transaction";

const cx = classNames.bind(styles);

const JobInfo = async (props: any) => {
  const res = await fetchJobById(props?.params?.id);
  return res?.data == null ? (
    <Result
      status="404"
      title="404"
      subTitle="Trang này không tồn tại!"
      extra={
        <Button href="/" type="primary">
          Back Home
        </Button>
      }
    />
  ) : (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("detail-left")}>
            <div className={cx("job-title")}>
              <h1 className={cx("title")}>{res?.data?.name}</h1>
              <div className={cx("detail-section")}>
                <div className={cx("detail-item")}>
                  <div className={cx("item-icon")}>
                    <FontAwesomeIcon icon={faCommentDollar} />
                  </div>
                  <div className={cx("item-content")}>
                    <div>Mức lương</div>
                    <span>
                      {formatNumberToMillions(res?.data?.salary as number)}{" "}
                      triệu
                    </span>
                  </div>
                </div>
                <div className={cx("detail-item")}>
                  <div className={cx("item-icon")}>
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>

                  <div className={cx("item-content")}>
                    <div>Địa điểm</div>
                    <span>{res?.data?.location}</span>
                  </div>
                </div>
                <div className={cx("detail-item")}>
                  <div className={cx("item-icon")}>
                    <FontAwesomeIcon icon={faHourglass} />
                  </div>

                  <div className={cx("item-content")}>
                    <div>Kinh nghiệm</div>
                    <span>{res?.data?.level}</span>
                  </div>
                </div>
              </div>

              <div className={cx("job-time")}>
                <Tag color="#f2f4f5">
                  <span className={cx("tag-title")}>
                    <FontAwesomeIcon icon={faClock} />
                    Hạn nộp hồ sơ{": "}
                    {dayjs(res.data?.end_date).format("DD/MM/YYYY")}
                  </span>
                </Tag>
              </div>

              <JobButton dataInit={res?.data as IJob} />
            </div>

            <div className={cx("job-desc")}>
              <h2 className={cx("desc-heading")}>Chi tiết tin tuyển dụng</h2>
              <div
                className={cx("desc-content")}
                dangerouslySetInnerHTML={{
                  __html: res?.data?.description as string,
                }}
              />
            </div>
          </div>

          <div className={cx("detail-right")}>
            <div className={cx("company-detail")}>
              <div className={cx("company-logo")}>
                <img
                  src={res?.data?.company?.logo}
                  alt={res?.data?.company?.name}
                />
                <Link
                  className={cx("company-title")}
                  href={`/companies/${res?.data?.company?.id}`}
                >
                  {res?.data?.company?.name}
                </Link>
              </div>
              <div className={cx("company-address")}>
                <div className={cx("address-icon")}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>Địa điểm:</span>
                </div>
                <p>{res.data?.company?.address}</p>
              </div>
            </div>
            <div className={cx("company-link")}>
              <Link href={`/companies/${res?.data?.company?.id}`}>
                Xem trang công ty
                <FontAwesomeIcon icon={faUpRightFromSquare} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfo;
