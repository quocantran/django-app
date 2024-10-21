"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../styles/CompanyClient.module.scss";
import { ICompany, IMeta } from "@/types/backend";
import CompanyCard from "@/components/client/Company/Company.card";
import { Flex, Pagination, Result, Spin } from "antd";
import CompanyPagination from "@/components/client/Company/Company.pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faSearch } from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { fetchCompanies } from "@/config/api";

const cx = classNames.bind(styles);

const CompanyClient = (props: any) => {
  const [companies, setCompanies] = useState<ICompany[]>([]);

  const [current, setCurrent] = useState(props.searchParams?.page || 1);

  const [meta, setMeta] = useState<IMeta>();

  const [searchValue, setSearchValue] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [shouldRender, setShouldRender] = useState(false);

  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      setSearch(searchValue);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (search) {
      const fetchData = async () => {
        const res = await fetchCompanies(1, search, 100);
        const data = res?.data;
        setCompanies(data?.result || []);

        setMeta(data?.meta);
        setShouldRender(true);
      };

      fetchData();
    } else {
      const fetchData = async () => {
        const res = await fetchCompanies(current, search, 9);
        setCompanies(res?.data?.result || []);

        setMeta(res?.data?.meta);
        setShouldRender(true);
      };

      fetchData();
    }
    setLoading(false);
  }, [current, search]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("search-wrapper")}>
          <div className={cx("search-inner")}>
            <FontAwesomeIcon icon={faSearch} />
            <div className={cx("search-input")}>
              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Nhập từ khóa"
              />
            </div>
          </div>
        </div>
        {!loading && shouldRender ? (
          companies.length > 0 ? (
            <div className={cx("content")}>
              {companies?.map((item: ICompany) => {
                return <CompanyCard key={item.id} result={item} meta={meta} />;
              })}
            </div>
          ) : (
            <Result status="404" title="Không tìm thấy kết quả" />
          )
        ) : (
          <Flex
            justify="center"
            style={{ margin: "25px 0" }}
            align="center"
            gap="middle"
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </Flex>
        )}
        {meta && companies.length > 0 && (
          <div className={cx("pagination")}>
            <CompanyPagination
              meta={meta}
              setMeta={setMeta}
              setCurrent={setCurrent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyClient;
