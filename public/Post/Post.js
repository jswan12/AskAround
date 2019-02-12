class Post{
    constructor(userID, title, description, cashAmount, ranking){
        this.userID = userID;
        if(title == "")
            this.title = "This is my title!";
        else
            this.title = title;

        if(description == "")
            this.description = "This is my description!";
        else
            this.description = description;

        if(cashAmount<=0)
            this.cashAmount = 0.00;
        else
            this.cashAmount = cashAmount;
        this.ranking = ranking;
        console.log('Object Made with user ID: ', this.userID);
    }
    getUserId(){
        return this.userID;
    }
    getTitle(){
        return this.title;
    }
    getDescription(){
        return this.description;
    }
    getCashAmount(){
        return '$' + this.cashAmount;
    }
    getRanking(){
        return 'Rank: ' + this.ranking;
    }
    toString(){
        return (this.userID + "\n" + "Title: " + this.title + "        " + "$" + this.cashAmount + "\n" + this.description);
    }
}