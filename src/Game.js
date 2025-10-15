import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, ButtonGroup, Box, LinearProgress, IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { generateQuestion, analyzeQuestion, questionHeader } from './methods'
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

export async function resetGame(setNquestion, setQuestion, gameState, setGameState, gameHistory){
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
  gameHistory.current.push([{...gameState}, pgList.clone(), [...animeInGame], null])
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
  var gameHistory = useRef([])
  const navigate = useNavigate()
  
  async function createQuestion(){
    if (nQuestion > 2 && pgList.length() > 1) updateProgress()
    let nq = nQuestion + 1 
    setNquestion((n) => n + 1)
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nq, setGameState)
    if (newQuestion){
      setQuestion(newQuestion)
    }
    setGameState(state =>({...state, isLoading: false}))
  }

  /*
  0 -> gameState
  1 -> pgList
  2 -> animeInGame
  3 -> userAnswer
  */
  async function rewind(){
    //aggiorno le variabili in caso la risposta fosse stata "Non lo so"
    if(gameHistory.current.at(-1)[3] === "nls"){
      countIdk--
      nFirstQuestion--
      maxExpansionRound--
    }
    gameHistory.current.pop()
    const lastRound = gameHistory.current.at(-1)
    setNquestion(nq => nq-1)
    questionsDone.pop()
    var q = questionsDone.at(-1)
    var qTemp
    if (q){
      qTemp = `${questionHeader} ${analyzeQuestion({id: q[0], topic: q[1], question: q[2]})}`
      topic = q[1]
      value = q[2]
      setQuestion(qTemp)
    }else{
      [qTemp, topic, value] = await generateQuestion(nQuestion-1, setGameState)
      setQuestion(qTemp)
    }
    animeInGame = [...lastRound[2]]
    setGameState(lastRound[0])
    pgList.overwrite(lastRound[1])
  }
  
  function updateProgress(){
    var gapScore = pgList.getFirstValue() - pgList.getSecondValue()
    var pgProgress = (totPgs - pgList.length()) / totPgs
    var tempProgress = pgProgress + gapScore
    if(gameState.flagFocus && tempProgress <= 0.6) setGameState(state =>({...state, progress: tempProgress + 0.3}))
    else setGameState(state =>({...state, progress: (tempProgress >= 1) ? 0.99 : tempProgress}))
  }

  async function handleAnswer(userAnswer, weight){
    var isFinished
    if(userAnswer === "nls"){
      if(++countIdk === 5) navigate('/result', { state: { error: 2 } })
      maxExpansionRound++
      nFirstQuestion++
      isFinished = false
    } else isFinished = await pgList.checkAnswer(userAnswer, topic, value, weight, nQuestion, gameState.flagFocus, setGameState)
    gameHistory.current.push([{...gameState}, pgList.clone(), [...animeInGame], userAnswer])
    if (!isFinished) await createQuestion()
  }
  
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    resetGame(setNquestion, setQuestion, gameState, setGameState, gameHistory)
    createQuestion()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 1 }}>
      {!gameState.flagWin
        ? (
          <>
            <Container sx={{ height: 100 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative"
                }}
              >
                <Button
                  onClick={rewind}
                  disabled={nQuestion === 1}
                  variant="contained"
                  sx={{
                    minWidth: 0,
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    padding: 0,
                    position: "absolute",
                    left: 0
                  }}
                >
                  <UndoIcon />
                </Button>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>Domanda n°{nQuestion}:</Typography>
              </Box>
              {gameState.isLoading
                ? <Box
                    component="img"
                    src="/circular_loading2.gif"
                    sx={{ width: 73.5 }}
                  ></Box>
                : <Typography variant="body1" sx={{ whiteSpace: 'pre-line', margin: 3 }}>{question}</Typography>
              }
            </Container>
            <br/>
            <ButtonGroup variant = "contained" sx={{ display: "flex", width: "100%", height: 50 }}>
              <Button
                onClick={ async() => { await handleAnswer("probSì", 1.15) } }
                sx={{ flex: 1 }}
              >Probabilmente Sì</Button>
              <Button
                onClick={ async() => { await handleAnswer("probNo", 1.15) } }
                sx={{ flex: 1 }}
              >Probabilmente No</Button>
            </ButtonGroup>
            <ButtonGroup variant = "contained" sx={{ display: "flex", width: "100%", height: 50 }}>
              <Button
                onClick={ async() => { await handleAnswer("sì", 1.3) } }
                sx={{ flex: 1 }}
              >Sì</Button>
              <Button
                onClick={
                  async() => {
                    await handleAnswer("nls", null)
                  }
                }
                sx={{ flex: 1 }}
              >Non lo so</Button>
              <Button
                onClick={ async() => { await handleAnswer("no", 1.3) } }
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
            ></LinearProgress>
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
                navigate('/result', { state: { error: 0, gameHistory: gameHistory, idPg: pgList.getFirstKey() } })
              }}
              sx={{ margin: 1 }}
            >Sì</Button>
            <Button
              variant = "contained"
              onClick={async() => {
                if(attempts === 1){
                  attempts++
                  pgList.remove([pgList.getFirstKey()])
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