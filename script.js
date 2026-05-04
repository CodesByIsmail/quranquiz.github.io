const app = {
  allSurahs: [],
  curSurah: "",
  ayahs: [],
};

const session = {
  score: 0,
  start: false,
  end: false,
  questions: [],
  options: [],
  correctAnswers: [],
  userAnswers: [],
  ansGottenCorrectly: [],
  quesGottenCorrectly: [],
};

let answerPickedByUser;
let answerDivPickedByUser;

const errorText = document.querySelector(".error__text");

async function allTheSurahs() {
  try {
    let data = await fetch(
      "https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0",
    );
    let res = await data.json();
    console.log(res);
    app.allSurahs = res.data.map((surah) => `${surah.englishName}`);
    addAllSurahToSelectOption(app.allSurahs);
  } catch (e) {
    console.log(e.message, "while fetching all surahs");
    errorText.classList.remove("hidden");
    errorText.innerHTML = 'Connect to Internet <i class="uil uil-wifi"></i>';
  }
}

allTheSurahs();

let CurNum = 1;
let numOfQuestionsSelected;

async function getQuranFromAPI(indexOfSurah) {
  try {
    renderSpimner(questionOptions)
    console.log(indexOfSurah);
    let res = await fetch(
      `https://api.qurani.ai/gw/qh/v1/surah/${indexOfSurah}/quran-uthmani?limit=2000&offset=0`,
    );

    let chapter = await res.json();
    // app.curSurah = chapter.data.englishName;
    console.log(chapter, app.curSurah);
    chapter.data.ayahs.forEach((ayah) => {
      app.ayahs.push(ayah.text);
    });

    setRandomQuestions(numOfQuestionsSelected);
    startQuiz();
  } catch (e) {
    console.log(e.message, "while fetching all ayah");

    errorText.classList.remove("hidden");
    errorText.innerHTML = 'Connect to Internet <i class="uil uil-wifi"></i>';
  }
}

// getQuranFromAPI();

function renderSpimner(parentEl) {
  const markup = ` <i class="uil spinner uil-asterisk"></i>`
  parentEl.innerHTML='';
  parentEl.insertAdjacentHTML('afterbegin', markup)
}

function rndNumber(max, min = 1) {
  return Math.round(Math.random() * (max - min) + min);
}

// SOLUTION FOR SETTING QUESTION
// 1. GET all the number possible questions from the array of all ayahs
// 2. check if all the possible question matches the number of questions given
// 3. Shuffle the array of ayahs
// 4. slice from the ayah array, beginning from 0 and stopping at the number of possible questions

function setRandomQuestions(numOfQues) {
  let questiions = [];
  // 1. GET all the number possible questions from the array of all ayahs
  const possibleQuestions = app.ayahs.slice(0, -1);
  
  // 2. check if all the possible question matches the number of questions given
  const maxQuestions = possibleQuestions.length;
  const actualNumOfQues = Math.min(maxQuestions, numOfQues);
  // 3. Shuffle the array of ayahs
  possibleQuestions.sort((a, b) => a.localeCompare(b));
  // 4. slice from the ayah array, beginning from 0 and stopping at the number of possible questions
  questiions = possibleQuestions.slice(0, actualNumOfQues);
  


  session.questions = questiions;

  session.questions.forEach((ques, i) => {
    getCorrectAnswer(ques);
    setOptions(i);
  });

  session.totalQuestionsNum = session.questions.length;
} //what this function does is that: it get random questions and stores it inside the session.questions array

function getCorrectAnswer(curAyah) {
  const indexOfAnswer = app.ayahs.indexOf(curAyah) + 1;
  let correctAnswer = app.ayahs[indexOfAnswer];
  session.correctAnswers.push(correctAnswer);
}

const OPTION_LENGTH = 4;

function setOptions(quesNum) {
  let options = [];
   let rd = rndNumber(OPTION_LENGTH);
  console.log(rd, '💢💢💢💢💢💢💢💢💢💢')

  for (let i = 0; i < 3; i++) {
    let newOption = app.ayahs[rd];
    if (session.questions[i] === newOption || options.includes(newOption))
      newOption = app.ayahs[rndNumber(OPTION_LENGTH)];
    if (session.questions[i] !== newOption || !options.includes(newOption))
      options[i] = newOption;
  }
  options = [session.correctAnswers[quesNum], ...options];
  options.sort();

  // session.options[quesNum].push(options)
  session.options[quesNum] = options;
}

