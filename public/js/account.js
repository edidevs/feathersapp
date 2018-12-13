// eslint-disable-next-line no-undef
$(document).ready(function(){
    let serverurl = "http://localhost:3030/";

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

    // get users credentials 
    function getCredentials(){

        var user =  {
            email : $('#email').val(),
            password : $('#password').val()
        }; 

        return user; //return an object 
    }

    //Handle user submitting form 
    $('#new-user-form').submit(function(e){
        e.preventDefault();

        let userCredentials = getCredentials();

        console.log(userCredentials);

        //create a new user using feathers client 

        usersService.create(userCredentials)
            .then((res) => {
                console.log("Response success", res);
                window.location.href = `${serverurl}/login.html`;
            }).catch((err)=>{
                console.log("Error", err);
                $('#error-message')
                .text('There was an error!!!!')
                .show(); 
            })
    }); 


});