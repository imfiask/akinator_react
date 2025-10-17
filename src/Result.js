import { Button, Box, Typography, Container } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { questionsDone } from "./Game"
import { calculateAccuracy } from "./supabase_client"
import { useEffect, useState } from "react"
import { background } from "./Home"

function Result() {
  const location = useLocation()
  const [animatedValue, setAnimatedValue] = useState(0)
  const { error, gameHistory, idPg } = location.state || {}
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [helpfulAnswers, setHelpfulAnswers] = useState(0)

  async function precision(){
    const dataClean = questionsDone.map((q, i) => {
      const round = gameHistory.current.at(i + 1)
      return [q[0], round[3] === "sì" || round[3] === "probSì"]
    })
    var tempHelpfulAnswers = await calculateAccuracy(dataClean, idPg)
    setHelpfulAnswers(tempHelpfulAnswers)
    return ((tempHelpfulAnswers/questionsDone.length)*100).toFixed(2)
  }

  useEffect(() => {
    async function createMessage() {
      if (error === 0) {
        const accuracy = await precision()
        setMessage(Number(accuracy))
      } else if (error === 1) {
        setMessage("Mi spiace, non sono riuscito a trovare il personaggio che stai cercando... Riprova e giochiamo ancora!")
      } else if (error === 2) {
        setMessage("Non sai manco tu il personaggio a cui stai pensando, ritorna quando sarai preparato")
      }
    }
    createMessage()
  }, [])

  useEffect(() => {
  if (!message || isNaN(message)) return
  let startTime = null
  const duration = 1000

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setAnimatedValue(Math.floor(eased * message))
    if (progress < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}, [message])


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
        src="satoshi_title.png"
        sx={{ height: "30%", position: "absolute", top: 0, left: 0 }}
      />

      <Box
        sx={{
          position: "relative",
          width: "60%",
        }}
      >
        <Box
          component="img"
          src="results.png"
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {error === 0 ? (
          <Container sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body1"
              sx={{
                position: "absolute",
                transform: "perspective(1000px) rotatey(-5deg) rotatex(10deg)",
                fontSize: 40,
                top: "13%",
                right: "21%",
              }}
            >
              RISULTATI!
            </Typography>
            <Typography
              component="span"
              sx={{
                position: "absolute",
                transform: "perspective(1000px) rotatey(-5deg) rotatex(10deg) rotate(0.1deg)",
                fontSize: 15,
                top: "30%",
                right: "19%",
              }}
            >
              La tua descrizione era precisa al...
            </Typography>
            <Typography
              component="span"
              sx={{
                color: message >= 90 ? "#00bc00" : message >= 80 ? "#fa5a00" : "#ff0000",
                fontWeight: "bold",
                position: "absolute",
                transform: "perspective(1000px) rotatey(-5deg) rotatex(10deg)",
                top: "36%",
                right: "17%",
                fontSize: 45
              }}
            >
              {animatedValue}%
            </Typography>
            <br />
            <Typography
              variant="body1"
              sx={{
                position: "absolute",
                transform: "perspective(1000px) rotatey(-10deg) rotatex(5deg) rotate(0.2deg)",
                fontSize: 17,
                top: "54%",
                right: "25%",
              }}
            >
              ({helpfulAnswers} risposte utili su {questionsDone.length})
            </Typography>
          </Container>
        ) : (
          <Typography
            variant="body1"
            sx={{
              position: "absolute",
              top: "40%",
              left: "55%",
              backgroundColor: "#ffffffaa",
              padding: 1,
              borderRadius: 2,
              width: "40%",
            }}
          >
            {message}
          </Typography>
        )}

        {/* Bottone sotto il testo */}
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: "55%",
            left: "55%",
            backgroundColor: "#428280ff",
            color: "#73f3f1ff",
            margin: 2,
            fontWeight: "bold",
            transform: "perspective(1000px) rotatey(-10deg) rotatex(5deg) rotate(0.3deg)",
          }}
        >
          Torna alla Home
        </Button>
      </Box>
    </Box>

  )
}

export default Result