/* eslint-disable react/prop-types */
import moment from "moment";
import { FaRegCheckCircle } from "react-icons/fa";
import { useGlobalContext } from "../../context/AuthContext";
const Message = ({ message, currentfriend, scrollRef, typingMessage }) => {
  const { user } = useGlobalContext();
  return (
    <>
      <div className="message-show">
        {message && message.length > 0 ? (
          message.map((m, index) =>
            m.senderId === user._id ? (
              <div ref={scrollRef} key={m._id} className="my-message">
                <div className="image-message">
                  <div className="my-text">
                    <p className="message-text">
                      {" "}
                      {m.message.text === "" ? (
                        <img src={`./image/${m.message.image}`} />
                      ) : (
                        m.message.text
                      )}{" "}
                    </p>

                    {index === message.length - 1 &&
                    m.senderId === user._id ? (
                      m.status === "seen" ? (
                        <img
                          className="__img"
                          src={currentfriend.image}
                          alt=""
                        />
                      ) : m.status === "delivered" ? (
                        <span>
                          {" "}
                          <FaRegCheckCircle />{" "}
                        </span>
                      ) : (
                        <span>
                          {" "}
                          <FaRegCheckCircle />{" "}
                        </span>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="time">
                  {moment(m.createdAt).startOf("mini").fromNow()}
                </div>
              </div>
            ) : (
              <div ref={scrollRef} key={m._id} className="fd-message">
                <div className="image-message-time">
                  <img src={currentfriend.image} alt="" />
                  <div className="message-time">
                    <div className="fd-text">
                      <p className="message-text">
                        {" "}
                        {m.message.text === "" ? (
                          <img src={`./image/${m.message.image}`} />
                        ) : (
                          m.message.text
                        )}{" "}
                      </p>
                    </div>
                    <div className="time">
                      {moment(m.createdAt).startOf("mini").fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="friend_connect">
            <img src={currentfriend.image} alt="" />
            <h3>{currentfriend.name} Connect You </h3>
            <span>
              {" "}
              {moment(currentfriend.createdAt).startOf("mini").fromNow()}{" "}
            </span>
          </div>
        )}
      </div>
      {typingMessage &&
      typingMessage.msg &&
      typingMessage.senderId === currentfriend._id ? (
        <div className="typing-message">
          <div className="fd-message">
            <div className="image-message-time">
              <img src={currentfriend.image} alt="" />
              <div className="message-time">
                <div className="fd-text">
                  <p className="time">Typing Message.... </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Message;
