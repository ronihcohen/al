var https = require('https');
var config = require('./config.json');
var MongoClient = require('mongodb').MongoClient;

class FacebookGroup {
    constructor(groupId) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.token = '';
        this.groupId = groupId;
    }
    getToken() {
        var path = '/v2.4/oauth/access_token?' +
        'client_id='+this.clientId +
        '&client_secret='+this.clientSecret +
        '&grant_type=client_credentials';
        return this.httpRec(path);
    };
    getFeed() {
        return this.getToken().then((auth)=>{
            this.token = auth.access_token;
            if (this.token){
                var path = '/v2.4/'+ this.groupId + '/feed' +
                    '?access_token='+this.token +
                    '&fields=from,attachments,comments{attachment,from}' +
                    '&limit=200';
                return this.httpRec(path)
            } else {
                return auth;
            }
        });
    };
    httpRec(path) {
        console.log('Request '+path);
        return new Promise((resolve, reject) => {
            https.get({
                host: 'graph.facebook.com',
                path: path
            }, (response) => {
                var body = '';
                response.on('data', (d) => {
                    body += d;
                });
                response.on('end', ()=> {
                    var parsed = JSON.parse(body);
                    if (parsed){
                        resolve(parsed);
                    } else {
                        reject();
                    }
                });
            });
        });
    };
    feedToDB(feed){
        setTimeout(()=>{
            for (let post of feed.data){
                this.collection.findOne({id: post.id}, (err,postInDb) => {
                    if (!postInDb){
                        this.collection.insert(post, (err, docs) =>  {
                            console.log(docs);
                            if (err){
                                console.log(err);
                            }
                        });
                    } else {
                        console.log('Post ' + post.id + ' exist.');
                    }
                });
            }

            if (feed.paging){
                let nextPage = feed.paging.next.substring(26);
                this.httpRec(nextPage).then((nextPageFeed)=>{
                    this.feedToDB(nextPageFeed)
                });
            } else {
                this.db.close();
            }

        })
    }
}

var AL = new FacebookGroup('231120563712448');


MongoClient.connect('mongodb://tardis.uk.to:27017/test',  (err, db) => {
    if(err) throw err;
    AL.collection = db.collection('test_insert');
    AL.db = db;

    AL.getFeed().then((feed) =>{
         AL.feedToDB(feed);
    }).catch((reason)=>{
        console.log(reason);
    });
});
