import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '../../axios';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthCheck, login } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';


export const Registration = () => {
  const [imgUrl,setImgUrl] = React.useState('');
  const fileInput = React.useRef(null);

  const isAuth = useSelector(isAuthCheck);
  const dispatch = useDispatch();
  const {register, handleSubmit, setError, formState:{ errors,isValid }} = useForm({
    defaultValues:{
      nickname: '',
      email : '',
      password : ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) =>{
    const params = {
      ...values,
      avatarUrl: imgUrl
    }
    axios.post('/user/register',params).then(res=>{
      dispatch(login(res.data));
      window.localStorage.setItem('token',res.data.token);
    }).catch(err=>{
      if(err.response.status === 500){
        setError('email',{message:'Данный логин или email уже зарегестрирован'})
      }else{
        err.response.data.errors.map(item=>setError(item.param,{message:item.msg}))
      }
    })
  }

  const fileChange = () =>{
    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('image',file);
    axios.post('/upload',formData).then(res=>{
      setImgUrl(res.data.url);
    }).catch(err=>{
      alert('При загрузке фотографии произошла ошибка!');
    })
  }

  if(isAuth){
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar} onClick={()=>fileInput.current.click()}>
          <input type="file" hidden ref={fileInput} onChange={fileChange} />
          <Avatar sx={{ width: 100, height: 100 }} src={imgUrl ? `http://localhost:8000${imgUrl}` : ''}  />
        </div>
        <TextField 
          className={styles.field} 
          label="Никнейм" 
          error = {Boolean(errors.nickname?.message)}
          helperText={errors.nickname?.message}
          {...register('nickname',{required:'Укажите никнейм'})}
          fullWidth 
        />
        <TextField 
          className={styles.field} 
          label="E-Mail" 
          error = {Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email',{required:'Укажите e-mail'})}
          fullWidth 
          />
        <TextField 
          className={styles.field} 
          label="Пароль" 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password',{required: 'Укажите пароль'})}
          fullWidth />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
