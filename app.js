var https = require('https');

class AL {
    constructor() {
        this.clientId = '213438082188010';
        this.clientSecret = '6ada08fc1074d6efb740d132dcd016a3';
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