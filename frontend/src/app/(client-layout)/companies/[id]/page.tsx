"use client";
import { Fragment, useEffect, useRef, useState } from "react";

import {
  createComment,
  fetchCompanyById,
  fetchJobs,
  followCompany,
  getComments,
  unFollowCompany,
} from "@/config/api";
import { Avatar, Button, message, Result, Skeleton } from "antd";
import React from "react";
import classNames from "classnames/bind";
import styles from "../../../../styles/CompanyInfo.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faLocationDot,
  faPlus,
  faSearch,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { IComment, ICompany, IJob, IMeta } from "@/types/backend";
import { useAppSelector } from "@/lib/redux/hooks";
import JobCard from "@/components/client/Job/Job.card";
import CompanyComment from "@/components/client/Company/Company.comment";

const cx = classNames.bind(styles);

const CompanyInfo = (props: any) => {
  const [company, setCompany] = useState<ICompany>();

  const [shouldRender, setShouldRender] = useState(false);

  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [jobs, setJobs] = useState<IJob[]>([]);

  const [comments, setComments] = useState<IComment[]>([]);

  const [meta, setMeta] = useState<IMeta>();

  const [isSearching, setIsSearching] = useState(false);

  const [totalComments, setTotalComments] = useState(0);

  const [commentValue, setCommentValue] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const [commentLoading, setCommentLoading] = useState(false);

  const userId = useAppSelector((state) => state.auth.user?.id);

  const followBtnRef = useRef<HTMLDivElement>(null);

  const btnPrevRef = useRef<HTMLButtonElement>(null);

  const btnNextRef = useRef<HTMLButtonElement>(null);

  const [isFollow, setIsFollow] = useState(false);

  const loading = useAppSelector((state) => state.auth.isLoading);

  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const handleNext = async () => {
    if (meta?.current === meta?.pages) return;
    setIsSearching(true);

    const jobRes = await fetchJobs({
      pageSize: 2,
      company: company?.id,
      current: (meta?.current as number) + 1,
    });

    setMeta((prev: any) => {
      return {
        ...prev,
        current: prev.current + 1,
      };
    });
    setJobs(jobRes?.data?.result as IJob[]);
    setMeta(jobRes?.data?.meta as any);
    setIsSearching(false);
  };

  const handlePrev = async () => {
    if (meta?.current === 1) return;
    setIsSearching(true);

    const jobRes = await fetchJobs({
      pageSize: 2,
      company: company?.id,
      current: (meta?.current as number) - 1,
    });

    setMeta((prev: any) => {
      return {
        ...prev,
        current: prev.current - 1,
      };
    });
    setJobs(jobRes?.data?.result as IJob[]);
    setMeta(jobRes?.data?.meta as any);
    setIsSearching(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchCompanyById(props?.params?.id);

      if (res.data) {
        const jobRes = await fetchJobs({
          pageSize: 2,
          company: res.data.id,
        });

        const commentList = await getComments({
          current: 1,
          pageSize: 30,
          company: res.data.id,
        });
        let totalLenght = commentList.data?.result?.length as number;

        commentList.data?.result?.forEach((comment: IComment) => {
          totalLenght += (comment.right - comment.left - 1) / 2;
        });

        setTotalComments(totalLenght);
        setJobs(jobRes?.data?.result as IJob[]);
        setMeta(jobRes?.data?.meta as any);
        setComments(commentList.data?.result as IComment[]);
      }

      setCompany(res.data);
      setShouldRender(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (meta?.current === 1) {
      btnPrevRef.current?.style.setProperty("pointer-events", "none");
      btnPrevRef.current?.style.setProperty("color", "#dee0e2");
      btnPrevRef.current?.style.setProperty("border", "1px solid #dee0e2");
    } else {
      btnPrevRef.current?.style.setProperty("pointer-events", "auto");
      btnPrevRef.current?.style.setProperty("color", "#00b14f");
      btnPrevRef.current?.style.setProperty("border", "1px solid #00b14f");
    }

    if (meta?.current === meta?.pages) {
      btnNextRef.current?.style.setProperty("pointer-events", "none");
      btnNextRef.current?.style.setProperty("color", "#dee0e2");
      btnNextRef.current?.style.setProperty("border", "1px solid #dee0e2");
    } else {
      btnNextRef.current?.style.setProperty("pointer-events", "auto");
      btnNextRef.current?.style.setProperty("color", "#00b14f");
      btnNextRef.current?.style.setProperty("border", "1px solid #00b14f");
    }
  }, [meta]);

  useEffect(() => {
    if (company && userId) {
      const isUserFollowing = company.users_followed?.some(
        (item) => item.toString() === userId.toString()
      ) as boolean;
      setIsFollow(isUserFollowing);
    }
  }, [company, userId]);

  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleComment = (e: any) => {
    setCommentValue(e.target.value);
  };

  const handleSendComment = async (e: any) => {
    if (e.key === "Enter") {
      if (commentLoading) return;

      if (!isAuth) {
        message.error("Vui lòng đăng nhập");
        return;
      }
      if (!commentValue.trim()) return;

      setCommentLoading(true);
      const res = await createComment({
        company_id: company?.id as string,
        content: commentValue,
      });

      if (res.data) {
        setComments((prev: any) => {
          return [res.data, ...prev];
        });
        message.success("Bình luận thành công");
        setTotalComments((prev: any) => prev + 1);
        setCommentValue("");
      }
      setCommentLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (commentLoading) return;

    if (!isAuth) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    if (!commentValue.trim()) return;

    setCommentLoading(true);

    const res = await createComment({
      company_id: company?.id as string,
      content: commentValue,
    });

    if (res.data) {
      setComments((prev: any) => {
        return [res.data, ...prev];
      });

      message.success("Bình luận thành công");
      setTotalComments((prev: any) => prev + 1);
      setCommentValue("");
    }
    setCommentLoading(false);
  };

  const handleSearch = async () => {
    setIsSearching(true);

    const jobRes = await fetchJobs({
      pageSize: 2,
      company: company?.id,
      name: searchValue,
    });

    setJobs(jobRes?.data?.result as IJob[]);
    setMeta(jobRes?.data?.meta as any);
    setIsSearching(false);
  };

  const handleClick = async (e: any) => {
    if (!isAuth) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    setIsFollowLoading(true);
    if (isFollow) {
      // Unfollow company
      setIsFollow(false);
      setCompany((prev: any) => {
        return {
          ...prev,
          users_followed: prev?.users_followed?.filter(
            (item: any) => item.toString() !== userId.toString()
          ),
        };
      });
      await unFollowCompany(company?.id?.toString() as string);
    } else {
      setIsFollow(true);
      setCompany((prev: any) => {
        return {
          ...prev,
          users_followed: [...prev?.users_followed, userId],
        };
      });

      // Follow company

      await followCompany(company?.id?.toString() as string);
    }

    setIsFollowLoading(false);
  };

  useEffect(() => {
    if (!isAuth) return;

    if (isFollowLoading) {
      followBtnRef.current?.style.setProperty("pointer-events", "none");
    } else {
      followBtnRef.current?.style.setProperty("pointer-events", "auto");
    }
  }, [isFollowLoading]);

  return !shouldRender ? (
    <Fragment />
  ) : !company ? (
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
          <div className={cx("header")}>
            <div className={cx("cover")}>
              <img src="/images/company_cover.jpg" alt="cover" />
            </div>
            <div className={cx("logo")}>
              <img src={company?.logo} alt="logo" />
            </div>

            <div className={cx("company-detail")}>
              <div className={cx("box-detail")}>
                <h1>{company?.name}</h1>
                <p style={{ maxWidth: "800px" }}>{company?.address}</p>
                <div className={cx("users-follow")}>
                  <FontAwesomeIcon icon={faUserGroup} />
                  <span>{company?.users_followed?.length} người theo dõi</span>
                </div>
              </div>
            </div>

            {!loading && (
              <div
                ref={followBtnRef}
                onClick={handleClick}
                className={cx("btn-follow")}
              >
                {!isFollow && <FontAwesomeIcon icon={faPlus} />}

                <span>{isFollow ? "Đang theo dõi" : "Theo dõi công ty"}</span>
              </div>
            )}
          </div>
        </div>
        <div className={cx("company-description")}>
          <div className={cx("company-info")}>
            <h2 className={cx("title")}>Giới thiệu công ty</h2>
            <div className={cx("box-body")}>
              <div
                className={cx("job-detail")}
                dangerouslySetInnerHTML={{
                  __html: company?.description as string,
                }}
              />
            </div>

            <div className={cx("company-job")}>
              <h2 className={cx("title")}>Tuyển dụng</h2>
              <div className={cx("box-body")}>
                <div className={cx("job-search")}>
                  <div className={cx("input-group")}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                      type="text"
                      onChange={handleChange}
                      className={cx("form-control")}
                      placeholder="Tên công việc"
                    />
                  </div>

                  <button onClick={handleSearch} className={cx("btn-search")}>
                    <span>Tìm kiếm</span>
                  </button>
                </div>

                <div className={cx("job-wrapper")}>
                  {isSearching ? (
                    <>
                      <Skeleton
                        style={{ marginBottom: "15px" }}
                        avatar
                        active
                        paragraph={{ rows: 2 }}
                      />
                      <Skeleton avatar active paragraph={{ rows: 2 }} />
                    </>
                  ) : jobs.length > 0 ? (
                    jobs?.map((job: IJob) => (
                      <JobCard key={job.id} job={job} company={company} />
                    ))
                  ) : (
                    <Result
                      status="404"
                      subTitle="Chưa tìm thấy việc làm phù hợp yêu cầu tìm kiếm của bạn"
                    />
                  )}
                </div>

                {(meta?.total as number) > 0 && (
                  <div className={cx("view-more")}>
                    <div className={cx("paginate")}>
                      <button
                        onClick={handlePrev}
                        ref={btnPrevRef}
                        className={cx("btn")}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>
                      <span>
                        {meta?.current}/{meta?.pages} trang
                      </span>
                      <button
                        onClick={handleNext}
                        ref={btnNextRef}
                        className={cx("btn")}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={cx("company-comment")}>
              <div className={cx("section-comment")}>
                <div className={cx("comment-header")}>
                  <h2 className={cx("comment-title")}>
                    {totalComments} bình luận
                  </h2>
                  <div className={cx("comment-form")}>
                    <input
                      onChange={handleComment}
                      value={commentValue}
                      onKeyDown={handleSendComment}
                      type="text"
                      placeholder="Viết bình luận"
                      className={cx("form-control")}
                    />
                    <button
                      onClick={handleSubmit}
                      className={cx("send-comment")}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
                <div className={cx("bar")} />

                <div className={cx("comment-list")}>
                  {comments?.map((comment: IComment) => {
                    return (
                      <CompanyComment
                        setComments={setComments}
                        company={company}
                        setTotalComments={setTotalComments}
                        level={0}
                        key={comment.id}
                        comment={comment}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={cx("company-location")}>
            <div className={cx("section-contact")}>
              <h2 className={cx("title")}>Thông tin liên hệ</h2>
              <div className={cx("box-body")}>
                <div className={cx("contact-item")}>
                  <div className={cx("item-caption")}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>Địa chỉ công ty</span>
                  </div>
                  <div className={cx("desc")}>{company?.address}</div>
                </div>

                <div className={cx("map")}>
                  <iframe
                    src="https://www.google.com/maps/d/embed?mid=1hSJI5w-gsG-RFj5jcwFJKP_7aEU&hl=en_US&ehbc=2E312F"
                    width="640"
                    height="480"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
