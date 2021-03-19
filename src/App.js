import React, {Suspense} from 'react';
import './App.css';
// import MyErrorBoundary from './MyErrorBoundary';

// import logo from "./logo-instagram2.png";
import logo from "./instagram-logo3.jpg";
// import Post from './Post';
import { useEffect, useState } from 'react';
import {db, auth} from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
// import Modal from "@material-ui/core/Modal"
import { Avatar, Button } from '@material-ui/core';
import {Input} from "@material-ui/core"
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import PWAPrompt from 'react-ios-pwa-prompt'

// import ImageUpload from "./ImageUpload"
// const PWAPrompt = React.lazy(() => import('react-ios-pwa-prompt'))
 // const logo = React.lazy(() => import('./instagram-logo.png'));
const Modal = React.lazy(() => import("@material-ui/core/Modal"))
const Menu = React.lazy(() => import("@material-ui/core/Menu"))
const MenuItem = React.lazy(() => import("@material-ui/core/MenuItem"))
const Post = React.lazy(() => import('./Post'));
// const Modal = React.lazy(() => import('@material-ui/core/Modal'));
// const Avatar = React.lazy(() => import('@material-ui/core'));
// const Button = React.lazy(() => import('@material-ui/core'));
// const Input = React.lazy(() => import('@material-ui/core'));
// const Menu = React.lazy(() => import('@material-ui/core/Menu'));
// const MenuItem = React.lazy(() => import('@material-ui/core/MenuItem'));
const ImageUpload = React.lazy(() => import('./ImageUpload'));


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    // height:400,
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };




  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
        
      }else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some clean up action
      unsubscribe();
    }
  }, [user, username])


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
          // every time a new post is added this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post:doc.data()
      }))); 
    })
  }, []);



  const signUp = (event) => {
    event.preventDefault();
    
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .then((authUser) => {
      
      return setUsername(authUser.user.displayName)

    })
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="app">
      
      <Suspense fallback={<div style={{fontSize:18}}>Loading ...</div>}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={`modalCustom ${classes.paper}`}>
          <img 
            width={120}
            height={150}
            max-width={120}
            max-height={150}
            className="app__headerImage"
            src={logo} 
            alt="instagram"
          />
          
          <form className="app__signup" action="">
          
            <center>
              
              <Input
                className='input__field'
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
              <Input
              className='input__field'
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              <Input
              className='input__field'
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </center>
            <Button variant="contained" color="primary" type="submit" onClick={signUp}>Sign up</Button>
          </form>
          
        </div>
      </Modal>
      </Suspense>
      <Suspense fallback={<div style={{fontSize:18}}>Loading ...</div>}>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={`modalCustom ${classes.paper}`}>
          
        <img 
            
            className="app__headerImage"
            src={logo} 
            alt="instagram"
          />
          <form className="app__signup" action="">
          
            <center>
              
              <Input
                className='input__field'
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              <Input
              className='input__field'
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              
            </center>
            <Button variant="contained" color="primary" type="submit" onClick={signIn}>Sign in</Button>
          </form>
          
        </div>
      </Modal>
      </Suspense>


      <div className="app__header">
        <img 
          className="app__headerImage"
          src={logo} 
          alt="Instagram"
        />

      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar
          className="post__avatar"
          alt={user ? (`${user.displayName}`):  "Guest"}
          src="/static/images/avatar/1.jpg" />
      </Button>
      <Suspense fallback={<div style={{fontSize:18}}>Loading ...</div>}> 
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Suspense fallback={<div style={{fontSize:18}}>Loading ...</div>}>
        {user ? (
        <MenuItem onClick={() => {auth.signOut()}}> Log out</MenuItem>
      ) : (
        <div className="app__loginContainer">
          <MenuItem onClick={() => {setOpenSignIn(true)}}>Sign in</MenuItem>
          <MenuItem onClick={() => {setOpen(true)}}>Sign up</MenuItem>
          {/* <Button variant="contained" color="primary" onClick={() => {setOpenSignIn(true)}}>Sign in</Button>
          <Button variant="contained" color="primary" onClick={() => {setOpen(true)}}>Sign up</Button> */}
        </div>
        
        
      )}
      </Suspense>
      </Menu>
      </Suspense>




        
      </div>  
      
      <div className="app__posts">
        <div className="left__posts">
        <Suspense fallback={<div style={{fontSize:18}}>Loading ...</div>}>
          {
            posts.map(({id, post}) => (
              <Post postId={id} key={id} username={post.username} user={user} imageUrl={post.imageUrl} caption={post.caption} />
            ))
          }
        </Suspense>
        </div>
      
      </div>
      
      <Suspense fallback={<div>Загрузка...</div>}>
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>Sorry you need to login to upload </h3>
      )}
      </Suspense>
      <PWAPrompt promptOnVisit={1} timesToShow={3} copyClosePrompt="Close" permanentlyHideOnDismiss={false}/>

      {/* bottom navigation */}
      {/* <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
      <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
      <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
    </BottomNavigation> */}
    </div>
  );
}

export default App;
