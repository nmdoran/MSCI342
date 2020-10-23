// test
console.log('Hello!');

// created a variable to read from the main page - user input
const search = 5; 

// takes the variable and searches for it in the database


//prompt creates prompting functions. Prompt the user for input
//calls the prompt built in function
const prompt = require ('prompt-sync')(); 
const name  = prompt("What item are you looking for?");
console.log("Here is " + name + " from the database");