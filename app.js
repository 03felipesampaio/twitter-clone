const fs = require('fs');

export class Tweet {
    constructor(id, name, content) {
        this.id = id;
        this.name = name;
        this.author = undefined;
        this.date = new Date();
        this.content = content;

        this.likes = 0;
        this.rt = 0;
        this.comments = 0;
    }
}

export function getData() {
    let db = JSON.parse(fs.readFileSync('defaultTweets'));
    
    db.addTweet = (newPost) => {
        tweets.push(newPost);
        id++;
    }

    db.save = () => {
        fs.writeFileSync('defaultTweets', this);
    }
    
    return db;
}

/* let tweets = [
    new Tweet(0, "Felipe Sampaio", "My first tweet"),
    new Tweet(1, "Felipe Sampaio", "My second tweet")
]; */

