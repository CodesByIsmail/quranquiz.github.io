const quesTion = document.querySelector('.ques__ayah')

const surahSelectOptions = document.querySelector('#surahs__options');
const numOfQuestionSelectOptions = document.querySelector('#NumberOfQuestions')


const questionOptions = document.querySelector('.options')





const selectForm = document.querySelector('.selectForm')
const quizContainer = document.querySelector('.quiz__container')
const loadingText = document.querySelector('.load')
const totalQuestionNum = document.querySelector('.total__ques')

const quranQuiz = {
  ayahs: [],
  options: []
}


function rndNumber(max, min = 1) {
  return Math.round((Math.random() * (max - min)) + min)
}

console.log('loading...')

let SURAH_INDEX;
let CUR_QUES_NUM;
let CUR_AYAH_QUES;

async function getAllSurahs() {
  try {
    let res = await fetch('https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0')
  
    let allSurahs = await res.json();
    addAllSurahToSelectOption(allSurahs)
  } catch (e) {
    console.error(e.message, 'and')
    loadingText.classList.remove('hidden');
    loadingText.innerHTML = 'Connect to Internet 🛜'
  }
}

getAllSurahs();


async function getQuranFromAPI(surahIndex) {
  try {
      let res = await fetch(`https://api.qurani.ai/gw/qh/v1/surah/${surahIndex + 1}/quran-uthmani?limit=2000&offset=0`)
  
  let chapter = await res.json();
  let ayahsInChapter = chapter.data.ayahs
  
  quranQuiz.ayahs = ayahsInChapter.map(data => data.text)
  
  addAyahToPoll(quranQuiz.ayahs)
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
  
  quizContainer.classList.remove('hidden');
  
  totalQuestionNum.textContent = numOfQuestionSelectOptions.value
})

}

function addAyahToPoll(ayahArr) {
  CUR_AYAH_QUES = getAyah(ayahArr)
  quesTion.innerHTML = CUR_AYAH_QUES;
  AddToOptionsToQuestion(ayahArr, CUR_QUES_NUM)
  
}


function getAyah(ayahArr) {
  let newRndNum = rndNumber(ayahArr.length - 1);
  // console.log(quranQuiz.ayah[rndNumber(ayahArr.length)])
  const ayah = quranQuiz.ayahs[newRndNum].split(' ').slice(0, 10).join(' ');
  
  console.error(ayah)
  return ayah
}


function AddToOptionsToQuestion(ayahs, curQues = 1) {
  
const arrayOfOptions = [];

  
  arrayOfOptions.push(getAyah(ayahs))
  arrayOfOptions.push(CUR_AYAH_QUES)
  arrayOfOptions.push(getAyah(ayahs))
  arrayOfOptions.push(getAyah(ayahs))
  
  
  quranQuiz.options[curQues] = arrayOfOptions;
  
  // quranQuiz.options.curQues.push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  // quranQuiz.options[curQues].push(getAyah(ayahs))
  
  console.log(quranQuiz.options, 'fjfnjfjjfjfjfkfkfk')
  console.log(curQues)
  quranQuiz.options[curQues].forEach(opt => {
    questionOptions.innerHTML += `<span>${opt}</span>`;
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



document.querySelector('.next__ques').addEventListener('click', (e) => {
  +CUR_QUES_NUM++
  questionOptions.innerHTML = '';
  getAyah(quranQuiz.ayahs)
  addAyahToPoll(quranQuiz.ayahs)
  
  
  console.log('okay')
})
