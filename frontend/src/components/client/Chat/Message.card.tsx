import { IChat, IUser } from "@/types/backend";
import React, { useState } from "react";
import classnames from "classnames/bind";
import styles from "../../../styles/Chat.module.scss";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { message, Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib";
import { deleteChat } from "@/config/api";

const cx = classnames.bind(styles);

interface IProps {
  chat: IChat;
  userId: string;
  messages: IChat[];
  setMessages: React.Dispatch<React.SetStateAction<IChat[]>>;
  target: number;
}

const MessageCard = (props: IProps) => {
  const { chat, userId, messages, setMessages, target } = props;
  const [open, setOpen] = useState(false);

  const confirm: PopconfirmProps["onConfirm"] = async (e) => {
    setMessages((prevMessages) =>
      prevMessages.filter((_, index) => index !== target)
    );
    deleteChat(chat.id?.toString() as string);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    setOpen(false);
  };
  return (
    <div
      style={
        chat.user?.id === userId
          ? { display: "flex", justifyContent: "right" }
          : {}
      }
      className={cx("message-content")}
    >
      <div className={cx("message-box")}>
        <div
          style={
            chat.user?.id === userId
              ? { display: "flex", justifyContent: "right" }
              : {}
          }
          className={cx("message-info")}
        >
          <p>
            Từ <span>{chat.user?.name} </span>(
            {dayjs(chat.createdAt).format("HH:mm:ss")}) :
          </p>
        </div>

        {chat.user?.id === userId && (
          <Popconfirm
            title="Thu hồi"
            description="Bạn có chắc muốn thu hồi tin nhắn?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            open={open}
          >
            <div onClick={() => setOpen(!open)} className={cx("edit-messsage")}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </Popconfirm>
        )}

        {chat.content.length > 0 && (
          <div
            style={chat.user?.id === userId ? { float: "right" } : {}}
            className={cx("message-text")}
          >
            <p>{chat.content}</p>
          </div>
        )}

        <div>
          {(chat.file_url?.length as unknown as number) > 0 && (
            <img
              className={cx("img-file")}
              style={chat.user?.id === userId ? { float: "right" } : {}}
              src={chat.file_url}
              alt="file"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
