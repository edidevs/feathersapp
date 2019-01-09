// eslint-disable-next-line no-undef
$(document).ready(function() {
  let serverurl = 'http://localhost:3030';
  // feathers boilerplate to connect to user service
  let socket = io(serverurl); 
  //initialize our feather application through socket.io 
  let client = feathers();  

  client.configure( feathers.socketio(socket)); 

  //Use local storage to store jwt 
  client.configure( feathers.authentication({
    storage: window.localStorage
  }));



  //Obtains users service 
  let usersService = client.service('/users'); 

  //Obtain messages service 
  let messagesService = client.service('/messages'); 

  let populateMessagesOnPageLoad = async ()=> {

    let allmessages = null; 

    let length = null; 

    let html = ``;
    
    let message = null; 

    let messages = await messagesService.find({
        query: {
            $sort: {
                createdAt : 1
            }

        }
    }); //grab the messages 

    allmessages = messages.data;
    length = allmessages.length; 
    
    for (let i =0; i < length; i++){
        
        message = allmessages[i]; 
        console.log("Message user id on populateOnLoad ", message.userId);
        html += new Message(message.text, message._id, message.userId).getMessageHtmlString(); 
    }

    console.log(html);

    $('#chat-area').append(html);
        
  }; 

  // Message class - Handle all messages production 
  class Message {
        
    constructor(msgText, msgId, msgUserId = null){

        this.msgText = msgText; 
        this.msgUserId = msgUserId; 
        this.msgId = msgId; 

    }
    getMessageHtmlString(){

        let deleteIconHtml = ``; 

        if(this.msgUserId === client.get('userId')){

            deleteIconHtml = ` <div class="pull-right">
            <span class="delete-comment"><i class="fas fa-times" aria-hidden="true">delete</i></span>
          </div>`; 

        }

        let msgString = ` <div class="media" data-id="${this.msgId}">
            <div class="media-left">
                <a href="#">
                    <img src="http://icons.iconarchive.com/icons/icons8/windows-8/256/Users-User-icon.png" alt="32x32 user image" class="media-object" style="width:32px; height:32px;">
                </a>
            </div>
            <div class="media-body">
              ${deleteIconHtml}
              <h4 class="media-heading">John Doe</h4>
              <span class="comment-date">03-04-2016 04:02 AM</span>
              <br><br>
                ${this.msgText}
            </div>
          </div>`;

        return msgString; 

    }

 }


  client.authenticate()
        .then((response) => {
            //Client is authenticated

            return client.passport.verifyJWT(response.accessToken);


            
        }).then((payload) => {
            console.log("Payload",payload);
            const  { userId } = payload; 

            console.log("UserId", userId);
            client.set('userId', userId); 
            main();
        })
        .catch((err) => {
            //Client is not authenticated - redirect to login 
            console.log("Error not authenticated", err);
            window.location.href = `${serverurl}/login.html`; 
        });
        //end authenticate 

        //function runs all the scripts after it is authenticated 
        function main(){

            console.log("User Id Get", client.get('userId'));  
            //show all the messages created
            populateMessagesOnPageLoad();
              
            //Watch for a removed event, when there is an event, remove the message from HTML 
            messagesService.on('removed', (message) => {
                console.log("Log remove event", message); 

                let msgId = message._id; 

                $(`.media[data-id="${msgId}"]`).remove();


            }); 




            $('#chat-area').on('click', '.delete-comment', function(){
                let msgId = $(this).closest('.media').attr('data-id');
                console.log("Message ID is", msgId); 
                messagesService.remove(msgId);
            }); 

            // Handle logout
            $('#logout-icon').on('click', function(){
                //logout user on the feathers 
                client.logout();
                //redirect to the login form 
                window.location.href = `${serverurl}/login.html`; 
            }); 

            // console.log("Client is authenticated", response); 

            //Submit message form 
            $('#submit-message-form').submit(function(e){
                e.preventDefault(); 

                let msgtext = $('#msg-text'); 

                let messageText = msgtext.val(); 

                console.log(msgtext.val());

                msgtext.val('');

                console.log("Message text", messageText.trim().length); 

                //if message text is more than 1, save messages to db
                if(messageText.trim().length > 0){

                    console.log("Messagetext.trim > 0");

                    //Create a new message on the server 
                    messagesService.create({
                        text: messageText
                    })
                    .catch((err) => {
                        alert("There was an error when submitting a new message");
                        console.log(err); 
                    });

                }

            }); 

            //Watch for a new message event and handle 
            messagesService.on('created', (message) => {

                 
                let messageUserId = message.userId; 

                let messageId = message._id; 


                let messageChat = message.text; 
                
                let newMessage = new Message(messageChat, messageId, messageUserId); 


                //display new message
                $('#chat-area').append(newMessage.getMessageHtmlString()); 

                //animate scrolling for messages 
                $('html, body').animate({scrollTop:$(document).height()}, "slow");

                console.log(newMessage.getMessageHtmlString());

            });
        }
   

   




});