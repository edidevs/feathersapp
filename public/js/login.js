// eslint-disable-next-line no-undef
$(document).ready(function(){
    let serverurl = "http://localhost:3030";

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

    // Handle login form 
    $('#login-user-form').submit(function(e){
        e.preventDefault();

        let userCredentials = getCredentials();

        console.log("User Login", userCredentials);

         //Use feathers client to authenticate 
        //If successful, redirect to chat application 
        //If unsucessful, provide an error message to the user 
        client.authenticate({
            strategy: 'local',
            email : userCredentials.email,
            password: userCredentials.password
        }).then(function(token){
            //if sucessful, redirect to the serverurl
            console.log(`Successful ${token}`); 
            window.location.href = serverurl; 
        }).catch((err) => {
            console.log("Error", err); 
            $('#error-message')
                .text(`Error when logging in ${err.message}`)
                .show(); 
        });

    });

   




});