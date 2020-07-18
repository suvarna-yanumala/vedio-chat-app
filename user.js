
const users = [];

export const addUser = ({id,name,email,mobile,room})=>{ 

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  email = room.trim().toLowerCase();
  mobile = room.trim().toLowerCase();

  const existingUser = users.find((user)=> user.email === email);

  if(!email) return {error: 'email is required.'}
  
  if(existingUser){
    return {error: 'email is taken'};
  }

  const user = {id,name,email,mobile,room };

  users.push(user);

  return {user}
}

export const removeUser = (id)=>{
  const index = users.findIndex((user)=> user.id===id);
  
  if(index!==-1){
    return users.splice(index,1)[0];
  }
}

export const getUser = (id)=>{
  let result = users.find(user=> user.id===id);
  return result;
}

export const getUsers = () => {
  return users
}
