/* eslint-disable react/prop-types */
import { FaPlusCircle,FaFileImage,FaGift,FaPaperPlane } from "react-icons/fa";

const MessageSend = ({inputHendle,newMessage,sendMessage,emojiSend,ImageSend}) => {
 
     const emojis = [
          '😀', '😃', '😄', '😁',
          '😆', '😅', '😂', '🤣',
          '😊', '😇', '🙂', '🙃',
          '😉', '😌', '😍', '😝',
          '😜', '🧐', '🤓', '😎',
          '😕', '🤑', '🥴', '😱'
      ]


  return (
    <div className="message-send-section">
      <input type="checkbox" id="emoji" />
      <div className="file hover-attachment">
        <div className="add-attachment">Add Attachment</div>
        <FaPlusCircle />
      </div>

      <div className="file hover-image">
        <div className="add-image">Add Image</div>
        <input
          onChange={ImageSend}
          type="file"
          id="pic"
          className="__form-control"
        />
        <label className="__label" htmlFor="pic">
          {" "}
          <FaFileImage />{" "}
        </label>
      </div>

      <div className="file hover-gift">
        <div className="add-gift">Add gift</div>
        <FaGift />
      </div>

      <div className="message-type">
        <input
          type="text"
          onChange={inputHendle}
          name="message"
          id="message"
          placeholder="Aa"
          className="__form-control"
          value={newMessage}
        />

        <div className="file hover-gift">
          <label className="__label" htmlFor="emoji">
            {" "}
            ❤️{" "}
          </label>
        </div>
      </div>

      <div onClick={sendMessage} className="file">
        <FaPaperPlane />
      </div>

      <div className="emoji-section">
        <div className="emoji">
          {emojis.map((e, index) => (
            <span key={index} onClick={() => emojiSend(e)}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSend;
