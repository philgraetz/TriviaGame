function questionPageTestSetup() {
    console.log("FIXME0000");
    $(".timeReminingSection").text("Time remaining: 21 seconds");
    $(".questionSection").html("<b>WHAT</b>...is your favorite color?");
    $("#choice1").text("Green");
    $("#choice2").text("Red");
    $("#choice3").text("Blue");
    $("#choice4").text("I mean YELLOOOWW!!");

    startTimer();
}

// TESTING
questionPageTestSetup();

function myMouseDown() {
    $(this).addClass("mouseDown");
}
function myMouseUp() {
    $(this).removeClass("mouseDown");
}

var timerId = null;
function startTimer() {
    let totalIntervals = 30;  // 30 x 1000 ms = 30 sec
    let intervalTime = 1000; 
    let intervalsLeft = totalIntervals;
    let width = 100;
    timerId = setInterval(frame, intervalTime);
    let sec = Math.round((intervalsLeft*intervalTime)/1000);
    $(".timeRemainingLabel").text(`Time remaining: ${sec} seconds`);
    function frame() {
        intervalsLeft--; 
        width = Math.floor((intervalsLeft*100)/totalIntervals);
        let widthStr = width + "%";
        $(".timeProgressBar").css("width", widthStr);

        let sec = Math.round((intervalsLeft*intervalTime)/1000);
        $(".timeRemainingLabel").text(`Time remaining: ${sec} seconds`);

        if (intervalsLeft <= 0) {
            stopTimer();
            $('.timeProgressBar').addClass("makeInvisible"); 
            $(".timeRemainingLabel").text(`Time remaining: 0 seconds`);
        }
    }
}
function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}