import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, ButtonGroup, Box } from "@mui/material";
import { generateQuestion } from './methods'
import { getAllAnime } from './supabase_client'
import PgList from './PgList'
/*
- (elimina funzioni inutili)
- aggiungere un caricamento tra una domanda e l'altra
- dopo 5 "non lo so" metti un messaggio "Mr. Non Lo So"
*/
var topic, value
export var pgList
export var questionsDone
export var animeInGame
export var maxExpansionRound
export var nFirstQuestion
var attempts
var animeList = await getAllAnime()

export async function resetGame(setNquestion, setQuestion, setGameState){
  pgList = new PgList()
  questionsDone = []
  animeInGame = [...animeList]
  maxExpansionRound = 4
  nFirstQuestion = 1
  attempts = 1
  setNquestion(0)
  setQuestion("")
  setGameState({
    flagFocus: false,
    flagWin: false,
    nameWinner: null,
    imageWinner: null
  })
}

function Game() {
  const [nQuestion, setNquestion] = useState(0)
  const [question, setQuestion] = useState("")
  const [gameState, setGameState] = useState({
    flagFocus: false,
    flagWin: false,
    nameWinner: null,
    imageWinner: null
  })
  const initialized = useRef(false)
  const navigate = useNavigate()
  
  async function createQuestion(){
    let nq = nQuestion + 1 
    setNquestion((n) => n + 1)
    console.log(pgList.getList())
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nq, setGameState)
    setQuestion(newQuestion)
    console.log(questionsDone)
  }
  
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    resetGame(setNquestion, setQuestion, setGameState)
    console.log(animeList)
    console.log(animeInGame)
    createQuestion()
  }, [])

  return (
    <Container sx={{ textAlign: "center" }}>
      {!gameState.flagWin
        ? (
          <>
            <strong><Typography variant="body1">Domanda n°{nQuestion}:</Typography></strong>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{question}</Typography>
            <br/>
            <ButtonGroup variant = "contained">
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("sì", topic, value, nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                //sx={{ margin: 1 }}
              >Sì</Button>
              <Button
                onClick={
                  async() => {
                  maxExpansionRound++
                  nFirstQuestion++
                  await createQuestion()
                  }
                }
                //sx={{ margin: 1 }}
              >Non lo so</Button>
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("no", topic, value, nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                //sx={{ margin: 1 }}
              >No</Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <Typography
              variant = "body1"
              sx={{ whiteSpace: "pre-line" }}
            >
              Il tuo personaggio è <strong>{gameState.nameWinner}</strong>!
            </Typography>
            <Box
              component = "img"
              src={gameState.imageWinner}
              alt={gameState.nameWinner}
              sx={{ width: 250 }}
            />
            <br/>
            <Button
              variant = "contained"
              onClick={() => {
                navigate('/result', { state: { error: 0 } })
              }}
              sx={{ margin: 1 }}
            >Sì</Button>
            <Button
              variant = "contained"
              onClick={async() => {
                if(attempts === 1){
                  attempts++
                  pgList.remove([pgList.firstKey()])
                  pgList.normalize()
                  setGameState(state =>({
                    ...state,
                    flagWin: false,
                    flagFocus: false
                  }))
                  await createQuestion()
                } else navigate('/result', { state: { error: 1 } })
              }}
              sx={{ margin: 1 }}
            >No</Button>
          </>
        )
      }
    </Container>  
  )
}

export default Game