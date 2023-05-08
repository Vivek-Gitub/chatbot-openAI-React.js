import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-oObNnChzoTLCu9qvpHNyX8XM",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

function App() {
  const [message, setmessage] = useState(""); //The message will hold the information sent from the app to the AI.
  const [chats, setchat] = useState([]); // The chats array will keep track of all the messages sent by both parties (user and AI).
  const [istyping, setistyping] = useState(false); // it is used for showing that AI is typing because we do not know how much it goes to take time

  const chat = async (e, message) => {
    e.preventDefault();

    setistyping(true);

    let msgs =chats
    msgs.push({ role: "user", content: message })
    setchat(msgs)
    scrollTo(0, 1e10)
    setmessage("");

    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "you are GPt .And help in writing email",
          },
          ...chats,
        ],
      })
      .then((result) => {
        // console.log(result);
        msgs.push(result.data.choices[0].message)
        setchat(msgs)
        setistyping(false);

        scrollTo(0, 1e10)

      })
      .catch((error) => console.log(error));
  };

  return (
    <main>
      <h1>React chatGPT App</h1>

      <section>
        {chats && chats.length ? (
          chats.map((chat, index)=>(
            <p key={index} className={chat.role === "user"? "user_msg":""}>
              <span>{chat.role}</span>
              <span>:</span>
              <span>{chat.content}</span>
            </p>
          ))
        ) : "" }
      </section>

      <div className={istyping? "":"hide"}>
          <p>
            <i>Typing.....</i>
          </p>
        </div>



      {/* here we call a chat() function on click on Submit  */}
      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message and hit enter"
          onChange={(e) => setmessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
