
const QUESTION_TIMEOUT = 20;   // 20 seconds
const ANSWER_PAGE_TIMEOUT = 4; // 4 seconds
// ====================================
// Data Structure for LIST OF QUESTIONS
// ====================================
triviaQuestionList = [
    {
        question: "How many lakes in MN over 10 acres?",
        answerList: [
            "10,000",
            "7,483",
            "14,519",
            "11,842",
        ],
        correctAnswer: 3,
        image: "assets/images/soothinglake.gif",
    },
    {
        question: "Where did 3M get it's start?",
        answerList: [
            "St Paul",
            "Maplewood",
            "Two Harbors",
            "St Peter",
        ],
        correctAnswer: 2,
        image: "assets/images/PostItSlinky.webp",
    },
    {
        question: "What town in MN will you find a tribute to the Monty Python SPAM sketch?",
        answerList: [
            "Austin",
            "Albert Lea",
            "Minneapolis",
            "Alexandria",
        ],
        correctAnswer: 0,
        image: "assets/images/spam.gif",
    },
    {
        question: "Famous MN giant (may be fictional)?",
        answerList: [
            "Jolly Green Giant",
            "Paul Bunyan",
            "Giant remains at Sauk Rapids",
            "All of the above",
        ],
        correctAnswer: 3,
        image: "assets/images/PaulBunyan.gif",
    },
];

// Global pointer to TriviaGame Object
let thisTGObject = null;

// === Set up the game ===
function gameSetup() {
    // Create the Trivia Gameobject
    thisTGObject = new TriviaGame();

    // Register Callbacks
    $(".choiceBorder").mousedown(mouseDownCB);
    $(".choiceBorder").mouseup(mouseUpCB);

    thisTGObject.goToStartPage();
}

// === Callbacks ===
// NOTE that these are not in the TriviaGame object
// because 'this' refers to JQuery DOM element
// not the TriviaGame object
function mouseDownCB()  {
    $(this).addClass("mouseDown");
}
function mouseUpCB() {
    let elt = $(this);
    elt.removeClass("mouseDown");

    let id = elt.attr("id");
    thisTGObject.processChoice(id);
}
function questionPageTimerCB() {
    thisTGObject.questionPageTimer();
}
function answerPageTimerCB() {
    thisTGObject.answerPageTimer();
}

