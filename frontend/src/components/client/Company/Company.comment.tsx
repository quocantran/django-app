"use client";

import { Avatar, Flex, message, notification, Popconfirm, Spin } from "antd";
import classnames from "classnames/bind";
import React, { useState } from "react";
import styles from "../../../styles/CompanyInfo.module.scss";
import { IComment, ICompany, IMeta } from "@/types/backend";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";
import { LoadingOutlined } from "@ant-design/icons";
import {
  createComment,
  deleteComment,
  getCommentsByParent,
} from "@/config/api";
import { useAppSelector } from "@/lib/redux/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { PopconfirmProps } from "antd/lib";

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.locale("vi");

const cx = classnames.bind(styles);

interface IProps {
  comment: IComment;
  level: number;
  setTotalComments: (s: any) => void;
  setComments: (s: any) => void;
  company: ICompany;
  setChildCommentsFromParent?: (s: any) => void;
  childCommentsFromParent?: IComment[];
}

const CompanyComment = (props: IProps) => {
  const {
    comment,
    level,
    company,
    setTotalComments,
    setComments,
    setChildCommentsFromParent,
    childCommentsFromParent,
  } = props;

  const [childComments, setChildComments] = useState<IComment[]>([]);

  const [totalChildComments, setTotalChildComments] = useState<number>(0);

  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  const isAuth = useAppSelector((state) => state.auth?.isAuthenticated);

  const userId = useAppSelector((state) => state.auth?.user?.id);

  const [commentValue, setCommentValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(1);

  const [meta, setMeta] = useState<IMeta>();

  const [isAnswer, setIsAnswer] = useState<boolean>(false);

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      if (commentLoading) return;

      if (!isAuth) {
        message.error("Vui lòng đăng nhập");
        return;
      }
      if (!commentValue.trim()) return;
      setCommentLoading(true);
      const res = await createComment({
        company: company?.id as string,
        content: commentValue,
        parentId: comment.id,
      });

      if (res.data) {
        setChildComments((prev: any) => {
          return [res.data, ...prev];
        });
        message.success("Bình luận thành công");
        setTotalComments((prev: any) => prev + 1);
        setCommentValue("");
      }
      setCommentLoading(false);
    }
  };

  const handleClick = async () => {
    if (commentLoading) return;

    if (!isAuth) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    if (!commentValue.trim()) return;

    setCommentLoading(true);

    const res = await createComment({
      company: company?.id as string,
      content: commentValue,
      parentId: comment.id,
    });

    if (res.data) {
      setChildComments((prev: any) => {
        return [res.data, ...prev];
      });

      message.success("Bình luận thành công");
      setTotalComments((prev: any) => prev + 1);
      setCommentValue("");
    }
    setCommentLoading(false);
  };

  const confirm: PopconfirmProps["onConfirm"] = async (e) => {
    if (!comment.parentId) {
      const res = await deleteComment(comment.id as string);
      if (res.statusCode !== 200) {
        notification.error({
          message: "Xóa bình luận thất bại",
          description: res.message,
        });
        return;
      }
      const cmt = res.data as IComment;
      setComments((prev: any) => {
        return prev.filter((item: any) => item.id !== comment.id);
      });
      setTotalComments(
        (prev: any) => prev - ((cmt.right - cmt.left - 1) / 2 + 1)
      );
      message.success("Xóa bình luận thành công");
    } else {
      console.log("delete child comment");

      const res = await deleteComment(comment.id as string);
      if (res.statusCode !== 200) {
        notification.error({
          message: "Xóa bình luận thất bại",
          description: res.message,
        });
        return;
      }
      const cmt = res.data as IComment;
      if (setChildCommentsFromParent) {
        setChildCommentsFromParent((prev: any) => {
          return prev.filter((item: any) => item.id !== comment.id);
        });

        setTotalComments(
          (prev: any) => prev - ((cmt.right - cmt.left - 1) / 2 + 1)
        );
      }

      message.success("Xóa bình luận thành công");
    }
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {};

  const fetchChildComments = async () => {
    setLoading(true);
    const res = await getCommentsByParent({
      current: current,
      parentId: comment.id,
      pageSize: 1,
    });

    if (res.data) {
      setChildComments((prev) => [
        ...prev,
        ...(res.data?.result as IComment[]),
      ]);
      setMeta(res.data.meta);
      setCurrent((prev) => prev + 1);
      const data = res.data.result as IComment[];

      const total = data.reduce((acc, cur) => {
        return acc + (cur.right - cur.left - 1) / 2 + 1;
      }, 0);

      setTotalChildComments((prev) => prev + total);
    }
    setLoading(false);
  };

  return (
    <div
      style={{ marginLeft: `${level > 0 ? "50px" : "0px"}` }}
      className={cx("comment-wrapper")}
    >
      <div className={cx("comment-item")}>
        <Avatar
          style={{
            width: `${48 - level * 10 > 10 ? 48 - level * 10 : 10}px`,
            height: `${48 - level * 10 > 10 ? 48 - level * 10 : 10}px`,
          }}
        >
          {" "}
          {comment.user.name.substring(0, 2).toUpperCase()}{" "}
        </Avatar>
        <div className={cx("comment-content")}>
          <p className={cx("comment-name")}>{comment.user.name}</p>
          <p className={cx("comment-desc")}>{comment.content}</p>
          <p className={cx("comment-time")}>
            {dayjs(comment.created_at).fromNow()}

            <span
              onClick={() => setIsAnswer(!isAnswer)}
              className={cx("comment-answer")}
            >
              Trả lời
            </span>
          </p>
        </div>
        {comment.user.id === userId && (
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <div className={cx("comment-delete")}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </Popconfirm>
        )}
      </div>
      {isAnswer && (
        <div style={{ margin: "10px 40px" }} className={cx("comment-form")}>
          <input
            value={commentValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setCommentValue(e.target.value)}
            style={{ width: `${82 - level * 3}%` }}
            placeholder="Viết bình luận"
            className={cx("form-control")}
          />
          <button onClick={handleClick} className={cx("send-comment")}>
            Gửi
          </button>
        </div>
      )}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Flex align="center" gap="middle">
            <Spin indicator={<LoadingOutlined spin />} />
          </Flex>
        </div>
      )}
      {childComments.map((childComment) => (
        <CompanyComment
          setComments={setComments}
          setChildCommentsFromParent={setChildComments}
          childCommentsFromParent={childComments}
          company={company}
          setTotalComments={setTotalComments}
          key={childComment.id}
          comment={childComment}
          level={level + 1}
        />
      ))}
      {(comment.right - comment.left - 1) / 2 - totalChildComments > 0 &&
        !loading && (
          <div onClick={fetchChildComments} className={cx("comment-more")}>
            <p>
              Xem thêm{" "}
              {Math.floor(
                (comment.right - comment.left - 1) / 2 - totalChildComments
              )}{" "}
              câu trả lời
            </p>
          </div>
        )}
    </div>
  );
};

export default CompanyComment;
