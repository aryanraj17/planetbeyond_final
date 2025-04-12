const startBtn = document.querySelector(".start-btn");
const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const main = document.querySelector(".main");
const continueBTn = document.querySelector("#continue-btn");
const nextBtn = document.querySelector(".next-btn");

const quizSection = document.querySelector(".quiz-section");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const tryAgainBtn = document.querySelector(".tryAgain-btn");
const goHomeBtn = document.querySelector(".goHome-btn");

const optionContainer = document.querySelector(".option-list");


const shuffleArray = () => {
    // Clone the original array to avoid modifying the original 'questions' array
    let array = [...tempQuestions]; 

    // Fisher-Yates (Knuth) Shuffle Algorithm
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        let randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the element at the random index
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    console.log(array); // Output the shuffled array
    return array;
};

const questions = shuffleArray();



let questionCount = 0;
let questionNumb = 1;
let userScore = 0;


startBtn.onclick = () => {
    popupInfo.classList.add("active");
    main.classList.add("active");
};

exitBtn.onclick = () => {
    popupInfo.classList.remove("active");
    main.classList.remove("active");
};

continueBTn.addEventListener("click", () => {
    quizSection.classList.add("active");
    popupInfo.classList.remove("active");
    main.classList.remove("active");
    quizBox.classList.add("active");

    showQuestions(questionCount);
    questionCounter(1);
    // headerScore();
});

tryAgainBtn.onclick = () => {
    quizBox.classList.add("active");
    nextBtn.classList.remove("active");
    resultBox.classList.remove("active");

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();
};

goHomeBtn.onclick = () => {
    quizSection.classList.remove("active");
    nextBtn.classList.remove("active");
    resultBox.classList.remove("active");

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    headerScore()
        // showQuestions(questionCount);
        // questionCounter(questionNumb);
};

// continueBTn.onclick = () => {
//     quizSection.classList.add("active");
//     popupInfo.classList.remove("active");
//     main.classList.remove("active");
//     quizBox.classList.add("active");

//     showQuestions(0);
// };

nextBtn.addEventListener("click", () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);
    } else {
        showResultBox();
    }
});


// getting questions and options from array
function showQuestions(index) {
    const optionsList = document.querySelectorAll('.option');
    const options = questions[index].options;
    optionContainer.innerHTML = '';
    let optionsHTML = '';

    options.forEach((e, i) => {
        optionsHTML = optionsHTML + `
        <div class="option" data-answer='${questions[index].answer}' onclick='optionSelected(this, ${index}, ${i})'>
            <span>${e}</span>
        </div>`
    });
    optionContainer.insertAdjacentHTML('beforeend', optionsHTML);

    const questionText = document.querySelector(".question-text");
    questionText.textContent = `${index+1}. ${questions[index].question}`;
    optionsList.forEach((e) => e.classList.remove('disabled'))
    nextBtn.classList.remove('activeBtn');
    nextBtn.classList.add('inactiveBtn');
}

function optionSelected(elem, quesIndex, selectedOptionIndex) {
    const options = document.querySelectorAll('.option');

    if (questions[quesIndex].options.find((e, i) => i === selectedOptionIndex) === questions[quesIndex].answer) {
        elem.classList.add('optionCorrect');
        userScore++;
    } else {
        const nodeIndex = questions[quesIndex].options.findIndex((e) => e === questions[quesIndex].answer)
        console.log(nodeIndex, options[nodeIndex].classList.add('optionCorrect'))
        elem.classList.add('optionIncorrect');
        // userScore ? userScore = userScore - 0.5 : userScore;
    }
    headerScore();
    options.forEach((e) => e.classList.add('disabled'))
    nextBtn.classList.remove('inactiveBtn');
    nextBtn.classList.add('activeBtn');

}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score ${userScore} out of ${questions.length}`;

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = (userScore / questions.length) * 100;
    let speed = 15;

    let progress = setInterval(() => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#C3A04A ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`;

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);

    if (progressEndValue >= 50) {
        party.confetti(document.querySelector('.container'), {
            count: party.variation.range(0, 100),
            size: party.variation.range(0.6, 1.4),
        })
    }
}