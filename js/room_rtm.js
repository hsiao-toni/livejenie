
//var pathToFfmpeg = require('ffmpeg-static'); 

//const { prefix } = require('.vscode\Config.json');
let flag=0;
let donate_u='0';
let donate_u1='0';
let k1='@@@';
let handleMemberJoined = async (MemberId) => {
   
    console.log('A new member has joined the room:', MemberId)
    addMemberToDom(MemberId)
    
    let members = await channel.getMembers()
    updateMemberTotal(members)
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room, ${name}! 👋`)

     
}

let addMemberToDom = async (MemberId) => {
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    let x=document.getElementById('donate__m');
    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`
        let opt= document.createElement("option");
        opt.innerHTML=name;
        opt.id=name;
        x.appendChild(opt);  
                
    membersWrapper.insertAdjacentHTML('beforeend', memberItem)
    
}

let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}

let updatemoneyTotal = async (own) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}
 
let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId)
    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${name} has left the room.`)
    document.getElementById(name).remove()
    console.log("remove:",name);
    memberWrapper.remove()
    
}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i++){
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {


    let data = JSON.parse(messageData.text)
    let music_box = `<audio id = "music1" style="display : none;" autoplay="autoplay" preload= "auto" controls="controls" loop="loop" 
                    src="怎麼了.mp3"></audio>`
    
console.log('A new message was received:',data,flag) 
if(data.type === 'donate')  { 
    /* if(data.message === '1'){
        console.log(data.message) */
        donate_u1= data.message.slice(0,1);
        addMessageToDom(data.displayName, data.message.slice(1))
       // k='';
        donate_u1='0';
    /*     let donate_video = `<video autoplay id="video1">
        <source src="直播影片.mp4" type="video/mp4" />
      </video>`
         document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000); 
          donate_u=0;
    }
    if(data.message=== '2'){
        addMessageToDom(data.displayName, data.message)
        let donate_video = `<video autoplay id="video1">
        <source src="直播影片.mp4" type="video/mp4" />
      </video>`
         document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 300); 
          donate_u=0;
    } */

}
if(data.type === 'command')  {  
    if (data.message === '!!help'){
        addBotMessageToDom(`function : !!play 播放音樂 || !!pause停止音樂 `)
    }
    else if(data.message === '!!play' && flag === 0){
        flag = 1;
        addBotMessageToDom(`正在播放音樂`)
        document.getElementById('music-container').insertAdjacentHTML('afterend',music_box)
    }
    else if(data.message === '!!play' && flag === 1){
        addBotMessageToDom(`you are playing the song!!`)
        flag = 1;
    }
    else if(data.message === '!!pause' && flag === 0){
       addBotMessageToDom(`there is no song for you!!`)
       flag = 0;
        }
    else if(data.message === '!!pause' && flag === 1){ 
            document.getElementById('music1').remove()
            addBotMessageToDom(`音樂已關`)
            flag = 0;
    }
    else{
        addBotMessageToDom(`there is no function for you!!`)
        }
    }
    /* else if(data.message === ''){
        addMessageToDom(data.displayName, data.message)
        let donate_video = `<video autoplay id="video1">
        <source src="直播影片.mp4" type="video/mp4" />
      </video>`
         document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000); 
     
    }*/ 
   if(data.type === 'chat')
    {
        addMessageToDom(data.displayName, data.message)
    }


    if(data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null
    
            for(let i = 0; videoFrames.length > i; i++){
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}

let sendMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value
    if (message ==='' && donate_u !== '0'){
        let c=donate_u;
        
        addMessageToDom(displayName, message)
        let much_name=c+k1;
        channel.sendMessage({text:JSON.stringify({'type':'donate', 'message': much_name, 'displayName':displayName})})
        e.target.reset()
    }
    else if(message.startsWith("!!")){
        donate_u='0';
        channel.sendMessage({text:JSON.stringify({'type':'command', 'message': message, 'displayName':displayName})})
        addMessageToDom(displayName, message)
        e.target.reset()
    }
    else{
    donate_u='0';
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
    addMessageToDom(displayName, message)
    e.target.reset()
    }
}

let addMessageToDom = (name, message) => {
  
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`
    
    let music_box = `<audio id = "music1" style="display : none;" autoplay="autoplay" preload= "auto" controls="controls" loop="loop" 
                    src="怎麼了.mp3"></audio>`

  
     if( donate_u === '1' ){
        let a = document.getElementById('donate__m').value;
           k1 = a;
    
             let newMessage1 = `<div class="message__wrapper">
                         <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">------ I gave ${a} a flower ----</p>
                         </div>
                     </div>`
                 
                     let donate_video = `<video autoplay id="video1" >
                     <source src="直播影片.mp4" type="video/mp4" />
                   </video> `      
         messagesWrapper.insertAdjacentHTML('beforeend', newMessage1)
        document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);
          donate_u= '0';
         }
         else if(donate_u === '2'){         //可更換
          
           let a1 = document.getElementById('donate__m').value;
           k1 = a1;
             let newMessage1 = `<div class="message__wrapper">
                         <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">------ I gave ${a1} an airplane ----</p>
                         </div>
                     </div>`

                      let donate_video = `<video autoplay id="video1" >
                     <source src="直播影片2.mp4" type="video/mp4" />
                   </video> `         
         messagesWrapper.insertAdjacentHTML('beforeend', newMessage1)
        document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);
          donate_u= '0';
         }
        
        else if (donate_u1 !=='0'){
            if (donate_u1 === '1'){
 
            let newMessage1 = `<div class="message__wrapper">
                         <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">------ I give ${message} a flower ----</p>
                         </div>
                     </div>`

                    let donate_video = `<video autoplay id="video1" >
                     <source src="直播影片.mp4" type="video/mp4" />
                   </video> `        
         messagesWrapper.insertAdjacentHTML('beforeend', newMessage1)
        document.getElementById('stream__container').insertAdjacentHTML('beforeend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);                                 
        }
        else if(donate_u1 === '2'){    //可更換
            let newMessage1 = `<div class="message__wrapper">
                         <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">------ I give ${message} a flower ----</p>
                         </div>
                     </div>`

                      let donate_video = `<video autoplay id="video1" >
                     <source src="直播影片2.mp4" type="video/mp4" />
                   </video> `         
         messagesWrapper.insertAdjacentHTML('beforeend', newMessage1)
        document.getElementById('stream__container').insertAdjacentHTML('beforeend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);
        }
        }
    
    else if(message.startsWith("!!")){
        if (message === '!!help'){
            addBotMessageToDom(`function : !!play 播放音樂 || !!pause停止音樂`)
        }else if(message === '!!play' && flag === 0){
            flag = 1;
            addBotMessageToDom(`正在播放音樂`)
            document.getElementById('music-container').insertAdjacentHTML('afterend',music_box)

            
        }else if(message === '!!play' && flag === 1){
            addBotMessageToDom(`you are playing the song!!`)
    
        }
        else if(message === '!!pause' && flag === 0){
           addBotMessageToDom(`there is no song for you!!`)
            }
        else if(message === '!!pause' && flag === 1){ 
                flag = 0;
                document.getElementById('music1').remove()
                addBotMessageToDom(`音樂已關`)
               
        }
        else{
            addBotMessageToDom(`there is no function for you!!`)
            }
        }
    else{
    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)
    }
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}


