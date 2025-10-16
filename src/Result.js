import { Button, Box, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { questionsDone } from "./Game"
import { calculateAccuracy } from "./supabase_client"
import { useEffect, useState } from "react"
import { background } from "./Home"

function Result() {
  const location = useLocation()
  const [satoshi, setSatoshi] = useState("loading2.gif")
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
        var accuracy = await precision()
        setMessage(accuracy)
        setSatoshi(accuracy >= 90 ? "satoshi_1.png" : "satoshi_7.png")
      } else if (error === 1) {
        setMessage("Mi spiace, non sono riuscito a trovare il personaggio che stai cercando... Riprova e giochiamo ancora!")
        setSatoshi("satoshi_2.png")
      } else if (error === 2) {
        setMessage("Non sai manco tu il personaggio a cui stai pensando, ritorna quando sarai preparato")
        setSatoshi("satoshi_4.png")
      }
    }
    createMessage()
  }, [])

  return (
    <Box
      sx={{
        ...background,
        textAlign: "center",
        minHeight: "100hv",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      {error === 0
      ? (
        <>
          <Typography variant="body1" sx={{backgroundColor: "#ffffffaa"}}>
            Precisione della tua descrizione:{" "}
            <Typography component="span"
              sx={{
                color: message >= 90 ? "#00bc00" : message >= 80 ? "#fa5a00" : "#ff0000",
                fontWeight: "bold"  
              }}
            >{message}</Typography>%<br/>
            ({helpfulAnswers} risposte utili su {questionsDone.length})
          </Typography>
        </>
      ) : (
        <Typography variant="body1" sx={{backgroundColor: "#ffffffaa"}}>{message}</Typography>
      )}
      <Box
        component="img"
        src={satoshi}
        sx={{ width: 300, height: "auto" }}
      ></Box>
      <Button
        variant = "contained"
        onClick={() => {
          navigate('/')
        }}
      >Torna alla Home</Button>
    </Box>
  )
}

export default Result