var https = require('https');
var config = require('./config.json');

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
            var path = '/v2.4/'+ this.groupId + '/feed' +
                '?access_token='+this.token;
            return this.httpRec(path)
        });
    };
    httpRec(path) {
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
}

var AL = new FacebookGroup('231120563712448');

AL.getFeed().then((data) =>{
   console.log(data);
}).catch((reason)=>{
   console.log(reason);
});