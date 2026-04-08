const app = {
    allSurahs: [],
    curSurah: '',
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
    quesGottenCorrectly: []
};

async function allTheSurahs() {
    let data = await fetch(
        'https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0',
    );
    let res = await data.json();
    console.log(res);
    app.allSurahs = res.data.map(surah => `${surah.englishName}  (${surah.name})`);
    addAllSurahToSelectOption(app.allSurahs)

}

allTheSurahs();

let CurNum = 1;
let numOfQuestions;
const errorText = document.querySelector('.error__text');


async function getQuranFromAPI(surahIndex) {
    try {
        let res = await fetch(
            `https://api.qurani.ai/gw/qh/v1/surah/${surahIndex}/quran-uthmani?limit=2000&offset=0`,
        );

        let chapter = await res.json();
        console.log(chapter);
        app.curSurah = chapter.data.englishName ;
        chapter.data.ayahs.forEach((ayah) => {
            
            app.ayahs.push(ayah.text);

        });

  setRandomQuestions(numOfQuestions);
      
        render(CurNum - 1);
    } catch (e) {
         errorText.classList.remove('hidden');
                errorText.innerHTML =
                    'Connect to Internet <i class="uim uim-wifi"></i>';
    }
}

function rndNumber(max, min = 1) {
    return Math.round(Math.random() * (max - min) + min);
}



function setRandomQuestions(numOfQues) {
    const questiions = [];

    for (let i = 0; i < numOfQues; i++) {
        let newAyah = app.ayahs[rndNumber(app.ayahs.length)];
        if (questiions.includes(newAyah) || newAyah === app.ayahs[app.ayahs.length - 1]) newAyah = app.ayahs[rndNumber(app.ayahs.length)];
        if (
            !questiions.includes(newAyah) ||
            newAyah !== app.ayahs[app.ayahs.length - 1]
        )
            questiions[i] = newAyah;
    }
   
    session.questions = questiions;

    session.questions.forEach((ques, i) => {
        getCorrectAnswer(ques);
        setOptions(i)
    })
} //what this function does is that: it get random questions and stores it inside the session.questions array


function getCorrectAnswer(curAyah) {
    const indexOfAnswer = app.ayahs.indexOf(curAyah) + 1;
    let correctAnswer = app.ayahs[indexOfAnswer];
    session.correctAnswers.push(correctAnswer);
};

function setOptions(quesNum){
    let options = [];

    for (let i = 0; i < 3; i++) {
        let newOption = app.ayahs[rndNumber(20)];
        if (session[i] === newOption || options.includes(newOption)) newOption = app.ayahs[rndNumber(20)];
        if (!session[i] === newOption || !options.includes(newOption)) options[i] = newOption;
    }
    options = [session.correctAnswers[quesNum], ...options]
    options.sort()
    
    // session.options[quesNum].push(options)
    session.options[quesNum] = options
}

const quesTion = document.querySelector('.ques__ayah');

function renderQuestion(curQuesNum){
   let curQues = session.questions[curQuesNum]
   quesTion.innerHTML = curQues;
   console.log(curQues)
}

const questionOptions = document.querySelector('.options');

function renderOptions(curQuesNum, optionText = ['A', 'B', 'C', 'D']){
    let curQuesOpts = session.options[curQuesNum]
console.log(curQuesOpts)
    curQuesOpts.forEach((opt, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.addEventListener('click', (e) => {
            getUserAnswer(e);
        });
        optionDiv.className = 'option__div';
        optionDiv.innerHTML = `
   <span>${curQuesOpts[i]}</span>`;
        // const html =`<span>${opt}</span>`
        questionOptions.append(optionDiv);
        console.log(opt);
    });

    console.log(curQuesOpts)
}

function render(curQuesNum){
    renderQuestion(curQuesNum)
    renderOptions(curQuesNum)
}

const selectForm = document.querySelector('.selectForm');
const surahSelectOptions = document.querySelector('#surahs__options');
const numOfQuestionSelectOptions = document.querySelector('#NumberOfQuestions');


function addAllSurahToSelectOption(allSurahs) {
    allSurahs.forEach((surah) => {
        const html = `<option value="${surah}">${surah}</option>`;
        surahSelectOptions.insertAdjacentHTML('beforeend', html);
    });

}

