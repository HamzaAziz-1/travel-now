/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { FaEllipsisH, FaSistrix } from "react-icons/fa";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from "react-redux";
import {
  getFriends,
  messageSend,
  getMessage,
  ImageMessageSend,
  seenMessage,
  updateMessage,
  getTheme,
  themeSet,
} from "../../store/actions/messengerAction";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import useSound from "use-sound";
import notificationSound from "../../assets/audio/notification.mp3";
import sendingSound from "../../assets/audio/sending.mp3";
import { useGlobalContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Messenger = () => {
  const [notificationSPlay] = useSound(notificationSound);
  const [sendingSPlay] = useSound(sendingSound);
  const { user } = useGlobalContext();
  const scrollRef = useRef();
  const socket = useRef();
  const navigate = useNavigate();
  const {
    friends,
    message,
    mesageSendSuccess,
    message_get_success,
    themeMood,
    new_user_add,
  } = useSelector((state) => state.messenger);
 

  const [currentfriend, setCurrentFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [activeUser, setActiveUser] = useState([]);
  const [socketMessage, setSocketMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      setSocketMessage(data);
    });

    socket.current.on("typingMessageGet", (data) => {
      setTypingMessage(data);
    });

    socket.current.on("msgSeenResponse", (msg) => {
      dispatch({
        type: "SEEN_MESSAGE",
        payload: {
          msgInfo: msg,
        },
      });
    });

    socket.current.on("msgDelivaredResponse", (msg) => {
      dispatch({
        type: "DELIVARED_MESSAGE",
        payload: {
          msgInfo: msg,
        },
      });
    });

    socket.current.on("seenSuccess", (data) => {
      dispatch({
        type: "SEEN_ALL",
        payload: data,
      });
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currentfriend) {
      if (
        socketMessage.senderId === currentfriend._id &&
        socketMessage.receiverId === user._id
      ) {
        dispatch({
          type: "SOCKET_MESSAGE",
          payload: {
            message: socketMessage,
          },
        });
        dispatch(seenMessage(socketMessage));
        socket.current.emit("messageSeen", socketMessage);
        dispatch({
          type: "UPDATE_FRIEND_MESSAGE",
          payload: {
            msgInfo: socketMessage,
            status: "seen",
          },
        });
      }
    }
    setSocketMessage("");
  }, [socketMessage]);

  useEffect(() => {
    socket.current.emit("addUser", user?._id, user);
  }, []);

  useEffect(() => {
    socket.current.on("getUser", (users) => {
      const filterUser = users?.filter((u) => u.userId !== user._id);
      setActiveUser(filterUser);
    });

    socket.current.on("new_user_add", (data) => {
      dispatch({
        type: "NEW_USER_ADD",
        payload: {
          new_user_add: data,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage.senderId !== currentfriend._id &&
      socketMessage.receiverId === user._id
    ) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} Send a New Message`);
      dispatch(updateMessage(socketMessage));
      socket.current.emit("delivaredMessage", socketMessage);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          msgInfo: socketMessage,
          status: "delivered",
        },
      });
    }
  }, [socketMessage]);

  const inputHendle = (e) => {
    setNewMessage(e.target.value);

    socket.current.emit("typingMessage", {
      senderId: user._id,
      receiverId: currentfriend._id,
      msg: e.target.value,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    sendingSPlay();
    const data = {
      senderName: user.name,
      receiverId: currentfriend._id,
      message: newMessage ? newMessage : "❤",
    };

    socket.current.emit("typingMessage", {
      senderId: user._id,
      receiverId: currentfriend._id,
      msg: "",
    });

    dispatch(messageSend(data));
    setNewMessage("");
  };

  useEffect(() => {
    if (mesageSendSuccess) {
      socket.current.emit("sendMessage", message[message.length - 1]);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          msgInfo: message[message.length - 1],
        },
      });
      dispatch({
        type: "MESSAGE_SEND_SUCCESS_CLEAR",
      });
    }
  }, [mesageSendSuccess]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFriends());
    dispatch({ type: "NEW_USER_ADD_CLEAR" });
  }, [new_user_add]);

  useEffect(() => {
    if (friends && friends.length > 0) setCurrentFriend(friends[0].fndInfo);
  }, [friends]);

  useEffect(() => {
    dispatch(getMessage(currentfriend._id));
  }, [currentfriend?._id]);

  useEffect(() => {
    if (message.length > 0) {
      if (
        message[message.length - 1].senderId !== user._id &&
        message[message.length - 1].status !== "seen"
      ) {
        dispatch({
          type: "UPDATE",
          payload: {
            id: currentfriend._id,
          },
        });
        socket.current.emit("seen", {
          senderId: currentfriend._id,
          receiverId: user._id,
        });
        dispatch(seenMessage({ _id: message[message.length - 1]._id }));
      }
    }
    dispatch({
      type: "MESSAGE_GET_SUCCESS_CLEAR",
    });
  }, [message_get_success]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const emojiSend = (emu) => {
    setNewMessage(`${newMessage}` + emu);
    socket.current.emit("typingMessage", {
      senderId: user._id,
      receiverId: currentfriend._id,
      msg: emu,
    });
  };

  const ImageSend = (e) => {
    if (e.target.files.length !== 0) {
      sendingSPlay();
      const imagename = e.target.files[0].name;
      const newImageName = Date.now() + imagename;

      socket.current.emit("sendMessage", {
        senderId: user._id,
        senderName: user.name,
        receiverId: currentfriend._id,
        time: new Date(),
        message: {
          text: "",
          image: newImageName,
        },
      });

      const formData = new FormData();

      formData.append("senderName", user.name);
      formData.append("imageName", newImageName);
      formData.append("receiverId", currentfriend._id);
      formData.append("image", e.target.files[0]);
      dispatch(ImageMessageSend(formData));
    }
  };

  const [hide, setHide] = useState(true);


  useEffect(() => {
    dispatch(getTheme());
  }, []);

  const search = (e) => {
    const getFriendClass = document.getElementsByClassName("hover-friend");
    const frienNameClass = document.getElementsByClassName("Fd_name");
    for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
      let text = frienNameClass[i].innerText.toLowerCase();
      if (text.indexOf(e.target.value.toLowerCase()) > -1) {
        getFriendClass[i].style.display = "";
      } else {
        getFriendClass[i].style.display = "none";
      }
    }
  };

  return (
    <div className={themeMood === "dark" ? "messenger theme" : "messenger"}>
      <div className="__row">
        <div className="__col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="__image">
                  <img src={user?.image} alt="" />
                </div>
                <div className="__name">
                  <h3>{user?.name} </h3>
                </div>
              </div>

              <div className="icons">
                <div onClick={() => setHide(!hide)} className="icon">
                  <FaEllipsisH />
                </div>
              

                <div className={hide ? "theme_logout" : "theme_logout show"}>
                  <h3>Dark Mode </h3>
                  <div className="on">
                    <label className="__label" htmlFor="dark">
                      ON
                    </label>
                    <input
                      onChange={(e) => dispatch(themeSet(e.target.value))}
                      type="radio"
                      value="dark"
                      name="theme"
                      id="dark"
                    />
                  </div>

                  <div className="of">
                    <label className="__label" htmlFor="white">
                      OFF
                    </label>
                    <input
                      onChange={(e) => dispatch(themeSet(e.target.value))}
                      type="radio"
                      value="white"
                      name="theme"
                      id="white"
                    />
                  </div>

                  <div onClick={()=>navigate(`/${user?.role}/dashboard`)} className="logout">
                    Back to Dashboard
                  </div>
                </div>
              </div>
            </div>

            <div className="friend-search">
              <div className="__search">
                <button >
                  {" "}
                  <FaSistrix className="search__button" />{" "}
                </button>
                <input
                  onChange={search}
                  type="text"
                  placeholder="Search"
                  className="__form-control"
                />
              </div>
            </div>

            {/* <div className='active-friends'>
     {
        activeUser && activeUser.length > 0 ? activeUser.map(u =>  <ActiveFriend setCurrentFriend = {setCurrentFriend} user={u} />) : ''  
     }
                        
               </div> */}

            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((fd, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentFriend(fd.fndInfo)}
                      className={
                        currentfriend._id === fd.fndInfo._id
                          ? "hover-friend active"
                          : "hover-friend"
                      }
                    >
                      <Friends
                        activeUser={activeUser}
                        myId={user._id}
                        friend={fd}
                      />
                    </div>
                  ))
                : "No Friend"}
            </div>
          </div>
        </div>

        {currentfriend ? (
          <RightSide
            currentfriend={currentfriend}
            inputHendle={inputHendle}
            newMessage={newMessage}
            sendMessage={sendMessage}
            message={message}
            scrollRef={scrollRef}
            emojiSend={emojiSend}
            ImageSend={ImageSend}
            activeUser={activeUser}
            typingMessage={typingMessage}
          />
        ) : (
          "Please Select your Friend"
        )}
      </div>
    </div>
  );
};

export default Messenger;
