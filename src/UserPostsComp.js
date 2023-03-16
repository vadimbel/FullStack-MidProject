import { useState, useEffect } from 'react';
import axios from 'axios';


function UserPostsComp({userPost}) {

  

  return (
    <div style={{ border: '2px solid purple', width: '350px', marginLeft: '15px'}}>
      <br></br>
      Title: {userPost.title}   <br></br>
      Body: {userPost.body}     <br></br>
      <br></br>
    </div>
  );
}

export default UserPostsComp;
