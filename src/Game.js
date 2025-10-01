import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuestion } from './methods'
import { getAllAnime } from './supabase_client'
import './Home.css'
import PgList from './PgList'
/*
- (elimina funzioni inutili)
- (gestire lista vuota di pg con messaggio "Il personaggio che stai cercando non è presente nel db")
- sistemare i bottoni "si" e "no" in caso di vittoria
- trasformare Win.js in Result.js che contiene un messagio di vittoria o sconfitta
- dividere il "Domanda n° " dalla domanda e aggiungere un caricamento
- dopo 5 "non lo so" metti un messaggio "Mr. Non Lo So"
- metti un caricamento tra una domanda e l'altra
- se il caricamento è complicato, passa alla libreria UI
*/
var topic, value
export const pgList = new PgList()
export var questionsDone = []
export var animeList = await getAllAnime()
export const gameState = {
  flagFocus: false,
  flagWin: false,
  nameWinner: null,
  imageWinner: null
}
export var maxExpansionRound = 4
export var nFirstQuestion = 1

function Game() {
  const [nQuestion, setNquestion] = useState(0)
  const [question, setQuestion] = useState("")
  const initialized = useRef(false)
  const navigate = useNavigate()
  
  async function createQuestion(){
    let nq = nQuestion + 1 
    setNquestion((n) => n + 1)
    console.log(pgList.getList())
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nq, navigate)
    setQuestion(newQuestion)
    console.log(questionsDone)
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    createQuestion()
  })

  return (
    <div className="Home">
      {!gameState.flagWin
        ? (
          <>
            <p style={{whiteSpace: 'pre-line'}}>{question}</p>
            <button style={{margin: 5}} onClick={
              async() => {
                await pgList.checkAnswer("sì", topic, value, nQuestion, navigate)
                await createQuestion()
              }
            }>sì</button>
            <button style={{margin: 5}} onClick={
              async() => {
                maxExpansionRound++
                nFirstQuestion++
                await createQuestion()
              }
            }>non lo so</button>
            <button style={{margin: 5}} onClick={
              async() => {
                await pgList.checkAnswer("no", topic, value, nQuestion, navigate)
                await createQuestion()
              }
            }>no</button>
          </>
        ) : (
          <>
            <p style={{whiteSpace: 'pre-line'}}>Il tuo personaggio è <strong>{gameState.nameWinner}</strong>!</p>
            <img src={gameState.imageWinner} alt={gameState.nameWinner} style={{width: "250px"}}/><br/>
            <button onClick={async() => {navigate('/')}}>sì</button>
            <button onClick={async() => {}}>no</button>
          </>
        )
      }
    </div>
  )
}

export default Game