const form = document.querySelector('form');
const startPage = document.querySelector('.start__page');
const quizPage = document.querySelector('.quiz__page');

form.addEventListener('submit', (e) =>{

    e.preventDefault();
    counter(timeDur.textContent);
    session.start = true;
        document.querySelector('.quiz__tittle').innerHTML = `Surah ${surahSelectOptions.value}`;

        totalQuestionNum.textContent = numOfQuestionSelectOptions.value;

    app.curSurah = surahSelectOptions.value;
    numOfQuestions = +numOfQuestionSelectOptions.value
    let indexOfSurah = app.allSurahs.indexOf(app.curSurah) + 1;
        getQuranFromAPI(indexOfSurah);


    if(app.curSurah){
        startPage.classList.add('hidden');
    quizPage.classList.remove('hidden');
    }

    storeDataToLocalStorage()
// emptyAppState(app)
    // getQuranFromAPI(indexOfSurah);
    
})

const numOfQuesAnswered = document.querySelector('.num__answerd');
const totalQuestionNum = document.querySelector('.total__ques');
const progressBar = document.querySelector('.progress__bar');

function updateProgress(curQuesNum = 1) {
    numOfQuesAnswered.textContent = curQuesNum;
    const totalQues = +totalQuestionNum.textContent;
    let progressPercentage = (curQuesNum / totalQues) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

const quizNavigator = document.querySelector('.navigator');

quizNavigator.addEventListener('click', (e) => {
    if (
        e.target.classList.contains('next__ques__btn') ||
        e.target.classList.contains('uil-arrow-right')
    ) {
        NextQuestion();
    }

    if (
        e.target.classList.contains('prev__ques__btn') ||
        e.target.classList.contains('uil-arrow-left')
    ) {
        PrevQuestion();
    }

    if (e.target.classList.contains('submit__btn')) {
        submitQuiz();
    }
});

const prevBtn = document.querySelector('.prev__ques__btn');
const nextBtn = document.querySelector('.next__ques__btn');
const submitBtn = document.querySelector('.submit__btn');

function displayNavBtn() {
    if (CurNum > 1 && CurNum < +session.questions.length) {
        prevBtn.classList.remove('invisible');
            nextBtn.classList.remove('hidden');
    }
}

const resultPage = document.querySelector('.result__page');
const gradeSummary = document.querySelector('.grade__summary')




function submitQuiz() {
    session.end = true;
    storeDataToLocalStorage();
    quizPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    calcResult();
    updateResultPageBrief();
}


function PrevQuestion() {
    if (CurNum === 1 ) return ;
    if (CurNum === 2) prevBtn.classList.add('btn__disabled');
    nextBtn.classList.remove('btn__disabled');
    CurNum--;
    questionOptions.innerHTML = '';

    updateProgress(CurNum);
   render(CurNum - 1);
   nextBtn.classList.remove('hidden');
   displayNavBtn()
       storeDataToLocalStorage();
}

function NextQuestion() {
    if (CurNum === +session.questions.length) return;
    if (CurNum === +session.questions.length - 1) nextBtn.classList.add('btn__disabled');
    CurNum++;
    prevBtn.classList.remove('btn__disabled');
    updateProgress(CurNum);
    questionOptions.innerHTML = '';
   render(CurNum - 1);
    displayNavBtn();
    storeDataToLocalStorage();
}

function storeDataToLocalStorage() {
    localStorage.setItem('curSession', JSON.stringify(session));
    localStorage.setItem('appInfo', JSON.stringify(app));
}

function getDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('appInfo'));
}

// document.querySelector('.option__div').addEventListener('click', (e) => {
//     getUserAnswer(e);
// });

function addCorrectIndicator(answerPickedByUser) {
    // parmater required is the div of the answeypicked by user

    const allOptionDivs = document.querySelectorAll('.option__div');

    allOptionDivs.forEach((opt) => {
        opt.classList.remove('answer__picked__indicator');
    });

    answerPickedByUser.classList.add('answer__picked__indicator');
}

