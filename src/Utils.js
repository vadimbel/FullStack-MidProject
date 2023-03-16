import axios from "axios";

const getData = (url) => axios.get(url)

const updateUsersUtils = (updatedUser, allUsers) => {
    // loop over users database & create new array with all users + updated user
    let newAllUsers = allUsers.map((user) => {
        // update the correct user in database
        if(user.id == updatedUser.id) {
          return updatedUser
        }
        else {
          return user
        }
      })
    return newAllUsers
}

const sortItemsUtils = (itemsToSort) => {
  let itemsAfterSorting = itemsToSort.sort((a, b) => {
    if(a.userId < b.userId) {
      return -1
    }
    else if(a.userId > b.userId) {
      return 1
    }
    // If userId is the same, sort by id
    else {
      if (a.id < b.id) {
        return -1
      }
      else if (a.id > b.id) {
        return 1
      }
      else {
        return 0
      }
    }
  })
  return itemsAfterSorting
} 

export {getData, updateUsersUtils, sortItemsUtils};