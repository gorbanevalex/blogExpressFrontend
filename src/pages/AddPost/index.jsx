import React from "react";
import axios from "../../axios";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Link, Navigate, useParams } from "react-router-dom";

export const AddPost = () => {
  const { id } = useParams();

  const [postId, setPostId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [textField, settextField] = React.useState("");
  const [titleField, setTitleField] = React.useState("");
  const [tagsField, setTagsField] = React.useState("");
  const fileInputRef = React.useRef(null);

  const isEdited = Boolean(id);

  const handleChangeFile = () => {
    let file = fileInputRef.current.files[0];
    let formData = new FormData();
    formData.append("image", file);
    axios
      .post("/upload", formData)
      .then((res) => {
        setImageUrl(res.data.url);
      })
      .catch((err) => {
        alert("Произошла ошибка при загрузке фотографии!");
      });
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
    fileInputRef.current.value = "";
  };

  const onChange = React.useCallback((textField) => {
    settextField(textField);
  }, []);

  React.useEffect(() => {
    if (id) {
      axios
        .get(`posts/${id}`)
        .then((res) => {
          setImageUrl(res.data.imgUrl);
          settextField(res.data.text);
          setTitleField(res.data.title);
          setTagsField(res.data.tags.join(","));
        })
        .catch((err) => {
          alert("Произошла ошибка при получении поста!");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const onSubmit = () => {
    const tags = tagsField.split(",").map((item) => item.trim());
    const params = {
      title: titleField,
      text: textField,
      imgUrl: imageUrl,
      tags,
    };

    if (isEdited) {
      axios
        .patch(`/posts/${id}`, params)
        .then((res) => {
          setPostId(id);
        })
        .catch((err) => {
          alert("Произошла ошибка!");
        });
    } else {
      axios
        .post(`/posts`, params)
        .then((res) => {
          setPostId(res.data._id);
        })
        .catch((err) => {
          alert("Введите заголовок и текст!");
        });
    }
  };

  if (postId) {
    return <Navigate to={`/posts/${postId}`} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        variant="outlined"
        size="large"
        onClick={() => fileInputRef.current.click()}
      >
        Загрузить превью
      </Button>
      <input
        type="file"
        onChange={handleChangeFile}
        hidden
        ref={fileInputRef}
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://45.141.76.148:8000${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={titleField}
        onChange={(e) => setTitleField(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tagsField}
        onChange={(e) => setTagsField(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={textField}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size="large" variant="contained" onClick={onSubmit}>
          {isEdited ? "Сохранить" : "Опубликовать"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
