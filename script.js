const quesTion = document.querySelector('.ques__ayah')

const surahSelectOptions = document.querySelector('#surahs__options');
const numOfQuestionSelectOptions = document.querySelector('#NumberOfQuestions')

const selectForm = document.querySelector('.selectForm')
const quizContainer = document.querySelector('.quiz__container')
const loadingText = document.querySelector('.load')
const totalQuestionNum = document.querySelector('.total__ques')

const quranQuiz = {}


function rndNumber(max, min = 1) {
  return Math.round((Math.random() * (max - min)) + min)
}

console.log('loading...')

let SURAH_INDEX;

async function first() {
  try {
    let chapter2 = await fetch('https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0')
  
    let data2 = await chapter2.json();
    getSurahsToSelect(data2)
  } catch (e) {
    console.error(e.message, 'and')
    loadingText.classList.remove('hidden');
    loadingText.innerHTML = 'Connect to Internet 🛜'
  }
}

first();


async function getQuranFromAPI(surahIndex) {
  try {
      let chapters = await fetch(`https://api.qurani.ai/gw/qh/v1/surah/${surahIndex + 1}/quran-uthmani?limit=2000&offset=0`)
  
  let chapter = await chapters.json();
  let datas = chapter.data.ayahs
  
  quranQuiz.ayahs = datas.map(data => data.text)
  addAyahToPoll(quranQuiz.ayahs)
  console.log(quranQuiz.ayahs)
  console.log(quranQuiz.ayahs);
  } catch (e) {
    console.error(e.message, 'fhrhfh')
    loadingText.classList.remove('hidden');
    loadingText.innerHTML = e.message
  }

}


function getSurahsToSelect(surahDataApi) {
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
  quesTion.innerHTML = getAyah(ayahArr);
}


function getAyah(ayahArr) {
  let newRndNum = rndNumber(ayahArr.length - 1);
  // console.log(quranQuiz.ayah[rndNumber(ayahArr.length)])
  const ayah = quranQuiz.ayahs[newRndNum].split(' ').slice(0, 10).join(' ');
  
  console.error(ayah)
  return ayah
}


function GetAddToOptions(surahIndex) {
  const optionA = surahIndex--
  const optionB = surahIndex + rnd
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
  getAyah(quranQuiz.ayahs)
  addAyahToPoll(quranQuiz.ayahs)
  
  
  console.log('okay')
})
