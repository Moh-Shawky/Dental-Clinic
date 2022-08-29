const express = require("express");
const bodyparser = require("body-parser");
var request = require('superagent');
const { STATUS_CODES } = require("http");
const app = express();
app.use(bodyparser.json());
app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: true }));


// var options = {
//     url: "// https://us6.api.mailchimp.com/3.0/lists/7d268ab8bf/members/ac7ca024a3face5dada76924e926e2fb-us9/notes",
//     method: "POST",
// }
// request(options, function (error, response, body) {
//     if (error) {
//         console.log(error);
//         console.log(body)
//     }
//     else {
//         console.log(response.statusCode);
//     }
// })
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});


var mailchimpInstance = 'us9',
    listUniqueId = '7d268ab8bf',
    mailchimpApiKey = 'ac7ca024a3face5dada76924e926e2fb-us9';

app.post('/signup', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': req.body.email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': req.body.Firstname,
                'LNAME': req.body.Lastname,
            }
        })
        .end(function(err, response){
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/successSignup.html")
            } else {
                res.sendFile(__dirname + "/failureSignup.html")
            }
        })
        // console.log(res.statusCode)
        // console.log(req.body.Firstname)
        // console.log(req.body.Lastname)
        // console.log(req.body.email)


        // if(res.statusCode === 200){
        //     res.sendFile(__dirname + "/successSignup.html")
        // }
        // else{
        //     res.sendFile(__dirname + "/failureSignup.html")
        // }
});


app.post("/failureSignup",function(req,res){
    res.redirect("/")
})

app.listen(3000, function () {
    console.log("server running on port 3000");
});
