import { useState, useEffect } from 'react';
import axios from 'axios';


function UserTodosComp({userTodos, updateUserTask}) {

  // when app user click on 'Mark Completed' for task that was not completed -> call father component (Users) function (updateUserTask) and pass necesery data
  const todoToUpdate = () => {
    updateUserTask(userTodos.userId, userTodos.title)
  }

  return (
    <div style={{ border: '2px solid purple', width: '350px', marginLeft: '15px'}}>
      <br></br>
      Title: {userTodos.title}                              <br></br>
      Completed: {String(userTodos.completed)}       {!userTodos.completed && <button onClick={todoToUpdate}>Mark Completed</button>}       <br></br>
      <br></br>
    </div>
  );
}

export default UserTodosComp;
