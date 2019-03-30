
// firebase config//

var config = {
  apiKey: "AIzaSyATL9yh5CR9DAELSeJSxlpYpZ99Uv9qZ-w",
  authDomain: "test-f7d34.firebaseapp.com",
  databaseURL: "https://test-f7d34.firebaseio.com",
  projectId: "test-f7d34",
  storageBucket: "test-f7d34.appspot.com",
  messagingSenderId: "523499024766"
};
firebase.initializeApp(config);

var database = firebase.database()

//gloabl variable for deleting trains
var traincount = 0


//button for adding employees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  traincount++
  //grabbing user inputs

  var TrainName = $("#train-name-input").val().toUpperCase().trim();
  var Destination = $("#destination-input").val().toUpperCase().trim();
  var FirstTrain = $("#First-train-input").val().toUpperCase().trim();
  var Frequency = $("#frequency-input").val().toUpperCase().trim();

  //creates local temp object for holding train info
  var newTrain = {

    name: TrainName,
    destination: Destination,
    First: FirstTrain,
    rate: Frequency
  }
  //uploads train data to database
  database.ref().push(newTrain)

  console.log(newTrain.name);


  //clear all text boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#First-train-input").val("");
  $("#frequency-input").val("");

});

//create firebase event for adding trains to database and throw them in a row on the html//

database.ref().on("child_added", function (childSnapshot) {
  
  console.log(childSnapshot.val())
  
  

  var TrainName = childSnapshot.val().name
  var Destination = childSnapshot.val().destination
  var FirstTrain = childSnapshot.val().First
  var Frequency = childSnapshot.val().rate
  console.log(Frequency)



  console.log(traincount)
  // First train of the day is at 3:30 AM
  var firstTime = moment(FirstTrain, 'HH:mm')
  console.log(firstTime)

  //get current time

  var currentTime = moment()
  console.log(currentTime)
  //create variable to store the next available train//



  console.log(traincount)

  var nextTrain;
  if (firstTime > currentTime) {
    nextTrain = firstTime;

  } else {
    // Otherwise, get minutes past first time
    var minutesPast = currentTime.diff(firstTime, 'minutes');
    // Find the result of minutesPast % frequency
    var remainder = minutesPast % Frequency;
    // Subtract the remainder from the frequency
    var minutesTilNextTrain = Frequency - remainder;
    // Set nextTrain to the currentTime + `minutesTilNextTrain` minutes
    nextTrain = currentTime.add(minutesTilNextTrain, 'minutes');

  }

  // Print and format the new train time
  var nextArrival = nextTrain.format('hh:mm A')


  //create button to remove train

  var newRow = $("<tr>")
  newRow.attr("id", "train-" + traincount)


  var deleteTrain = $("<button>");

  deleteTrain.attr("data-train", traincount);
  deleteTrain.addClass("checkbox");
  deleteTrain.text("X");
  

  newRow.append(
    $("<td>").text(TrainName),
    $("<td>").text(Destination),
    $("<td>").text(Frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(minutesTilNextTrain),
    deleteTrain
  );

  $("#customer-table > tbody").append(newRow);

  traincount++
  

});

$(document.body).on("click", ".checkbox", function() {

  // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
  var toDoNumber = $(this).attr("data-train");

  // Select and Remove the specific <p> element that previously held the to do item number.
  $("#train-" + toDoNumber).remove();
  
  
});


