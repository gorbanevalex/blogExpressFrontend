import React from "react";

import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import { useSelector } from "react-redux";
import { isAuthCheck } from "../redux/slices/auth";
import CommentsItem from "./CommentsItem";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const isAuth = useSelector(isAuthCheck);

  return (
    <SideBlock title={isAuth ? "Комментарии" : "Войдите чтобы оставить свой комментарий"}>
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <CommentsItem isLoading={isLoading} comment={obj}/>
            </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
