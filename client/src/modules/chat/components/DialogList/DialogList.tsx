import React from "react";
import DialogListItem from "./DialogListItem/DialogListItem";
import "./dialog_list.scss";
import avatar from "../assets/img/avatar.jpg";
import SearchForm from "./SearchForm/SearchForm";
import BurgerIcon from "./BurgerIcon/BurgerIcon";

const DialogList: React.FC = () => {
  const items = [
    {
      user: {
        _id: new Date(2021, 1, 15, 10).toString(),
        firstName: "Вася",
        lastName: "Петров",
        online: false,
        login: "vasya",
      },
      message: {
        text: "Здарова бро!",
        count: 500,
      },
      date: new Date(2021, 1, 15, 10),
      hadRead: true,
    },
    {
      user: {
        _id: new Date(2021, 1, 16, 12).toString(),
        firstName: "Карен",
        lastName: "Книголюбов",
        login: "dumbassov",
        avatar: avatar,
        online: true,
      },
      message: {
        text: "Вчера прочитал Шерлока!",
      },
      date: new Date(2021, 1, 16, 12),
      hadRead: true,
    },
  ];

  return (
    <div className="dialog-list">
      <div className="dialog-list__header">
        <BurgerIcon />
        <SearchForm />
      </div>
      {
        items.sort((a, b) => {
          return new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1;
        }).map(item => <DialogListItem
          key={item.user._id}
          user={item.user}
          message={item.message}
          date={item.date}
          hadRead={item.hadRead}
        />)
      }
    </div>
  );
};

export default DialogList;