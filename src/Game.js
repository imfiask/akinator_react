import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { background } from './Home';
import { Container, Typography, Button, ButtonGroup, Box, LinearProgress } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { generateQuestion, analyzeQuestion, questionHeader } from './methods'
import { getAllAnime, getAmountPg } from './supabase_client'
import PgList from './PgList'

var topic, value
export var pgList
export var questionsDone
export var animeInGame
export var maxExpansionRound
export var nFirstQuestion
export const PATH = process.env.PUBLIC_URL
var countIdk = 0
var attempts
var totPgs = await getAmountPg()
var animeList = await getAllAnime()
/*const buttonStyle = {
  margin: 0.1,
  backgroundColor: "#38514Dee",
  border: "1px solid black",
  "&:hover": {
    backgroundColor: "#38514Dff",
    border: "1px solid black"
  },
  "&.Mui-focusVisible": {
    outline: "1px solid black"
  }
}*/
const buttonStyle = {
  backgroundImage: `url(${process.env.PUBLIC_URL}/button.png)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "black",
  border: "1px solid #262626 !important",
}

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
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  console.log(process.env.PUBLIC_URL)
  const [satoshi, setSatoshi] = useState()
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
    console.log(pgList.getList())
    let nq = nQuestion + 1 
    setNquestion((n) => n + 1)
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nq, setGameState)
    if (newQuestion){
      setQuestion(newQuestion)
    }
    setGameState(state =>({...state, isLoading: false}))
    setSatoshi(`satoshi_${Math.floor(Math.random()*8) + 1}.png`)
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
    //console.log("gap tra il primo e il secondo", gapScore)
    var pgProgress = (totPgs - pgList.length()) / totPgs
    //console.log("tutti i pg nel db",totPgs)
    //console.log("tuttiPG - PGLIST / tuttiPG",pgProgress)
    var tempProgress = pgProgress + gapScore
    //console.log("progresso finale", tempProgress)
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
    //console.log(gameState.progress)
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
    <Box 
      sx={{
        ...background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src='satoshi_title.png'
        sx={{height: "30%", position: "absolute", top: 0, left: 0}}
      ></Box>

      <Container 
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 👇 SATOSHI SEMPRE VISIBILE */}
        <Box
          component="img"
          src={satoshi}
          sx={{ marginLeft: 9, width: 300, height: "auto",  }}
        ></Box>

        {/* 👇 SE flagWin = FALSE → mostra domande e bottoni */}
        {!gameState.flagWin && (
          <Container sx={{ marginLeft: 7, minWidth: 600 }}>

            <Container maxWidth="sm" sx={{ height: 100, backgroundColor: "#ffffffaa", }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  width: "100%",
                  marginBottom: 2
                }}
              >
                <Button
                  onClick={rewind}
                  disabled={nQuestion === 1}
                  variant="contained"
                  sx={{
                    backgroundColor: "orange",
                    minWidth: 0,
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    position: "absolute",
                    left: 0,
                    marginTop: 1
                  }}
                >
                  <UndoIcon />
                </Button>
                <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: 1 }}>
                  Domanda n°{nQuestion}:
                </Typography>
              </Box>

              {gameState.isLoading ? (
                <Box
                  component="img"
                  src={`${process.env.PUBLIC_URL}/loading1.gif`}
                  sx={{ width: 45 }}
                ></Box>
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: 15 }}>
                  {question}
                </Typography>
              )}
            </Container>

            <ButtonGroup variant="contained" sx={{ width: "100%", height: 50 }}>
              <Button
                onClick={ async() => { await handleAnswer("probSì", 1.15) } }
                sx={{ flex: 1, ...buttonStyle }}
                disabled={gameState.isLoading}
              >Probabilmente Sì</Button>

              <Button
                onClick={ async() => { await handleAnswer("probNo", 1.15) } }
                sx={{ flex: 1, ...buttonStyle }}
                disabled={gameState.isLoading}
              >Probabilmente No</Button>
            </ButtonGroup>

            <ButtonGroup variant="contained" sx={{ width: "100%", height: 50 }}>
              <Button
                onClick={ async() => { await handleAnswer("sì", 1.3) } }
                sx={{ flex: 1, ...buttonStyle }}
                disabled={gameState.isLoading}
              >Sì</Button>

              <Button
                onClick={ async() =>  {await handleAnswer("nls", null) } }
                sx={{ flex: 1, ...buttonStyle }}
                disabled={gameState.isLoading}
              >Non lo so</Button>

              <Button
                onClick={ async() => { await handleAnswer("no", 1.3) } }
                sx={{ flex: 1, ...buttonStyle }}
                disabled={gameState.isLoading}
              >No</Button>
            </ButtonGroup>

            <LinearProgress
              variant="determinate"
              value={gameState.progress * 100}
              sx={{
                height: 15,
                backgroundColor: "#262626",
                "& .MuiLinearProgress-bar": { backgroundColor: "#00bc00" }
              }}
            ></LinearProgress>

          </Container>
        )}
        {/* 👇 SE flagWin = TRUE → mostra solo la parte finale */}
        {gameState.flagWin && (
          <Container sx={{ marginLeft: 7}}>
            <Container sx={{textAlign: "center"}}>
              <Container
                sx={{
                  backgroundColor: "#ffffffaa",
                  borderRadius: 5,
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "fit-content",
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  Il tuo personaggio è...
                </Typography>

                <Typography
                  variant="h5" // più grande
                  sx={{ fontWeight: "bold", marginTop: 1, fontSize: 35 }}
                >
                  {gameState.nameWinner}
                </Typography>

                <Box
                  component="img"
                  src={gameState.imageWinner}
                  alt={gameState.nameWinner}
                  sx={{ width: 250, height: 250, objectFit: "contain", marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate('/result', { 
                        state: { 
                          error: 0, 
                          gameHistory: gameHistory, 
                          idPg: pgList.getFirstKey()
                        }
                      })
                    }}
                    sx={{ margin: 1 }}
                  >
                    Sì
                  </Button>

                  <Button
                    variant="contained"
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
                      } else {
                        navigate('/result', { state: { error: 1 } })
                      }
                    }}
                    sx={{ margin: 1 }}
                  >
                    No
                  </Button>
                </Box>
              </Container>
            </Container>
          </Container>
        )}

      </Container>
    </Box>
  )

}

export default Game