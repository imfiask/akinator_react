import { getFirstQuestion, nextPgQuestion, getInfoSolution } from "./supabase_client"
import { pgList, questionsDone, animeList, gameState, nFirstQuestion } from "./Game"

const questionHeader = "Il tuo personaggio "

export async function generateQuestion(nQuestion, navigate) {
  let question
  if (nQuestion === nFirstQuestion) question = await getFirstQuestion()
  else {
    let nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.firstKey())
    if(pgList.firstValue() / pgList.secondValue() >= 1.3){
      gameState.flagFocus = true
      console.log("focus true perché primo/secondo = " + pgList.firstValue() / pgList.secondValue())
    }
    if(nq.length === 0){
      if(pgList.firstValue() > pgList.secondValue()){
        gameState.flagWin = true
        const pg = await getInfoSolution(pgList.firstKey())
        //navigate('/win', {state: { name: pg.name, image: pg.image }})
        gameState.nameWinner = pg.name
        gameState.imageWinner = pg.image
        return
      } else {
        nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.secondKey())
        gameState.flagFocus = true
        console.log("focus true")
      }
    }
    question = rightQuestion(nq, gameState.flagFocus)
  }
  questionsDone.push([question.id, question.topic, question.question])
  return [
    `Domanda n°${nQuestion}:\n${questionHeader} ${analyzeQuestion(question)}`,
    question.topic,
    question.question
  ]
}

function analyzeQuestion(question) {
  const value = question.question
  switch (question.topic) {
    case "anime": return `proviene dall'universo di ${value}?`
    case "is_male": return value == null
        ? "ha un sesso non specificato nella serie?"
        : value
        ? "è maschio?"
        : "è femmina?"
    case "race": return `è un ${value}?`
    case "is_hero": return value ? "è dalla parte dei buoni/alleati?" : "è un villain?"
    case "team": return `fa parte ${value}?`
    case "saga": return `è stato presentato per la prima volta durante la saga ${value}?`
    default: return value
  }
}

function rightQuestion(nq, flag){
  let tempQ
  if (flag){
    let lastID = nq.length-1
    tempQ = {id: nq[lastID].id, topic: nq[lastID].topic, question: nq[lastID].question}
  }else{
    let size = pgList.length()
    let rightDiff = size/2, minDiff = Number.MAX_SAFE_INTEGER
    for (let i=0; i < nq.length; i++){
      let diff = Math.abs(nq[i].n_yes_in_game - rightDiff)
      if (minDiff > diff){ 
        minDiff = diff
        tempQ = {id: nq[i].id, topic: nq[i].topic, question: nq[i].question}
      }
    }
  }
  return tempQ
}

export function removeAnime(flag, anime){
  animeList.splice(0, animeList.length, ...animeList.filter(item => flag ? item === anime : item !== anime))
}