const quesTion = document.querySelector('.ques__ayah')

// <option value="Fatiha">Fatiha</option>

const selectOptions = document.querySelector('select')
const selectForm = document.querySelector('.selectForm')


const quranQuiz = []


function rndNumber(max, min = 1) {
  return Math.round((Math.random() * (max - min)) + min)
}

console.log('loading...')

let SURAH_INDEX;

async function first() {
  let chapter2 = await fetch('https://api.qurani.ai/gw/qh/v1/surah?limit=2000&offset=0')
  
  let data2 = await chapter2.json();
  randOm(data2)
}


first();
async function getQuranFromAPI(surahIndex) {

  
  let chapters = await fetch(`https://api.qurani.ai/gw/qh/v1/surah/${surahIndex + 1}/quran-uthmani?limit=2000&offset=0`)
  
  
  // let chapters = await fetch('https://api.qurani.ai/gw/qh/v1/ayah/2:255/quran-uthmani')
  console.log(chapters)
  
  
  let chapter = await chapters.json();
  let datas = chapter.data.ayahs
  
  quranQuiz.ayahs = datas.map(data => data.text)
  addAyahToPoll(quranQuiz.ayahs)
  
  console.log(quranQuiz.ayahs);
}





function randOm(data2) {
  const allSurahs = data2.data.map(data => data.englishName)
  allSurahs.forEach(surah => {
  const html = `<option value="${surah}">${surah}</option>`
  selectOptions.insertAdjacentHTML('beforeend', html)
})



selectForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  const selectedAyah = selectOptions.value;
  console.log(selectedAyah)
  
   SURAH_INDEX = allSurahs.indexOf(selectedAyah)
  console.log(SURAH_INDEX)
  
  getQuranFromAPI(SURAH_INDEX)
})

}

function addAyahToPoll(ayahArr) {
  quesTion.innerHTML = getAyah(ayahArr);
}


function getAyah(ayahArr) {
  return quranQuiz.ayahs[rndNumber(ayahArr.length)].split(' ').slice(0, 10).join(' ')
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