//get from html into javascript variables
const chatbody = document.querySelector('.chat-container');
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('#send-message');
const clearchat = document.querySelector('#clear');




function clearchatFunction(){
}

clearchat.addEventListener('click', clearchatFunction);


// function clearchat(){
//  
// }


const userData = { message: null
}
document.addEventListener("focus", function(event) {
  if (event.target.tagName === "input" || event.target.tagName === "TEXTAREA") {
    event.preventDefault();
  }
}, true);

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
} 

// const API_URL = "https://api.openai.com/v1/responses";
// const generateBotResponse = async () =>{
//     const requestOptions = {
//         method: "POST",
//         headers: {"Content-Type" : "application/json"},
//         body: JSON.stringify({
//             contents: [{
//                 parts: [{text: userData.message }]
//             }]
//         })
//     }

//     try{
//         const response = await fetch(API_URL, requestOptions);
//         const data = await response.json();
//         if(!response.ok) throw new Error(data.error.message);

//         console.log(data);

//     }catch(error){
//         console.error(error);
//         console.log(data);

//     }
// }

let _config = {
    openAI_api: "https://alcuino-chatbot.azurewebsites.net/api/OpenAIProxy", //API KEY
    openAI_model: "gpt-4o-mini",
//EMOTIONAL SUPPORT BOT
    ai_instruction: `You are an AI designed to act as my emotional support companion. 
Your role is to listen with empathy and understanding whenever I share my thoughts, feelings, or rants. 
If the user says something unrelated to emotional support or personal expression, do not respond. 
Always reply in pure HTML format (no markdown). 
Your responses should sound comforting, calm, and supportive.
    `, //PROMPT ENGINEERING
    response_id: "",
};

//GENERATE BOTT RESPONSE FUNCTION
async function generateBotResponse (incomingMessageDiv) {
const messageElement = incomingMessageDiv.querySelector(".message-text");

let requestBody = {
    model: _config.openAI_model,
    input: incomingMessageDiv,
    instructions: _config.ai_instruction,
    previous_response_id: _config.response_id,
};
if (!_config.response_id || _config.response_id.length === 0) {
    requestBody = {
    model: _config.openAI_model,
    input: userData.message,
    instructions: _config.ai_instruction,
    };
}
try{
    const response = await fetch (_config.openAI_api,{
        method: "POST",
        body: JSON.stringify(requestBody),
    });

    if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
        let output = data.output[0].content[0].text.trim();
    messageElement.innerHTML = output;
    return output;

}catch(error){
    console.error("Error calling OpenAI API: ", error);
    throw error;
}finally{
    incomingMessageDiv.classList.remove("thinking");
}
}

const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";

    //create and display user messages chats
    const messageContent =`<div class="message-text">${userData.message}</div>`;
    const OutgoingMessageDiv = createMessageElement(messageContent, "user-message");
    OutgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatbody.appendChild(OutgoingMessageDiv);

    setTimeout(() => {
   const messageContent =` <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatbody.appendChild(incomingMessageDiv);

    generateBotResponse(incomingMessageDiv); //pass user input for generate botresponse

    },600);
}

//press enter for sending messages
messageInput.addEventListener("keydown", (e) => {
const userMessage = e.target.value.trim();
if(e.key === "Enter" && userMessage){
    handleOutgoingMessage(e); //for enter in the keyboard
}
});

sendButton.addEventListener("click", (e) => handleOutgoingMessage(e))
