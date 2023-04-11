import React from "react";
import axios from '../axios';

import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
  const navigate = useNavigate();
  const [post,setPost] = React.useState(null);
  const { id } = useParams();

  React.useEffect(()=>{
    axios.get(`/posts/${id}`).then(({data}) => setPost(data)).catch(err=>{
      alert('Не удалось получить статью!');
      navigate('/');
    });
  },[]);

  if(!post){
    return <Post isLoading/>
  }

  return (
    <>   
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imgUrl ? `http://localhost:8000${post.imgUrl}` : ''}
        user={{
          avatarUrl: post.author.avatarUrl,
          fullName: post.author.nickname,
        }}
        createdAt={post.createdAt.substr(0,10)}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post> 
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
