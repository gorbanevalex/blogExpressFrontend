import React from "react";
import axios from "../axios";

import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { isAuthCheck } from "../redux/slices/auth";
import { changeComments } from "../redux/slices/posts";

export const FullPost = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.posts.commentsSelect);
  const isAuth = useSelector(isAuthCheck);
  const navigate = useNavigate();
  const [post, setPost] = React.useState(null);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then(({ data }) => {
        setPost(data);
        dispatch(changeComments(data.comments));
      })
      .catch((err) => {
        alert("Не удалось получить статью!");
        navigate("/");
      });
  }, []);

  if (!post) {
    return <Post isLoading />;
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imgUrl ? `http://45.141.76.148:8000${post.imgUrl}` : ""}
        user={{
          avatarUrl: post.author.avatarUrl,
          fullName: post.author.nickname,
        }}
        createdAt={post.createdAt.substr(0, 10)}
        viewsCount={post.viewsCount}
        commentsCount={comments.length}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={false}>
        {isAuth && <Index postId={post._id} />}
      </CommentsBlock>
    </>
  );
};
