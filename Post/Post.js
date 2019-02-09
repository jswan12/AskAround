class Post{
    constructor(userID, title, description, cashAmount, ranking){
        this.userID = userID;
        this.title = title;
        this.description = "This is my description!";
        this.description = description;
        this.cashAmount = 0.00;
        this.cashAmount = cashAmount;
        this.ranking = ranking;
        console.log('Object Made with user ID: ', this.userID);
    }
    toString(){
        return (this.userID + "\n" + "Title: " + this.title + "        " + "$" + this.cashAmount + "\n" + this.description);
    }
}