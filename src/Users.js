import {useState, useEffect} from 'react'
import axios from 'axios'
import './Style.css'
import UserTodosComp from './UserTodosComp'
import UserPostsComp from './UserPostsComp'
import { Alert } from 'react-alert'


function Users({user, userTodos, userPosts, completed, updateUsersDB, deleteUserDB, updateUserTodo, addTodo, addPost, access, updateAccess}) {

  // when user mousehover/click on 'Other Data' button in the app -> display/hide 'other data'
  const [isVisible, setIsVisible] = useState(false)
  // when user click on id label -> make specific user selected (by color his background with orange color)
  const [selected, setSelected] = useState(false)
  // when user click on 'todos' 'add' button -> the list of todos will be replaced with format for adding new todo for specific user
  const [todosAdd, setTodosAdd] = useState(false)
  // when user click on 'posts' 'add' button -> the list of posts will be replaced with format for adding new post for specific user
  const [postsAdd, setPostsAdd] = useState(false)

  // states for the values that will be displayed on the app
  const [nameValue, setNameValue] = useState(user.name)
  const [emailValue, setEmailValue] = useState(user.email)
  const [streetValue, setStreetValue] = useState(user.address.street)
  const [cityValue, setCityValue] = useState(user.address.city)
  const [zipcodeValue, setZipcodeValue] = useState(user.address.zipcode)

  // save the name of title/post when adding new todo/post
  const [newTitleName, setNewTitleName] = useState('')
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostBody, setNewPostBody] = useState('')
  
  // will be activated after clicking on 'Update' button
  const update = () => {
    // create new user then sends it to main component
    let newUser = {...user, name: nameValue, email: emailValue, address: {...user.address, street: streetValue, city: cityValue, zipcode: zipcodeValue}}
    updateUsersDB(newUser)
  }

  // will be activated after clicking on 'Delete' button
  const deleteUser = () => {
    // sends id of the user supposed to be deleted to main component
    deleteUserDB(user.id)
  }

  // after app user marked unfinished task -> call father component (App) function (updateUserTodo) and pass necessery data
  const updateUserTask = (userId, todoTitle) => {
    updateUserTodo(userId, todoTitle)
  }

  // activates when user adds new todo
  const addNewTodo = () => {
    // create new json and pass it to father component (App) using 'addTodo'
    let newTodo = {userId: user.id, id: '', title: newTitleName, completed: false}
    addTodo(newTodo)
    // after adding new todo -> exit to todos list
    setTodosAdd(false)
    // empty title input box for next add
    setNewTitleName('')
  }

  // activates when user adds new post
  const addNewPost = () => {
    // create new json and pass it to father component (App) using 'addPost'
    let newPost = {userId: user.id, id: '', title: newPostTitle, body: newPostBody}
    addPost(newPost)
    // after adding new post -> exit to posts list
    setPostsAdd(false)
    // empty title & body input boxes for next add
    setNewPostTitle('')
    setNewPostBody('')
  }

  // only one label id can be opened in the same time
  const openIdLabel = () => {
    // click on id label when is allowed to acces
    if(access == true && selected == false) {
      // open todo & posts lists for user
      setSelected(true)
      // cannot access other id label for other user
      updateAccess(false)
    }
    // one of users id label already clicked + closing the id label that already opened
    else if(access == false && selected == true) {
      // close todo & posts lists for user
      setSelected(false)
      // access to id label allowed now
      updateAccess(true)
    }
    // one of users id label already clicked + try open another id label
    else if(access == false && selected == false) {
      alert("Some id label already opened")
    }
  }

  return (
    <div>

      {/* display all the users of the app with data fields : id, name, email, button: other data, update, delete */}
      <div style={{ border: completed ? '2px solid green' : '2px solid red', width: '300px', background: selected? 'orange' : 'white'}}>
        <div style={{marginLeft: '15px'}}>

          {/* id */}
          <label onClick={openIdLabel}>ID:  {user.id}</label>

          <br></br>

          {/* name & email */}
          Name: <input type='text' value={nameValue} onInput={(e) => setNameValue(e.target.value)}></input> <br></br>
          Email: <input type='text' value={emailValue} onInput={(e) => setEmailValue(e.target.value)}></input> <br></br>
        </div>

        {/* other data button & the data displayed/disapear after mousehover/click */}
        <div style={{marginLeft: '5px'}}>
          <button onMouseOver={(e) => setIsVisible(true)} onClick={(e) => setIsVisible(false)}>Other Data</button> 
          {isVisible && 
                      <div style={{ 
                        width: '280px', 
                        height: '110px', 
                        borderRadius: '20% / 30%', 
                        border: '2px solid black',
                        background: 'rgb(230, 230, 230)',
                      }}>   <br></br>
                          <div style={{marginLeft: '15px'}}>
                            Street: <input type='text' value={streetValue} onInput={(e) => setStreetValue(e.target.value)}></input>     <br></br>
                            City: <input type='text' value={cityValue} onInput={(e) => setCityValue(e.target.value)}></input>         <br></br>
                            Zip Code: <input type='text' value={zipcodeValue} onInput={(e) => setZipcodeValue(e.target.value)}></input>  <br></br><br></br>
                          </div>
                      </div>}
                      
                      {/* update & delete buttons */}
                      <button onClick={update}>Update</button>   <button onClick={deleteUser}>Delete</button>
          <br></br><br></br>
        </div>
      </div>

      {/* when user click on one of users id label, todos & posts lists will appear */}
      <div className='centerDiv'>
        {selected  && <div>
                                {/* todolist will apear first */}
                        <div style={{visibility: todosAdd? 'hidden' : 'visible'}}>
                          Todos - User {user.id}        <button onClick={() => setTodosAdd(true)}>Add</button>  <br></br><br></br>
                          <div style={{ border: '2px solid black', width: '400px'}}>
                            {
                              // sends every 'todo' of specific user to child component - 'UserTodosComp'
                              userTodos.map((userTodo, index) => {
                                return (
                                  <div key={index}>
                                    <br></br>
                                    <UserTodosComp userTodos={userTodo} updateUserTask={updateUserTask}/>
                                    <br></br>
                                  </div>
                                )
                              })
                              }
                          </div>
                        </div>

                        {/* add new todo (when user clicks on 'add' button on todos list) */}
                        <div style={{visibility: todosAdd? 'visible' : 'hidden'}}>
                          New Todo - User {user.id}   <br></br>
                              <div style={{border: '2px solid black', width: '400px'}}>
                                Title: <input type='text' onInput={(e) => setNewTitleName(e.target.value)} value={newTitleName}></input>      <br></br>
                                <button onClick={() => setTodosAdd(false)}>Cancel</button><button onClick={addNewTodo}>Add</button>
                              </div>
                        </div>
                                    <br></br>

                        {/* posts list will apear first  */}
                        <div style={{visibility: postsAdd? 'hidden' : 'visible'}}>
                          Posts - User {user.id}      <button onClick={() => setPostsAdd(true)}>Add</button>    <br></br><br></br>
                          <div style={{ border: '2px solid black', width: '400px'}}>
                          {
                            // sends every 'post' of specific user to child component - 'UserTodosComp'
                            userPosts.map((userPost, index) => {
                              return (
                                <div key={index}>
                                  <br></br>
                                  <UserPostsComp userPost={userPost}/>
                                  <br></br>
                                </div>
                              )
                            })
                          }
                          </div>
                        </div>

                        {/* add new post (when user clicks on 'add' button on posts list) */}
                        <div style={{visibility: postsAdd? 'visible' : 'hidden'}}>
                          New Post - User {user.id}   <br></br>
                            <div style={{border: '2px solid black', width: '400px'}}>
                              Title: <input type='text' onInput={(e) => setNewPostTitle(e.target.value)} value={newPostTitle}></input>      <br></br>
                              Body: <input type='text' onInput={(e) => setNewPostBody(e.target.value)} value={newPostBody}></input>       <br></br>
                              <button onClick={() => setPostsAdd(false)}>Cancel</button><button onClick={addNewPost}>Add</button>
                            </div>
                        </div>

                      </div>}
      </div>

    </div>
    
  );
}

export default Users;