const quesTion = document.querySelector(".ques__ayah");

function renderQuestion(curQuesNum) {
  if (!session.questions[curQuesNum]) return;
  let curQues = session.questions[curQuesNum];
  quesTion.innerHTML = curQues;
  console.log(curQues);
}

const questionOptions = document.querySelector(".options");

questionOptions.addEventListener("click", (e) => {
  if (e.target.classList.contains("option__div") || e.target.matches("span")) {
    getUserAnswer(e);
  }
});

function renderOptions(curQuesNum, optionText = ["A", "B", "C", "D"]) {
  if (!session.options[curQuesNum]) return;
  let curQuesOpts = session.options[curQuesNum];
  curQuesOpts.forEach((opt, i) => {
    if (!opt) return;
    const optionDiv = document.createElement("div");
    optionDiv.className = "option__div";
    optionDiv.innerHTML = `
   <span>${curQuesOpts[i]}</span>`;
    questionOptions.append(optionDiv);
  });
}

function render(curQuesNum) {
  questionOptions.innerHTML = ''
  renderQuestion(curQuesNum);
  renderOptions(curQuesNum);
}

const selectForm = document.querySelector(".selectForm");
const surahSelectOptions = document.querySelector("#surahs__options");
const numOfQuestionSelectOptions = document.querySelector("#NumberOfQuestions");

function addAllSurahToSelectOption(allSurahs) {
  allSurahs.forEach((surah) => {
    const html = `<option value="${surah}">${surah}</option>`;
    surahSelectOptions.insertAdjacentHTML("beforeend", html);
  });
}

const form = document.querySelector("form");
const startPage = document.querySelector(".start__page");
const quizPage = document.querySelector(".quiz__page");

// QUIZ START

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.querySelector("button").disabled = true;
  
  startPage.classList.add("hidden");
  quizPage.classList.remove("hidden");

  document.querySelector(".quiz__tittle").innerHTML =
    `Surah ${surahSelectOptions.value}`;
  numOfQuestionsSelected = +numOfQuestionSelectOptions.value;
  app.curSurah = surahSelectOptions.value;

  let indexOfSurah = app.allSurahs.findIndex((s) => s === app.curSurah) + 1;
  console.log(indexOfSurah, "after submitting");
  getQuranFromAPI(indexOfSurah);
  console.log("start");
  storeDataToLocalStorage();
});

function startQuiz() {
  render(CurNum - 1);

  session.start = true;

  counter(timeDur.textContent);
  

  console.log("quiz started");
}

const numOfQuesAnswered = document.querySelector(".num__answerd");
const totalQuestionNum = document.querySelector(".total__ques");
const progressBar = document.querySelector(".progress__bar");

function updateProgress(curQuesNum = 1) {
  numOfQuesAnswered.textContent = curQuesNum;
  const totalQues = +session.totalQuestionsNum;
  let progressPercentage = (curQuesNum / totalQues) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

const quizNavigator = document.querySelector(".navigator");

quizNavigator.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("next__ques__btn") ||
    e.target.classList.contains("uil-arrow-right")
  ) {
    if (!answerDivPickedByUser && session.userAnswers[CurNum - 1] === null) {
      session.userAnswers[CurNum - 1] = null;
    }
    NextQuestion();
  }

  if (
    e.target.classList.contains("prev__ques__btn") ||
    e.target.classList.contains("uil-arrow-left")
  )
    PrevQuestion();
});

const prevBtn = document.querySelector(".prev__ques__btn");
const nextBtn = document.querySelector(".next__ques__btn");
const submitBtn = document.querySelector(".submit__btn");

submitBtn.addEventListener("click", () => {
  if (!answerDivPickedByUser && session.userAnswers[CurNum - 1] === null) {
    session.userAnswers[CurNum - 1] = null;
  }
  submitQuiz();
});

