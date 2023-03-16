import {useState, useEffect} from 'react'
import axios from 'axios'
import { getData, updateUsersUtils, sortItemsUtils } from './Utils'
import Users from './Users'
import './Style.css'
import { v4 as uuidv4 } from 'uuid'

// all api urls used in the app
const usersUrl = 'https://jsonplaceholder.typicode.com/users'
const todosUrl = 'https://jsonplaceholder.typicode.com/todos'
const postsUrl = 'https://jsonplaceholder.typicode.com/posts'

function App() {

  // the database of the app
  const [allUsers, setAllUsers] = useState([])
  const [allTodos, setAllTodos] = useState([])
  const [allPosts, setAllPosts] = useState([])

  // state to determite if some of the ids labels (on Users component) is already clicked
  const [access, setAccess] = useState(true)

  // users that will be displayed on the app according the value inside the search text input
  const [usersToDisplay, setUsersToDisplay] = useState([])
  const [searchboxInput, setSearchboxInput] = useState('')

  // when user click on add button next to the search element -> add div for adding user will apear
  const [newUserDiv, setNewUserDiv] = useState(false)

  // states for entering new users name & email when adding new user
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

  // this useEffect will run once - initialize the database above, all users will be displayed at beggining
  useEffect(() => {
    // using 'getData' from 'Utils' file - get all data from api and store it in state = our database in this app
    const fetchData = async () => {
      const { data: users } = await getData(usersUrl)
      const { data: todos } = await getData(todosUrl)
      const { data: posts } = await getData(postsUrl)
      // database initialization
      setAllUsers(users)
      setAllTodos(todos)
      setAllPosts(posts)
      // at begging of app - all users will be displayed
      setUsersToDisplay(users)
    }
    fetchData()
  }, [])
  
  // will be activated every time the searchbox input will be changed ('searchboxInput') // or when we update our db (allUsers, allTodos, allPosts)
  // will update 'usersToDisplay' state (users that will be displayed on the app)
  useEffect(() => {
    
    // user contains 'seacthboxInput' value inside their 'name'/'email' will be displayed
    if(searchboxInput.length != 0) {
      let usersToDisplay = []
      allUsers.forEach(user => {
        if(user.name.includes(searchboxInput) || user.email.includes(searchboxInput)) {
          usersToDisplay.push(user)
        }
      })
      setUsersToDisplay(usersToDisplay)
    }
    // if the text in the search input is empty -> all users from database will be displayed
    else {
      setUsersToDisplay(allUsers)
    }
    
  }, [searchboxInput, allUsers, allTodos, allPosts])
  

  // this function will be sent to 'Users' component 
  // 'updatedUser' is the user from database that his fields were updated in the app (a value returned from 'Users' (child component))
  const updateUsers = (updatedUser) => {
    // using 'updateUserUtils' function from 'Utils' file to update users
    let newAllUsers = updateUsersUtils(updatedUser, allUsers)
    setAllUsers(newAllUsers)
  }

  // this function will be sent to 'Users' component
  // 'UserId'- is a value from child component 'Users' - id of the user that supposed to be deleted
  const deleteUser = (userId) => {
    // create new array of users without the user that supposed to be deleted and update users database
    let updatedUsers = allUsers.filter((user) => user.id !== userId)
    setAllUsers(updatedUsers)
    // doing same thing for todos
    let updatedTodos = allTodos.filter((todo) => todo.userId !== userId)
    setAllTodos(updatedTodos)
    // and posts
    let updatedPosts = allPosts.filter((post) => post.userId !== userId)
    setAllPosts(updatedPosts)
  }
  
  // add new user to database
  const addUser = () => {
    // create new user using 'uuidv4' to create unique id
    let newUser = {id: uuidv4(), name: newUserName, email: newUserEmail, address: {street: '', city: '', zipcode: ''}}
    // create new array with all the users from database
    let newAllUsers = allUsers.map((user) => {
      return user
    })
    // add the new user created and sort all users by id to display them in ascending order by id
    newAllUsers.push(newUser)
    newAllUsers.sort((a, b) => a.id - b.id)
    setAllUsers(newAllUsers)
    // after adding user -> display users list
    setNewUserDiv(false)
  }

  // after app user marked unfinished task -> update the right todo item from db (change 'completed' = true)
  const updateUserTodo = (userId, todoTitle) => {
    // create new array with all todos and change the selected value
    let newAllTodos = allTodos.map((todo) => {
      if(todo.userId == userId && todo.title == todoTitle) {
        return {userId: todo.userId, id: todo.id, title: todo.title, completed: true}
      }
      else {
        return todo
      }
    })
    setAllTodos(newAllTodos)
  }

  // recive new todo (json) from child component (Users) and add it to db
  const addNewTodo = (todo) => {
    // add new unique id to the json recived from child component
    let newTodo = {...todo, id: uuidv4()}
    // create new array of jsons with all the todos + push the new todo inside
    let newAllTodos = allTodos.map((todo) => {
      return todo
    })
    newAllTodos.push(newTodo)
    
    // sort the items according to 'userId' and 'id' using function from 'Utils' file, then update db
    newAllTodos = sortItemsUtils(newAllTodos)
    setAllTodos(newAllTodos)
  }

  // recive new post (json) from child component (Users) and add it to db
  const addNewPost = (post) => {
    // add new unique id to the json recived from child component
    let newPost = {...post, id: uuidv4()}
    // create new array of jsons with all the posts + push the new post inside
    let newAllPosts = allPosts.map((post) => {
      return post
    })
    newAllPosts.push(newPost)

    // sort the items according to 'userId' and 'id' using function from 'Utils' file, then update db
    newAllPosts = sortItemsUtils(newAllPosts)
    setAllPosts(newAllPosts)
  }

  // function that change 'access' state when user click on one of the ids labels on 'Users' component
  const updateAccess = (value) => {
    setAccess(value)
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "50%" }}>
        Search  <input type='text' onChange={(e) => setSearchboxInput(e.target.value)}></input>
                <button onClick={() => setNewUserDiv(true)}>Add</button>  <br></br><br></br>
        {
          // render every user from 'usersToDisplay' into 'Users' component
          usersToDisplay.map(user => {
            // render all todos data of each user to 'Users' component
            let userTodos = []
            allTodos.map(todo => {
              if(todo.userId == user.id) {
                userTodos.push(todo)
              }
            })
            // render all posts data of each user to 'User' component
            let userPosts = []
            allPosts.map(post => {
              if(post.userId == user.id) {
                userPosts.push(post)
              }
            })
            // loop on current user and check if current user has uncompleted task (todo) and pass true/false to child component 'Users'
            let completed = true
            userTodos.map(todo => {
              if(todo.completed == false){
                completed = false
                return
              }
            })

            return (
                <Users key={user.id} user={user} userTodos={userTodos} userPosts={userPosts} completed={completed} updateUsersDB={updateUsers}
                deleteUserDB={deleteUser} updateUserTodo={updateUserTodo} addTodo={addNewTodo} addPost={addNewPost} access={access} updateAccess={updateAccess}/>
            )
          })
        }
      </div>
      {/* when user click 'add' button next to users searchbox */}
      <div style={{ width: "50%", marginLeft: "20px" }}>
          {newUserDiv && <div>
                            Add New User    <br></br><br></br>
                            <div style={{ border: '2px solid black', width: '300px'}}>
                              <br></br>

                              <div style={{marginLeft: '25px'}}>
                                Name:     <input type='text' onInput={(e) => setNewUserName(e.target.value)}></input>     <br></br>
                                Email:    <input type='text' onInput={(e) => setNewUserEmail(e.target.value)}></input>    <br></br><br></br>
                              </div>

                              <div style={{marginLeft: '170px'}}>
                                <button onClick={() => setNewUserDiv(false)}>Cancel</button> <button onClick={addUser}>Add</button>   <br></br><br></br>
                              </div>
                            </div>
                          </div>}
      </div>
    </div>
  );

}

export default App;
