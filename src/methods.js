import { getFirstQuestion, nextQuestion, nextPgQuestion } from "./supabase_client"
import { pgList, questionsDone } from "./Game"

const questionHeader = "Il tuo personaggio "

export async function generateQuestion(nQuestion, setNquestion) {
  setNquestion((n) => n + 1)
  let question
  if (nQuestion === 1) {
    question = await getFirstQuestion()
  } else if (nQuestion <= 3) {
    let nq = await nextQuestion(pgList.keys(), questionsDone)
    console.log(pgList.keys())
    question = rightQuestion(nq)
  } else {
    let nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.firstKey())
    console.log(pgList.keys())
    question = rightQuestion(nq)
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
    case "is_hero": return value ? "è buono/un alleato?" : "è un villain?"
    case "team": return `fa parte ${value}?`
    case "saga": return `è stato presentato per la prima volta durante la saga ${value}?`
    default: return value
  }
}

function rightQuestion(nq){
  let tempQ
  let size = pgList.length()
  let rightDiff = size/2, minDiff = Number.MAX_SAFE_INTEGER
  for (let i=0; i < nq.length; i++){
    let diff = Math.abs(nq[i].n_yes_in_game - rightDiff)
    if (minDiff > diff){ 
      minDiff = diff
      tempQ = {id: nq[i].id, topic: nq[i].topic, question: nq[i].question}
    }
  }
  return tempQ
}