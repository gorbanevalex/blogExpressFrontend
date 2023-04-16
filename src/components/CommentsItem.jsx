import React from "react";
import axios from "../axios";

import Skeleton from "@mui/material/Skeleton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const CommentsItem = ({ isLoading, comment }) => {
  const [userData, setUserData] = React.useState();
  React.useEffect(() => {
    axios.get(`/user/${comment.authorId}`).then((res) => {
      setUserData(res.data);
    });
  }, [comment]);

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          {!userData ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar
              src={
                userData.avatarUrl
                  ? `http://45.141.76.148:8000${userData.avatarUrl}`
                  : "/noavatar.png"
              }
            />
          )}
        </ListItemAvatar>
        {isLoading && !userData ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Skeleton variant="text" height={25} width={120} />
            <Skeleton variant="text" height={18} width={230} />
          </div>
        ) : (
          <ListItemText
            primary={userData?.nickname ?? ""}
            secondary={comment.text}
          />
        )}
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default CommentsItem;
