import { getFirstQuestion, nextPgQuestion } from "./supabase_client"
import { pgList, questionsDone, animeList, gameState } from "./Game"

const questionHeader = "Il tuo personaggio "

export async function generateQuestion(nQuestion, setNquestion) { //! sistema e cancella le funzioni inutili
  setNquestion((n) => n + 1)
  let question
    //question = await getRightIds()
    //question = await getSpecificQuestion(pgList.getList()[0].keys().next().value)
    
    //console.log(question)
  //}else{
  if (nQuestion === 1) {
    question = await getFirstQuestion()
  /*} else if (nQuestion <= 3) {
    let nq = await nextQuestion(pgList.keys(), questionsDone)
    question = rightQuestion(nq, gameState.flagFocus)*/
  } else {
    let nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.firstKey())
    if(pgList.getList()[0].values().next().value / pgList.getList()[1].values().next().value >= 1.3){
      gameState.flagFocus = true
    }
    question = rightQuestion(nq)
  }
  //}
  console.log("question: ", question)
  console.log(questionsDone)
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