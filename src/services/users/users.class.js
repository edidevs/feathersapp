class User {

    constructor(user){
        this._id = user._id; 
        this.username = user.username; 

    }

    getUserHtmlString(){

        let userHtmlString = `
           
        <div class="media" data-id="${this._id}">
            <div class="media-left media-middle">
                <a href="#">
                <img src="http://icons.iconarchive.com/icons/icons8/windows-8/256/Users-User-icon.png" alt="32x32 user image" class="media-object" style="width:32px; height:32px;">
                </a>
            </div>
            <div class="media-body">
                <h4 class="media-heaading">${this.username}</h4>
            </div>
            
        </div>
        
        `;

        return userHtmlString; 

    }




}