// ==========================
// == TriviaGame Prototype ==
// ==========================
function TriviaGame() {
    this.answerPageTimerId = null;
    this.questionPageTimerId = null;
    this.questionIntervalsLeft = 0;

    // Go the the Start page
    // (And start a new game as well)
    this.goToStartPage = function() {

        // Init values for new game
        this.questionList = triviaQuestionList;
        this.currentAnswer = -1;    // -1 = no answer
        this.currentQuestionIndex = 0;
        this.totalCorrectAnswers = 0;
        
        // Display the Start page
        $("#startPage").show();
        $("#questionAnswerPage").hide();
        $("#endPage").hide();
    };


    // Go to the question page
    this.goToQuestionPage = function() {
        // Display the Question/Answer Page
        $("#startPage").hide();
        $("#questionAnswerPage").show();
        $("#endPage").hide();
    
        // Hide the Answer Section
        $("#answerSection").hide();

        // Display the Question Section
        $("#questionSection").show();
    
        // Start the timer.
        this.startQuestionPageTimer();

        // Set up the question
        let qq = this.questionList[this.currentQuestionIndex];
        $("#questionText").text(qq.question);
        $("#choice0").text(qq.answerList[0]);
        $("#choice1").text(qq.answerList[1]);
        $("#choice2").text(qq.answerList[2]);
        $("#choice3").text(qq.answerList[3]);
    };

    // Start the question page timer
    this.startQuestionPageTimer = function() {
        this.stopQuestionPageTimer(); // ensure there's no timer running
        this.questionIntervalsLeft = QUESTION_TIMEOUT;
        this.questionPageTimerId = setInterval(questionPageTimerCB, 1000);

        // Make sure this is visible
        $('.timeProgressBar').removeClass("makeInvisible"); 
        $('.timeProgressBar').addClass("makeVisible"); 

        // Display seconds remaining
        this.updateTimerDisplay();
    };

    // Stop the question page timer
    this.stopQuestionPageTimer = function() {
        if (this.questionPageTimerId !== null) {
            clearInterval(this.questionPageTimerId);
            this.questionPageTimerId = null;
        }
    };

    // Handle the question page timer CB
    // Keep counting down until time is out
    this.questionPageTimer = function() {
        // Called by CB funtion questionPageTimerCB
        this.questionIntervalsLeft--; 
        this.updateTimerDisplay();

        if (this.questionIntervalsLeft <= 0) {
            this.stopQuestionPageTimer();
            this.currentAnswer = -1;
            this.goToAnswerPage();
        }
    };

    // Update the timer display
    this.updateTimerDisplay = function() {
        let width = Math.floor((this.questionIntervalsLeft*100)/QUESTION_TIMEOUT);
        if (width === 100)
            width = 99; // fix a display glitch
        let widthStr = width + "%";
        $(".timeProgressBar").css("width", widthStr);

        let sec = this.questionIntervalsLeft;
        $(".timeRemainingLabel").text(`Time remaining: ${sec} seconds`);

        if (this.questionIntervalsLeft <= 0) {
            $('.timeProgressBar').removeClass("makeVisible"); 
            $('.timeProgressBar').addClass("makeInvisible"); 
            $(".timeRemainingLabel").text(`Time remaining: 0 seconds`);
        }
    };

    this.goToAnswerPage = function() {
        // Ensure this is stopped
        this.stopQuestionPageTimer();

        // Display the Question/Answer Page
        $("#startPage").hide();
        $("#questionAnswerPage").show();
        $("#endPage").hide();

        // Hide the Question Section
        $("#questionSection").hide();

        // Display the Answer Section
        $("#answerSection").show();

        let qq = this.questionList[this.currentQuestionIndex];

        // Add an image
        $("#imgDiv").empty(); // clear any previous image
        if (qq.image !== "") {
            newImg = $("<img>");
            newImg.attr("id", "answerGif");
            newImg.attr("src", qq.image);
            $("#imgDiv").append(newImg);
        }

        // Check for correct answer and display results
        if (this.currentAnswer < 0) {
            $("#answerResponse").text("TIME IS UP!");
        }
        else if (this.currentAnswer === qq.correctAnswer) {
            $("#answerResponse").text("CORRECT!");
            this.totalCorrectAnswers++;
        }
        else {
            $("#answerResponse").text("WRONG!");
        }
        $("#correctAnswer").text(qq.answerList[qq.correctAnswer]);
        this.currentQuestionIndex++;
        this.currentAnswer = -1;

        // After a brief wait, call function to determine
        // what to do next
        this.answerPageTimerId = setTimeout(answerPageTimerCB, ANSWER_PAGE_TIMEOUT*1000);
    };

    // After timer expires, check for more questions
    this.answerPageTimer = function() {
        // Clear the timer.
        if (this.answerPageTimerId !== null) {
            clearTimeout(this.answerPageTimerId);
            this.answerPageTimerId = null;
        }
        if (this.currentQuestionIndex >= this.questionList.length) {
            // Done with all questions
            this.goToEndPage();
        }
        else {
            this.goToQuestionPage();
        }
    };

    // Go the the End page
    this.goToEndPage = function() {
        $("#startPage").hide();
        $("#questionAnswerPage").hide();
        $("#endPage").show();

        // Display results
        let cc = this.totalCorrectAnswers;
        let tt = this.questionList.length;
        let percent = Math.round((cc*100)/tt);
        let str1 = `You got ${cc} out of ${tt} (${percent}%)`;
        $("#finalResult").text(str1);
    };

    this.processChoice = function(choiceId) {
        if (choiceId === "startBox") {
            thisTGObject.goToQuestionPage();
        }
        else if (choiceId === "playAgainBox") {
            thisTGObject.goToStartPage();
        }
        else {
            let choice = parseInt(choiceId.slice(-1)); // # of choice
            this.currentAnswer = choice;
            thisTGObject.goToAnswerPage();
        }
    };
}

