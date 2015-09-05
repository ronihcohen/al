var MongoClient = require('mongodb').MongoClient;
var express = require('express');


MongoClient.connect('mongodb://tardis.uk.to:27017/test', (err, db) => {
    if(err) throw err;

    //class Collection{
    //    constructor(){
    //        this.ref = db.collection('test_insert');
    //    }
    //    count(){
    //        this.ref.count((err, count) => {
    //            console.log(count);
    //        });
    //    }
    //    removeAll(){
    //        this.ref.remove();
    //    }
    //    usersPostsCount(){
    //        this.ref.find().toArray(function(err, results) {
    //            var usersPostsCount = {};
    //            for (let post of results){
    //                let currentCount = usersPostsCount[post.from.name] || 0;
    //                currentCount++;
    //                usersPostsCount[post.from.name]  = currentCount;
    //            }
    //            return(usersPostsCount);
    //        });
    //    }
    //    getAll(){
    //        this.ref.find().toArray(function(err, results) {
    //            return(results);
    //        });
    //    }
    //}
    //
    //var ALCollection = new Collection();

    //ALCollection.count();
    //ALCollection.removeAll();

    //db.close();

    var app = express();

    app.use(express.static('public'));

    app.get('/usersPostsCount', function (req, res) {
        MongoClient.connect('mongodb://tardis.uk.to:27017/test', (err, db) => {
            let collection = db.collection('test_insert');
            collection.find().toArray(function(err, results) {
                var usersPostsCount = {};
                var usersPostsCountArr = [];
                for (let post of results){
                    let currentCount = usersPostsCount[post.from.name] || 0;
                    currentCount++;
                    usersPostsCount[post.from.name]  = currentCount;
                }

                for (var prop in usersPostsCount) {
                    if (usersPostsCount[prop]>10){
                        usersPostsCountArr.push({'name':prop,'count':usersPostsCount[prop]});
                    }
                }

                res.send(usersPostsCountArr);
            });
        });
    });

    app.get('/feed/:skip/:limit', function (req, res) {
        console.log(req.params);
        MongoClient.connect('mongodb://tardis.uk.to:27017/test', (err, db) => {
            let collection = db.collection('test_insert');
            let attachments = [];
            collection.find({ 'attachments' : { '$exists' : true }}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).toArray((err, results) => {
                for (let post of results){
                    attachments.push(post.attachments.data[0]);
                }
                res.send(attachments);
            });
        });
    });

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });

});



