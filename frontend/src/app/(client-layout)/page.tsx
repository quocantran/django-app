"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../styles/Home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faSearch } from "@fortawesome/free-solid-svg-icons";
import { LIST_LOCATION, SKILL_LIST } from "@/config/utils";
import { AutoComplete, Select, Skeleton, message } from "antd";
import { useRouter } from "next/navigation";
import DebounceInput from "@/hooks/debounce.input";
import { fetchJobsSuggest } from "@/config/api";
import { set } from "lodash";

const cx = classNames.bind(styles);

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [locationValue, setLocationValue] = useState<string>("");
  const [searchReuslt, setSearchResult] = useState<string[]>([]);
  const navigate = useRouter();
  const debounceValue = DebounceInput(inputValue, 500);
  const handleClick = () => {
    if (!inputValue) {
      message.error("Vui lòng nhập tên việc làm cần tìm kiếm!");
      return;
    }
    navigate.push(
      `/jobs${inputValue ? `?name=${inputValue}` : ""}${
        locationValue ? `&location=${locationValue}` : ""
      }`
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchJobsSuggest(debounceValue, locationValue);
      if (res && res.data) {
        let jobNameList = res.data.map((job) => job.name);
        setSearchResult(jobNameList);
      }
      setLoading(false);
    };
    if (debounceValue) {
      fetchData();
    }
  }, [debounceValue]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("section-search")}>
          <h5 className={cx("search-title")}>
            Khám phá <b>15000+</b> việc làm mới hằng tháng!
          </h5>
          <div className={cx("search-container")}>
            <div className={cx("search-job")}>
              <FontAwesomeIcon className={cx("search-icon")} icon={faSearch} />
              <AutoComplete
                options={(searchReuslt.length > 0
                  ? searchReuslt
                  : []
                ).map((suggestion) => ({
                  value: suggestion,
                }))}
                style={{ height: '116%' }}
                className={cx("job-input")}
                placeholder="Tìm kiếm việc làm..."
                notFoundContent={loading ? <Skeleton active/> : <p> Không có kết quả </p>}
                
                onChange={(value) => setInputValue(value)}
              />
            </div>
            <div className={cx("search-location")}>
              <FontAwesomeIcon
                icon={faLocationArrow}
                className={cx("location-icon")}
              />

              <Select
                placeholder="Chọn Tỉnh/Thành Phố..."
                className={cx("location-input")}
                style={{ height: '116%' }}
                suffixIcon={null}
                onChange={(value) => setLocationValue(value)}
                defaultValue={LIST_LOCATION[LIST_LOCATION.length - 1].value}
                options={LIST_LOCATION}
              />
            </div>
            <button onClick={handleClick} className={cx("search-btn")}>
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className={cx("home-content")}>
          <div className={cx("content-detail")}>
            <div className={cx("detail-title")}>
              <div className={cx("detail-left")}>
                <img src="/images/value-proposition-desktop.webp" />
                <h1 className={cx("title")}>
                  Tham gia Cộng đồng{" "}
                  <span>
                    1.000.000+ <br></br>
                  </span>
                  ứng viên tài năng
                </h1>
              </div>
              <div className={cx("detail-right")}>
                <div className={cx("right-item")}>
                  <p>Khám phá nghề nghiệp mơ ước</p>
                  <span>
                    Khám phá nghề nghiệp mơ ước và ứng tuyển hàng ngàn việc làm
                    nổi bật nhất hiện nay!
                  </span>
                  <div className={cx("separate")}></div>
                </div>
                <div className={cx("right-item")}>
                  <p>PHÁT TRIỂN KỸ NĂNG CHUYÊN MÔN</p>
                  <span>
                    Nắm bắt cơ hội phát triển kỹ năng chuyên môn của bạn
                  </span>
                  <div className={cx("separate")}></div>
                </div>
                <div className={cx("right-item")}>
                  <p>KẾT NỐI VỚI CÔNG TY TRÊN TOÀN THẾ GIỚI</p>
                  <span>
                    Đừng bỏ lỡ cơ hội kết nối với các công ty trên toàn cầu và
                    nắm bắt cơ hội việc làm mới nhất
                  </span>
                  <div className={cx("separate")}></div>
                </div>
              </div>
            </div>

            <div className={cx("social-wrapper")}>
              <div className={cx("social-heading")}>
                <h1>Glints Trên Truyền Thông</h1>
              </div>
              <div className={cx("social-content")}>
                <img loading="lazy" src="/images/cna.png" alt="cna" />
                <img loading="lazy" src="/images/huffington.png" alt="cna" />
                <img loading="lazy" src="/images/yahoo.png" alt="cna" />
                <img loading="lazy" src="/images/straitstimes.png" alt="cna" />
                <img loading="lazy" src="/images/techcrunch.png" alt="cna" />
                <img
                  loading="lazy"
                  src="/images/business-times.png"
                  alt="cna"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
