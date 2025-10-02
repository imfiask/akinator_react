import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, ButtonGroup, Box, LinearProgress } from "@mui/material";
import { generateQuestion } from './methods'
import { getAllAnime, getAmountPg } from './supabase_client'
import PgList from './PgList'
/*
- (elimina funzioni inutili)
- aggiungere le immagini dell'avatar
- poter ritornare indietro con le domande
*/
var topic, value
export var pgList
export var questionsDone
export var animeInGame
export var maxExpansionRound
export var nFirstQuestion
var countIdk = 0
var attempts
var totPgs = await getAmountPg()
var animeList = await getAllAnime()

export async function resetGame(setNquestion, setQuestion, setGameState){
  pgList = new PgList()
  questionsDone = []
  animeInGame = [...animeList]
  maxExpansionRound = 4
  nFirstQuestion = 1
  attempts = 1
  countIdk = 0
  setNquestion(0)
  setQuestion("")
  setGameState({
    flagFocus: false,
    flagWin: false,
    isLoading: true,
    progress: 0,
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
    isLoading: false,
    progress: 0,
    nameWinner: null,
    imageWinner: null
  })
  const initialized = useRef(false)
  const navigate = useNavigate()
  
  async function createQuestion(){
    if (nQuestion > 2) updateProgress()
    let nq = nQuestion + 1 
    setNquestion((n) => n + 1)
    //console.log(pgList.getList())
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nq, setGameState)
    if (newQuestion) setQuestion(newQuestion)
    setGameState(state =>({...state, isLoading: false}))
    //console.log(questionsDone)
  }
  
  function updateProgress(){
    var gapScore = pgList.firstValue() - pgList.secondValue()
    var pgProgress = (totPgs - pgList.length()) / totPgs
    setGameState(state =>({...state, progress: pgProgress + gapScore}))
  }
  
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    resetGame(setNquestion, setQuestion, setGameState)
    createQuestion()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      {!gameState.flagWin
        ? (
          <>
            <Container sx={{ height: 100 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>Domanda n°{nQuestion}:</Typography>
              {gameState.isLoading
                ? <Box
                    component="img"
                    src="/circular_loading2.gif"
                    sx={{ width: 73.5 }}
                  ></Box>
                : <Typography variant="body1" sx={{ whiteSpace: 'pre-line', margin: 2 }}>{question}</Typography>
              }
            </Container>
            <br/>
            <ButtonGroup variant = "contained" sx={{ display: "flex", width: "100%", height: 50 }}>
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("probSì", topic, value, "1.15", nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                sx={{ flex: 1 }}
              >Probabilmente Sì</Button>
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("probNo", topic, value, "1.15", nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                sx={{ flex: 1 }}
              >Probabilmente No</Button>
            </ButtonGroup>
            <ButtonGroup variant = "contained" sx={{ display: "flex", width: "100%", height: 50 }}>
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("sì", topic, value, "1.3", nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                sx={{ flex: 1 }}
              >Sì</Button>
              <Button
                onClick={
                  async() => {
                  if(++countIdk === 5) navigate('/result', { state: { error: 2 } })
                  maxExpansionRound++
                  nFirstQuestion++
                  await createQuestion()
                  }
                }
                sx={{ flex: 1 }}
              >Non lo so</Button>
              <Button
                onClick={
                  async() => {
                    var isFinished = await pgList.checkAnswer("no", topic, value, "1.3", nQuestion, gameState.flagFocus, setGameState)
                    if (!isFinished) await createQuestion()
                  }
                }
                sx={{ flex: 1 }}
              >No</Button>
            </ButtonGroup>
            <LinearProgress
            variant="determinate"
              value={gameState.progress * 100}
              sx={{
                height: 15,
                backgroundColor: "#262626",
                "& .MuiLinearProgress-bar": { backgroundColor: "#00b300" }
              }}
            />
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
              sx={{ width: 250, height: 250, objectFit: "contain" }}
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