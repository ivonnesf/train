$(document).ready(function () {
  // Initialize Firebase
  var config = {
        apiKey: "AIzaSyCvG0mJYW24yx78hBWQGPZtpavn9y32eew",
        authDomain: "train-schedule-bb1f6.firebaseapp.com",
        databaseURL: "https://train-schedule-bb1f6.firebaseio.com",
        projectId: "train-schedule-bb1f6",
        storageBucket: "train-schedule-bb1f6.appspot.com",
        messagingSenderId: "1043791917907"
      };
      firebase.initializeApp(config);
var database = firebase.database();

 // Assumptions
var Tname = "";
var Tdestination = "";
var Ttime = 0;
var Tfrequency = "";
 
$("#Esubmit").on("click", function(event) {
Tname = $("#name").val().trim();
Tdestination = $("#destination").val().trim();
Ttime = $("#trainTime").val().trim();
Tfrequency = $("#frequency").val().trim();
  // Prevent form from submitting
  event.preventDefault();
  // Get the input values
    //make values in database
    database.ref().push({
    name: Tname,
    destination: Tdestination,
    trainTime: Ttime,
    frequency: Tfrequency,
 
    });
$("#name").val('');
$("#destination").val('');
$("#trainTime").val('');
$("#frequency").val('');
});
database.ref().on("child_added", function(childSnapshot) {
// Log everything that's coming out of snapshot
    var tFrequency= (childSnapshot.val().frequency);
    var firstTime = (childSnapshot.val().trainTime);
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    $("#headInfo").append(`<
        <tr>
                <td>${childSnapshot.val().name}</td>
                <td>${childSnapshot.val().destination}</td> 
                <td>${childSnapshot.val().frequency}</td> 
                <td>${moment(nextTrain).format('LT')}</td> 
                <td>${tMinutesTillTrain}</td> 
                
                
        </tr>
        `);
    // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
});

