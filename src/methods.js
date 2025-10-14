import { getFirstQuestion, nextPgQuestion, getInfoSolution } from "./supabase_client"
import { pgList, questionsDone, animeInGame, nFirstQuestion, stampa } from "./Game"

export const questionHeader = "Il tuo personaggio "

export async function generateQuestion(nQuestion, setGameState) {
  let question
  let flag = false
  if (nQuestion === nFirstQuestion) question = await getFirstQuestion()
  else {
    let nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.firstKey())
    if(pgList.firstValue() / pgList.secondValue() >= 1.29){
      setGameState(state =>({
        ...state,
        flagFocus: true,
      }))
      flag = true
    }
    if(nq.length === 0){
      if(pgList.firstValue() > pgList.secondValue()){
        setGameState(state =>({...state, progress: 1}))
        setTimeout(() => {
            setGameState(state =>({
            ...state,
            flagWin: true,
            isLoading: false,
            nameWinner: pg.name,
            imageWinner: pg.image
          }))
        }, 500)
        const pg = await getInfoSolution(pgList.firstKey())
        return [null, null, null]
      } else {
        nq = await nextPgQuestion(pgList.keys(), questionsDone, pgList.secondKey())
        setGameState(state =>({
          ...state,
          flagFocus: true,
        }))
        flag = true
      }
    }
    question = rightQuestion(nq, flag)
  }
  questionsDone.push([question.id, question.topic, question.question])
  return [
    `${questionHeader} ${analyzeQuestion(question)}`,
    question.topic,
    question.question
  ]
}

export function analyzeQuestion(question) {
  const value = question.question
  switch (question.topic) {
    case "anime": return `proviene dall'universo di ${value}?`
    case "is_male": return value === "null"
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
  animeInGame.splice(0, animeInGame.length, ...animeInGame.filter(item => flag ? item === anime : item !== anime))
}