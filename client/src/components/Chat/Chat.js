import React, { useState, useEffect,useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import Peer from "simple-peer";
import styled from "styled-components";

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import vedioIcon from '../../icons/vedioicon.png';


const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

const Chat = ({ location }) => {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [mobile,setMobile] = useState("");
  const [room,setRoom] = useState("");
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const ENDPOINT="localhost:5000"

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    const {name, room,email,mobile} = queryString.parse(location.search);
    setName(name)
    setEmail(email)
    setMobile(mobile)
    setRoom(room)
    socket.current = io.connect(ENDPOINT);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })
    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      console.log(users)
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, [ENDPOINT, location.search]);


  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }
  function callPeer(id) {
    console.log("comes to te party")
    const peer = new Peer({
      initiator: true,
      trickle: false,

      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }
  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        {/* <h1>{caller} is calling you</h1> */}

        <h1>customer is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }


  return (
    <div className="outerContainer">

      <div className="container">
        <div className='infoBar'>
          <div className="leftInnerContainer">
            <img src={onlineIcon} alt="online image" />
            <h3 style={{ marginLeft: '8px' }}>{name}</h3>
          </div>
          <div className="rightInnerContainer">
           <a href="/"><img src={closeIcon} alt="close image" /></a>
          </div>
        </div>
        <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call Aent<img src={vedioIcon} alt="vedio image" /></button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
      </div>

    </div>
  )
}

export default Chat