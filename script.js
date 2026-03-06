const quesTion = document.querySelector('.ques__ayah')

const startPage = document.querySelector('.start__page')
const resultPage = document.querySelector('.result__page')
const quizPage = document.querySelector('.quiz__page')

const errorText = document.querySelector('.error__text')

const progressBar = document.querySelector('.progress__bar')
const numOfQuesAnswered = document.querySelector('.num__answerd')

const surahSelectOptions = document.querySelector('#surahs__options');
const numOfQuestionSelectOptions = document.querySelector('#NumberOfQuestions')


const questionOptions = document.querySelector('.options')

const selectForm = document.querySelector('.selectForm')

const loadingText = document.querySelector('.load')
const totalQuestionNum = document.querySelector('.total__ques')

const quranQuiz = {
  ayahs: [],
  questions: [],
  options: []
}


function rndNumber(max, min = 1) {
  return Math.round((Math.random() * (max - min)) + min)
}

console.log('loading...')

let SURAH_INDEX;
let CUR_QUES_NUM = 1;
let CUR_AYAH_QUES;
let numberOfQuestions;

async function getAllSurahs() {
  try {
    let res = await fetch('https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0')
  
    let allSurahs = await res.json();
    addAllSurahToSelectOption(allSurahs)
  } catch (e) {
    console.error(e.message, 'and')
    errorText.classList.remove('hidden');
    errorText.innerHTML = 'Connect to Internet 🛜'
  }
}

getAllSurahs();


async function getQuranFromAPI(surahIndex) {
  try {
      let res = await fetch(`https://api.qurani.ai/gw/qh/v1/surah/${surahIndex + 1}/quran-uthmani?limit=2000&offset=0`)
  
  let chapter = await res.json();
  let ayahsInChapter = chapter.data.ayahs
  
  quranQuiz.ayahs = ayahsInChapter.map(data => data.text)
  
  renderAyahQuestion(quranQuiz.ayahs) // takes array of all ayah in thr surah and select specific ayah randomly 
  
  console.log(quranQuiz.ayahs)

  } catch (e) {
    console.error(e.message, 'fhrhfh')
    loadingText.classList.remove('hidden');
    loadingText.innerHTML = e.message
  }

}


function addAllSurahToSelectOption(surahDataApi) {
  const allSurahs = surahDataApi.data.map(data => data.englishName)
  allSurahs.forEach(surah => {
  const html = `<option value="${surah}">${surah}</option>`
  surahSelectOptions.insertAdjacentHTML('beforeend', html)
})


selectForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const selectedAyah = surahSelectOptions.value;
  console.log(selectedAyah)
  
   SURAH_INDEX = allSurahs.indexOf(selectedAyah)
  console.log(SURAH_INDEX)
  
  getQuranFromAPI(SURAH_INDEX);
  updateProgress()
  quizPage.classList.remove('hidden');
  startPage.classList.add('hidden');
  totalQuestionNum.textContent = numOfQuestionSelectOptions.value
})

}

function renderAyahQuestion(ayahArr) {
  CUR_AYAH_QUES = getAyah(ayahArr)
  quranQuiz.questions.push(CUR_AYAH_QUES)
  quesTion.innerHTML = CUR_AYAH_QUES;
  getOptionsForQuestion(ayahArr, CUR_QUES_NUM)
}


function getAyah(ayahArr) {
  let newRndNum = rndNumber(ayahArr.length - 1);
  // console.log(quranQuiz.ayah[rndNumber(ayahArr.length)])
  const ayah = quranQuiz.ayahs[newRndNum].split(' ').slice(0, 10).join(' ');
  
  console.error(ayah)
  return ayah
}