function displayNavBtn() {
  if (CurNum > 1 && CurNum < +session.questions.length) {
    prevBtn.classList.remove("invisible");
    nextBtn.classList.remove("hidden");
  }
}

const resultPage = document.querySelector(".result__page");
const gradeSummary = document.querySelector(".grade__summary");

function submitQuiz() {
  updateScore();
  session.end = true;
  storeDataToLocalStorage();
  quizPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
  calcResult();
  updateResultPageBrief();
  addQuestionReview(session.correctAnswers);
}

function PrevQuestion() {
  // const alreadyPickedAnswer = session.userAnswers[CurNum - 1];
  // if (!alreadyPickedAnswer) return;
  // console.log("Answer already picked is", alreadyPickedAnswer);
  // questionOptions.childNodes.forEach((opt) => {
  //   if (opt.querySelector("span").innerHTML === alreadyPickedAnswer) {
  //     addCorrectIndicator(opt);
  //   }
  // });

  if (CurNum === 1) return;
  if (CurNum === 2) prevBtn.classList.add("btn__disabled");
  nextBtn.classList.remove("btn__disabled");
  CurNum--;
  questionOptions.innerHTML = "";

  updateProgress(CurNum);
  render(CurNum - 1);
  displayNavBtn();
  storeDataToLocalStorage();
}

function NextQuestion() {
  const alreadyPickedAnswer = session.userAnswers[CurNum - 1];

  // if (!alreadyPickedAnswer) {
  if (CurNum === +session.questions.length) return;
  if (CurNum === +session.questions.length - 1)
    nextBtn.classList.add("btn__disabled");
  answerPickedByUser = "";
  answerDivPickedByUser = "";
  updateScore();
  CurNum++;
  prevBtn.classList.remove("btn__disabled");
  updateProgress(CurNum);
  questionOptions.innerHTML = "";
  render(CurNum - 1);
  displayNavBtn();
  storeDataToLocalStorage();
  // }

  // if (alreadyPickedAnswer) {
  // console.log("Answer already picked is", alreadyPickedAnswer);
  // console.log("Answer already picked is", alreadyPickedAnswer);
  // questionOptions.childNodes.forEach((opt) => {
  //   if (opt.querySelector("span").innerHTML === alreadyPickedAnswer) {
  //     addCorrectIndicator(opt);
  //   }
  // });
  // }
}

function storeDataToLocalStorage() {
  localStorage.setItem("curSession", JSON.stringify(session));
  localStorage.setItem("appInfo", JSON.stringify(app));
}

function getDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem("appInfo"));
}

function addCorrectIndicator(answerPickedByUser) {
  // parmater required is the div of the answeypicked by user

  const allOptionDivs = document.querySelectorAll(".option__div");

  allOptionDivs.forEach((opt) => {
    opt.classList.remove("answer__picked__indicator");
  });

  answerPickedByUser.classList.add("answer__picked__indicator");
}

function getUserAnswer(e) {
  answerDivPickedByUser = e.target.closest(".option__div");

  answerPickedByUser = answerDivPickedByUser.querySelector("span").innerHTML;

  // if(!answerDivPickedByUser){
  //         session.userAnswers[CurNum - 1] = 'NIL';
  //     session.score = session.score;
  //     return
  // }

  session.userAnswers[CurNum - 1] = answerPickedByUser;
  addCorrectIndicator(answerDivPickedByUser);
}

function updateScore() {
  if (session.userAnswers[CurNum - 1] === session.correctAnswers[CurNum - 1]) {
    session.score++;
    session.quesGottenCorrectly[CurNum - 1] = session.questions[CurNum - 1];
    session.ansGottenCorrectly[CurNum - 1] = session.correctAnswers[CurNum - 1];
  }
}

const correctCount = document.querySelector(".correct__count");
const wrongCount = document.querySelector(".wrong__count");
const quizBriefSurah = document.querySelector(".quiz__brief__surah");
const quizBriefQuesNum = document.querySelector(".quiz__brief__questnum");

function updateResultPageBrief() {
  quizBriefSurah.textContent = `Surah ${app.curSurah}`;
  quizBriefQuesNum.textContent = `${session.questions.length} questions`;
}

