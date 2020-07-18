import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import './Join.css'

const Join = () =>{
    const [name,setName] = useState('')
    const [room,setRoom] = useState('')
    const [email,setEmail] = useState('')
    const [mobile,setMobile] = useState('')

    return(
         <div className="joinOuterContainer">
             <div className="joinInnerContainer">
                 <h1 className="heading">User join</h1>
                 <div><input className="joinInput" placeholder="name" type="text" onChange={(event)=>setName(event.target.value) }/></div>
                 <div><input className="joinInput" type="text"placeholder="email"  onChange={(event)=>setEmail(event.target.value)} /></div>
                 <div><input className="joinInput" type="text"placeholder="mobile"  onChange={(event)=>setMobile(event.target.value)} /></div>
                 <div><input className="joinInput" type="text"placeholder="room"  onChange={(event)=>setRoom(event.target.value)} /></div>
                 <Link onClick={event=>(!name || !room)?event.preventDefault():null }to={`/chat?name=${name}&room=${room}&email=${email}&mobile=${mobile}`}><button className="button mt-20" type="submit">Sign In</button></Link>
             </div>
         </div>
    )
}
export default Join