let addBotMessageToDom = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🐢Jenie Jenie </strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}

let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
}
let donate_con= false;
let donatefun = async (e) => {//換圖 花 id="d0-btn"  飛機 id="d1-btn"
    let donate_box = `<button   onclick ="myfunction()" id="d0-btn" value=0 >
    <img src="https://cdn-icons-png.flaticon.com/512/2926/2926745.png" width="24" height="24" viewBox="0 0 24 24" srcset="https://cdn-icons-png.flaticon.com/512/2926/2926745.png 2x" alt="Money sack Icon" width="256">
</button>
<button id="d1-btn" onclick ="myfunction1()" value=0  >
    <img src="https://cdn-icons-png.flaticon.com/128/870/870143.png" width="24" height="24" viewBox="0 0 24 24" srcset="https://cdn-icons-png.flaticon.com/128/870/870143.png 2x" alt="Money sack Icon" width="256">
</button>

    `
    let donateButton = e.currentTarget
    if(!donate_con){
        donate_con= true;
        donateButton.classList.add('active')
    document.getElementById('donate__container').insertAdjacentHTML('afterend', donate_box)
    }else{
        donate_con= false;
        document.getElementById('donate-btn').classList.remove('active')
        document.getElementById('d0-btn').remove()
        document.getElementById('d1-btn').remove()
    }
   
   
}
function myfunction() {
   donate_u = '1';
  }
 function myfunction1() {
    donate_u = '2';
  }

document.getElementById('donate-btn').addEventListener('click', donatefun)

window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)