/**
 * Created by d on 20.12.2016.
 */
var request = require('request');
var my_reg_email = /\w+\.?[a-zA-Z0-9&!#$%&*+?^_`{|}~,-]*@\w+\.?\w+[.][a-z]{2,3}/g;
var my_reg_url = /[http]+[s]?[:]..[w]+\.[mosigra]+\.[a-zA-Z0-9_\/]+/g;
var url = 'http://www.mosigra.ru/';

var all_emails_mas = new Array();
var current_emails_mas = new Array();
// returns an array of all emails of a page
function find_emails(current_url, callback){
    request(current_url, function(error, response, body){
        if(error){ return callback(error) };
        if (!error && response.statusCode === 200){
            current_emails_mas = body.match(my_reg_email);
            if(current_emails_mas){
                for(var i = 0; i < current_emails_mas.length; i++){
                    if(all_emails_mas.indexOf(current_emails_mas[i]) == -1){
                        all_emails_mas.push(current_emails_mas[i]);
                    }
                }
            }
            if (typeof callback == "function") {
                callback(all_emails_mas);
            }
        }
    })
}

var all_urls_mas = new Array();
var current_urls_mas = new Array();
// returns an array of all urls of a page
function find_urls(current_url, callback){
    request(current_url, function(error, response, body){
        if(error){ return callback(error) };
        if (!error && response.statusCode == 200){
            current_urls_mas = body.match(my_reg_url);
            if(current_urls_mas){
                for(var i = 0; i < current_urls_mas.length; i++){
                    if(all_urls_mas.indexOf(current_urls_mas[i]) == -1){
                        all_urls_mas.push(current_urls_mas[i]);
                    }
                }
            }
            if (typeof callback == "function") {
                callback(all_urls_mas);
            }
        }
    })
}

var all_emails = new Array();
var searched_urls = new Array();  // has all urls we've found
var new_urls = new Array();

// recursive function of searching all of the urls of all of the urls of the page till the end of
// the amount of the urls in the all of the urls.
// In my case it's search every referenced page of a site.
function push_unique_urls_of_a_pages(current_url, callback){
    find_emails(current_url, function(current_emails){
        for(var t = 0; t < current_emails.length; t++) {
            if (all_emails.indexOf(current_emails[t]) == -1) { //if the email isn't in all_emails
                all_emails.push(current_emails[t]);
            };
        };
        console.log(all_emails);

        find_urls(current_url, function(current_urls){
            console.log(current_urls);
            for(var i = 0; i < current_urls.length; i++){
                if(searched_urls.indexOf(current_urls[i]) == -1) { //if the url isn't in searched_urls
                    new_urls.push(current_urls[i]);
                };
                for(var j = 0; j < new_urls.length; j++)
                {
                    var temp_url = new_urls[j];
                    searched_urls.push(temp_url);  // add the url in searched
                    var k = new_urls.indexOf(temp_url);  // delete the url from new
                    if(k != -1){
                        new_urls.splice(k, 1);
                    }
                    push_unique_urls_of_a_pages(temp_url);  // work out the url
                }
                if (typeof callback == "function") {
                    callback(all_emails);
                }
            }

        });

    });
}

push_unique_urls_of_a_pages(url, function(mas){
    console.log(mas);
});
