window.onload = function() {

    // coundn't figure out how to update the database real time.

    var time = moment().format('h:mm a');
    console.log(time);

    // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDhrQt3y0Qw9_IJeEwSluDN3bFciQzdNSs",
    authDomain: "news-bbe51.firebaseapp.com",
    databaseURL: "https://news-bbe51.firebaseio.com",
    projectId: "news-bbe51",
    storageBucket: "news-bbe51.appspot.com",
    messagingSenderId: "628779779486"
  };
  firebase.initializeApp(config);

    var database = firebase.database();
    var name = "";
    var Destination = "";
    var fristTrain = "";
    var min = "";
    var rate = "";

    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();

        name = $("#train-name-input").val().trim();
        Destination = $("#destination-input").val().trim();
        fristTrain = $("#start-input").val().trim();
        min = parseInt($("#rate-input").val().trim());
        rate = min;

        console.log(rate);
        console.log(fristTrain);

        var next = fristTrain;
        var convertNext = moment(next, 'HH:mm').add("m", rate).format('h:mm a');
        var a = moment();
        var b = moment(next, 'HH:mm').add("m", rate);
        var minAway = b.diff(a, "minutes");

        for (var i = 0; i < 1000; i++) {
            if (minAway <= 0) {
                next = moment().format("H");
               
                minAway = minAway + min;
                convertNext = (moment(next, 'HH:mm').add("m", rate + rate).format('h:mm a'));
                
               

            } else {
                database.ref().push({
                    name: name,
                    Destination: Destination,
                    fristTrain: fristTrain,
                    rate: rate,
                    nextTrain: convertNext,

                    minAway: minAway,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP

                });
                name = $("#train-name-input").val("");
                Destination = $("#destination-input").val("");
                fristTrain = $("#start-input").val("");
                min = $("#rate-input").val("");

                return;
            }
        }


        console.log(next);
        console.log(convertNext);
    });

    database.ref().on("child_added", function(snapshot) {
        $("#employee-table").append("<tr><td class='name'>" + snapshot.val().name + "</td>" + "<td class='destination'>" + snapshot.val().Destination + "</td>" + "<td class='start'>" + snapshot.val().rate + "</td>" + "<td class='next'>" + snapshot.val().nextTrain + "</td>" + "<td class='rate'>" + snapshot.val().minAway + "</td></tr>");
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshotChild) {
        $("#employee-name-input").html(snapshotChild.val().name);
        $("#destination-input").html(snapshotChild.val().Destination);
        $("#start-input").html(snapshotChild.val().nextTrain);
        $("#rate-input").html(snapshotChild.val().rate);

    });


};