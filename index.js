/*
  Check list
  In NodeJS, please write a script that takes a keyword as an argument from the command line.  
  The script would then search Google and Bing for the keyword.   
  The script will visit the top 6 search results from both Google and Bing.   
  On each visited page from the search results list, scrape the <title> element.  
  Store the url for the visited page and the contents of the <title> element in a CSV file.   
  In the end there should be two CSV files output:  one for the Google results and one for Bing.
*/


//Require Dependencies
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

//Make sure the user passing in an argument to run program
if(process.argv.length > 2){
  runScrape();
} else{
  console.log('Please enter an argument after node index.js');
}

//Function that runs the search engine scrape
function runScrape(){
  //Pass the argument from the command line to the runScrape scope.
  var keyword = process.argv.slice(2);

  //Scrape Google's Search Engine
  request('https://www.google.com/search?q=' + keyword, function (error, response, html) {
    if(!error && response.statusCode == 200){

      var $ = cheerio.load(html);
      var googleSearchResults = [];
      var totalResults = 0;
      var links = $('h3.r a');
      
      links.each(function(index, element){
        //return the top 6 results
        if(totalResults <= 5){

          //get href
          var url = $(element).attr('href');
          
          //clean up returned url
          url = url.replace("/url?q=", "").split("&")[0];
          
          //return characters before /
          if(url.charAt(0) === '/'){
            return;
          }
          
          //Increment count
          totalResults++;

          //create googleSearchResults obj. storeed in an array
          googleSearchResults.push({
            title: $(element).text(),
            url: url
          });
        }
      });
      
      //Stringify googleSearchResults object to make it easier to read.
      var jsonData = JSON.stringify(googleSearchResults, null, 4);

      //write the entire scraped page to the local file system
      fs.writeFile(__dirname + '/google-output.json', jsonData, function(err){
        console.log('File successfully written! - Check your google-output.json for the output file');
      })
    
    } 
  });

  //Scrape Bing's Search Engine
  request('https://www.bing.com/search?q=' + keyword, function (error, response, html) {
    if(!error && response.statusCode == 200){
      var $ = cheerio.load(html);
      var bingSearchResults = [];
      var totalResults = 0;
      var links = $(' h2 a');

      links.each(function(index, element){
        if(totalResults <= 5){

          //get href
          var url = $(element).attr('href');

          //clean up returned url
          url = url.replace("/url?q=", "").split("&")[0];

          if(url.charAt(0) === '/'){
            return;
          }
          
          totalResults++;

          //push the object to storage
          bingSearchResults.push({
            title: $(element).text(),
            url: url
          });
        }
      });
      
      //Stringify googleSearchResults object to make it easier to read.
      var jsonData = JSON.stringify(bingSearchResults, null, 4);

      //write the entire scraped page to the local file system
      fs.writeFile(__dirname + '/bing-output.json', jsonData, function(err){
        console.log('File successfully written! - Check your bing-output.json for the output file');
      })
    } 
  });
}