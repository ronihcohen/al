var fs = require('fs');

require("babel-core").transformFile("app.js", { optional: ["runtime"] }, function (err, result) {
    fs.writeFile("app-dist.js", result.code, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});