function getUserAnswer(e) {
    let answerDivPickedByUser = e.target.closest('.option__div');

    const answerPickedByUser = answerDivPickedByUser.querySelector('span');
    console.log(answerPickedByUser);

        if(!answerDivPickedByUser){
                session.userAnswers[CurNum - 1] = 'NIL';
            session.score = session.score;
            return
        }

    session.userAnswers[CurNum - 1] = answerPickedByUser.innerHTML;
    addCorrectIndicator(answerDivPickedByUser);

    if(session.userAnswers[CurNum - 1] === session.correctAnswers[CurNum - 1]){
        session.score++
        session.quesGottenCorrectly.push(session.questions[CurNum - 1]);
        session.ansGottenCorrectly.push(session.correctAnswers[CurNum - 1])
    }
}

const correctCount = document.querySelector('.correct__count')
 const wrongCount = document.querySelector('.wrong__count');
 const quizBriefSurah = document.querySelector('.quiz__brief__surah');
 const quizBriefQuesNum = document.querySelector('.quiz__brief__questnum');

 function updateResultPageBrief(){
    quizBriefSurah.textContent = `Surah ${app.curSurah}`;
    quizBriefQuesNum.textContent = `${session.questions.length} questions`;
 }

function calcResult() {
    correctCount.textContent = session.score;
    wrongCount.textContent = session.questions.length - session.score;

    const percentCount = document.querySelector('.percent__count');
    let resultPercent = Math.round((session.score / session.questions.length) * 100) ;
    percentCount.textContent = `${resultPercent}%`;


    switch(session.end){
        case resultPercent >= 70:
            gradeSummary.textContent = 'Excellent';
            break;
        case resultPercent <= 70 && resultPercent >= 50:
            gradeSummary.textContent = 'Fair';
                    break;

        case resultPercent >= 30 && resultPercent <= 50:
            gradeSummary.textContent = 'Poor';
                    break;

        case resultPercent >= 0 && resultPercent <= 30:
            gradeSummary.textContent = 'Very Poor';
                    break;

    }

    console.log(session.quesGottenCorrectly)
}


const restartBtn = document.querySelector('.restart__btn');
const newQuizBtn = document.querySelector('.new__quiz__btn');

restartBtn.addEventListener('click', () => {
    quizPage.classList.remove('hidden');
    resultPage.classList.add('hidden');
    questionOptions.innerHTML = '';
    CurNum = 1;
    updateProgress(CurNum);

  render(CurNum - 1);
  counter(timeDur.textContent);
  session.userAnswers = [];
  session.score = 0;
  session.start = true;
  session.end = false
  nextBtn.classList.remove('btn__disabled');
})

newQuizBtn.addEventListener('click', () => {
    
    location.reload();
    addAllSurahToSelectOption(app.allSurahs)
})

const timeDur = document.querySelector('.dur_min')

document.querySelector('.incr__dura').addEventListener('click', (e)=>{
  if(+timeDur.textContent === 20) return
  timeDur.textContent = +timeDur.textContent + 5;
})

document.querySelector('.decr__dura').addEventListener('click', (e)=>{
  if(+timeDur.textContent === 5) return
  timeDur.textContent = +timeDur.textContent - 5;
})

const minLabel = document.querySelector('.min__label')
const secLabel = document.querySelector('.sec__label')

    function counter(quizMinute){
    let totalQuizMunite = +quizMinute;

    let totalSeconds = totalQuizMunite * 60;

    let min;
    let sec;

    const timer = setInterval(() => {
        totalSeconds--
        console.log(totalSeconds)
        min = Math.floor(totalSeconds / 60);
        sec = (totalSeconds % 60);

        minLabel.textContent = `${min}`.padStart(2, 0);
        secLabel.textContent = `${sec}`.padStart(2, 0);

        if(totalSeconds === 0) {
            clearInterval(timer)
            submitQuiz()
        };
        if(session.end) clearInterval(timer)

    }, 1000);
}


const backupText = document.querySelector('.backup__text')

setInterval(() => {
    storeDataToLocalStorage();
    backupText.classList.remove('hidden');
    backupText.textContent = 'Backup Sync'
    backupText.style.color = 'green';

    setTimeout(() => {
        backupText.classList.add('hidden');
    }, 2000);
}, 10000);
