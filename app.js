var https = require('https');
var config = require('./config.json');

class AL {
    constructor() {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.token = '';
    }
    getFBToken() {
        return new Promise((resolve, reject) => {
            https.get({
                host: 'graph.facebook.com',
                path: '/v2.4/oauth/access_token?client_id='+this.clientId +
                '&client_secret='+this.clientSecret +
                '&grant_type=client_credentials'
            }, (response) => {
                var body = '';
                response.on('data', (d) => {
                    body += d;
                });
                response.on('end', ()=> {
                    var parsed = JSON.parse(body);
                    if (parsed.access_token){
                        this.token = parsed.access_token;
                        resolve(this.token);
                    } else {
                        reject();
                    }
                });
            });
        });
    };
}

var ALsession = new AL;
ALsession.getFBToken().then((res) =>{
    console.log(res);
}).catch( (err) => {
    console.log(err);
});