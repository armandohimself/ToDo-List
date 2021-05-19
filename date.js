//module.exports.getDate = getDate; //you have to create the key value pair in the object you're trying to export. 

exports.getDate = function () {

    let today = new Date();

    let options = {
        dateStyle: "full", 
        weekday: "long", 
        day: "2-digit", 
        month: "long", 
    };

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {

    let today = new Date();

    let options = {
        weekday: "long"
    };

    return today.toLocaleDateString("en-US", options);

}

//NOTES: 6 Ways to declare javascript function
/*
1.function declaration:
function isEven(num) {
  return num % 2 === 0;
}

2. Function express:
const isTruthy = function(value) {
  return !!value;
};

3. Shorthand method definition:

4. Arrow function:

5. Generator function:

6. New function:

*/