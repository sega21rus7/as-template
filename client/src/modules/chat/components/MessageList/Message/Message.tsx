/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ruLocale from "date-fns/locale/ru";
import "./message.scss";
import MessageStatusIcon from "../../MessageStatusIcon/MessageStatusIcon";
import { IUser } from "tools/interfaces";
import Avatar from "../../Avatar/Avatar";
import { useSelector } from "tools/hooks";

interface IProps {
  text: string;
  date: Date;
  author: IUser,
  hasRead?: boolean;
  className: string;
}

const Message: React.FC<IProps> = ({ text, date, author, hasRead, className }) => {
  const userID = useSelector(state => state.auth.user?._id);
  const my = userID === author._id;

  return (
    <div className=
      {my ?
        ["message", "message_my", className].join(" ") :
        ["message", className].join(" ")
      }
    >
      {!my &&
        <Avatar
          // additionalClassNames={["message__avatar"]}
          user={author}
        />
      }
      <div className="message__content">
        <div className="message__bubble">
          <p className="message__text">
            {text}
          </p>
        </div>
        <div className="message__footer">
          <span className="message__date">
            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: ruLocale })}
          </span>
          {my &&
            <span className="message__status">
              <MessageStatusIcon hasRead={hasRead} />
            </span>
          }
        </div>
      </div>
    </div>
  );
};

export default Message;