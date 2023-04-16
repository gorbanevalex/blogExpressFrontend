import React from "react";
import axios from "../../axios";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { addComment, changeComments } from "../../redux/slices/posts";

export const Index = ({ postId }) => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const [textField, setTextField] = React.useState("");
  const submit = () => {
    const params = {
      text: String(textField),
      postId: postId,
    };
    axios
      .post("/posts/comment", params)
      .then((res) => {
        setTextField("");
        dispatch(changeComments(res.data.comments));
      })
      .catch((err) => {
        alert("Ошибка при добавлении комментария!");
      });
  };
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={
            userData.user?.avatarUrl
              ? `http://45.141.76.148:8000${userData.user.avatarUrl}`
              : "/noavatar.png"
          }
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
          />
          <Button
            disabled={Boolean(textField.length <= 0)}
            variant="contained"
            onClick={submit}
          >
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