function getOptionsForQuestion(ayahs, curQues = 1) {
  
const arrayOfOptions = [];


for (let i = 0; i < 10; i++) {
  let newAyah = getAyah(ayahs)
  if(arrayOfOptions.includes(newAyah) || newAyah === quesTion.textContent) newAyah = getAyah(ayahs)
  arrayOfOptions[i] = newAyah;
}
  console.log(arrayOfOptions)
  
  
  let optionSet = new Set(arrayOfOptions)
  
  if(optionSet.size < 4) {
    let anoAyah = getAyah(ayahs)
if (!optionSet.has(anoAyah)) optionSet.add(anoAyah)

}
    
  
  console.log(optionSet)
  optionSet.forEach(a =>  {
    console.log(a, '***********')
  })
  // arrayOfOptions.push(getAyah(ayahs))
  // arrayOfOptions.push(CUR_AYAH_QUES)
  // arrayOfOptions.push(getAyah(ayahs))
  // arrayOfOptions.push(getAyah(ayahs))
  
  
  quranQuiz.options[curQues] = Array.from(optionSet);
  quranQuiz.options[curQues] = quranQuiz.options[curQues].slice(0,4)
  // quranQuiz.options[curQues][rndNumber(4)] = getNextAyah()
  
  
//   if (quranQuiz.options[curQues].length > 4) {
// quranQuiz.options[curQues].pop()
//   }
  
  const letters = ['A', 'B', 'C', 'D'];
  
  renderOptions(letters, quranQuiz.options[curQues])
  
  // quranQuiz.options.curQues.push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  
  // console.log(quranQuiz.options, 'fjfnjfjjfjfjfkfkfk')
  // console.log(curQues)
  // renderOptions(quranQuiz.options[curQues])
  
}



function renderOptions(optionArr, optionText) {
  optionArr.forEach((opt, i) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option__div'
      optionDiv.innerHTML = `
   <span>${optionText[i]}</span>
      <span>${opt}</span>`
      // const html =`<span>${opt}</span>`
      questionOptions.append(optionDiv)
      console.log(opt)
    })
}






const questionsArr = ['Which surah is this', 'From which Juz is this Ayah', 'Does this Ayah has Sajda'];


// const quesText = 'What is the next verse'
// quesTion.innerHTML = quesText;
const allAnswers = document.querySelectorAll('label')


allAnswers.forEach(ans =>{
  ans.addEventListener('click', ()=>{
    ans.classList.add('correct__answer')
  })
})





// const answerox = document.querySelector('.options')

// answerox.addEventListener('click', (e)=>{
//   console.log(e.target)
  
  
//   console.log('yesssss standing you')
// })

const newArr = []

newArr.task = 'yesssss'

console.log(newArr)

function getNextAyah() {
  const indexOfAyahQues = quranQuiz.ayahs.indexOf(CUR_AYAH_QUES);
  return nextAyah = quranQuiz.ayahs[indexOfAyahQues + 1]
}

function updateProgress(curQuesNum = 1) {
  numOfQuesAnswered.textContent = curQuesNum;
  numberOfQuestions = numOfQuestionSelectOptions.value;
  totalQuestionNum.textContent = numberOfQuestions;
 let progressPercentage = (curQuesNum / numberOfQuestions) * 100;
 progressBar.style.width = `${progressPercentage}%`;
}

function storeDataToLocalStorage() {
  localStorage.setItem('quranQuiz', quranQuiz)
}

function getDataFromLocalStorage() {
  return localStorage.getItem('quranQuiz')
}


function submitQuiz() {
  storeDataToLocalStorage()
  
 const deleteEnquiry =  document.querySelector('.submit__enquiry')
 
 deleteEnquiry.classList.remove('hidden')
  
  document.querySelector('.yesOrNo').addEventListener('click', (e) => {
    if(e.target.value === 'Yes'){
      
      setTimeout(() => {
    quizPage.classList.add('hidden')
    resultPage.classList.remove('hidden')
  }, 2000)
  
    }
    
    if(e.target.value === 'No'){
      deleteEnquiry.classList.add('hidden')
    }
  })
  
  
  
  
  
}


function NextQuestion() {
     +CUR_QUES_NUM++
  updateProgress(CUR_QUES_NUM)
  questionOptions.innerHTML = '';
  getAyah(quranQuiz.ayahs)
  renderAyahQuestion(quranQuiz.ayahs)
  console.log(CUR_AYAH_QUES)
  
  if(+CUR_QUES_NUM === +numberOfQuestions){
    document.querySelector('.next__ques__btn').remove()
  }
}

const navigator = document.querySelector('.navigator')

navigator.addEventListener('click', (e) => {

  if(e.target.classList.contains('next__ques__btn')){
    NextQuestion()
  }
  
  if (e.target.classList.contains('submit__btn')) {
  submitQuiz()
}
})



fetch('https://apis-prelive.quran.foundation/content/api/v4').then(res => res.json).then(data => console.log(data))

document.addEventListener('load', ()=>{
  console.log(getDataFromLocalStorage)
})