function calcResult() {
  correctCount.textContent = session.score;
  wrongCount.textContent = session.questions.length - session.score;

  const percentCount = document.querySelector(".percent__count");
  let resultPercent = Math.round(
    (session.score / session.questions.length) * 100,
  );
  percentCount.textContent = `${resultPercent}%`;

  switch (session.end) {
    case resultPercent >= 70:
      gradeSummary.textContent = "Excellent";
      break;
    case resultPercent <= 70 && resultPercent >= 50:
      gradeSummary.textContent = "Fair";
      break;

    case resultPercent >= 30 && resultPercent <= 50:
      gradeSummary.textContent = "Poor";
      break;

    case resultPercent >= 0 && resultPercent <= 30:
      gradeSummary.textContent = "Very Poor";
      break;
  }

  console.log(session.quesGottenCorrectly);
}

const restartBtn = document.querySelector(".restart__btn");
const newQuizBtn = document.querySelector(".new__quiz__btn");

restartBtn.addEventListener("click", () => {
  quizPage.classList.remove("hidden");
  resultPage.classList.add("hidden");
  questionOptions.innerHTML = "";
  questionReviewContainer.innerHTML = "";
  CurNum = 1;
  updateProgress(CurNum);

  render(CurNum - 1);
  counter(timeDur.textContent);
  session.userAnswers = [];
  session.score = 0;
  session.start = true;
  session.end = false;
  nextBtn.classList.remove("btn__disabled");
});

newQuizBtn.addEventListener("click", () => {
  location.reload();
  addAllSurahToSelectOption(app.allSurahs);
});

const timeDur = document.querySelector(".dur_min");

document.querySelector(".incr__dura").addEventListener("click", (e) => {
  if (+timeDur.textContent === 20) return;
  timeDur.textContent = +timeDur.textContent + 5;
});

document.querySelector(".decr__dura").addEventListener("click", (e) => {
  if (+timeDur.textContent === 5) return;
  timeDur.textContent = +timeDur.textContent - 5;
});

const minLabel = document.querySelector(".min__label");
const secLabel = document.querySelector(".sec__label");

function counter(quizMinute) {
  let totalQuizMunite = +quizMinute;

  let totalSeconds = totalQuizMunite * 60;

  let min;
  let sec;

  const timer = setInterval(() => {
    totalSeconds--;

    min = Math.floor(totalSeconds / 60);
    sec = totalSeconds % 60;

    minLabel.textContent = `${min}`.padStart(2, 0);
    secLabel.textContent = `${sec}`.padStart(2, 0);

    if (totalSeconds === 0) {
      clearInterval(timer);
      submitQuiz();
    }
    if (session.end) clearInterval(timer);
  }, 1000);
}

setInterval(() => {
  storeDataToLocalStorage();
}, 10000);

const questionReviewContainer = document.querySelector(
  ".question__review__container",
);

function addQuestionReview(questions) {
  questions.forEach((ques, i) => {
    let quesStatus;
    if (!session.userAnswers[i]) quesStatus = "skipped";
    if (ques === session.userAnswers[i]) quesStatus = "correct";
    if (session.userAnswers[i] && ques !== session.userAnswers[i])
      quesStatus = "wrong";

    const html = `
        <div class="question__review ${quesStatus}__answer">
              <div class="review__top">
                <h3>Question ${i + 1}</h3>
                <i class="uil uil-angle-down"></i>
              </div>
              
              <div class="review__wrapper hidden">
                <p>Q: <span class="question">${session.questions[i]}</span> </p>
                
                <p>A: <span class="answer">${session.correctAnswers[i]}</span></p> 

                
                
                <p>Your Answer: <span class="question">${!session.userAnswers[i] ? "No answer picked" : session.userAnswers[i]}</span> </p>
            </div>

            </div>`;

    questionReviewContainer.insertAdjacentHTML("beforeend", html);
  });

  const questionReview = document.querySelectorAll(".question__review");
  questionReview.forEach((wrapper) => {
    console.log(wrapper);
    wrapper.addEventListener("click", () => {
      wrapper.querySelector(".review__wrapper").classList.toggle("hidden");
    });
  });
}
