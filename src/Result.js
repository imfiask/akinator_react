import { Button, Container, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { questionsDone } from "./Game"
import { calculateAccuracy } from "./supabase_client"
import { useEffect, useState } from "react"

function Result() {
  const location = useLocation()
  const { error, gameHistory, idPg } = location.state || {}
  const navigate = useNavigate()
  const [message, setMessage] = useState("")

  async function precision(){
    const dataClean = questionsDone.map((q, i) => {
      const round = gameHistory.current.at(i + 1)
      return [q[0], round[3] === "sì" || round[3] === "probSì"]
    })
    var accuracy = await calculateAccuracy(dataClean, idPg)
    console.log(questionsDone.length)
    return ((accuracy/questionsDone.length)*100).toFixed(2)
  }

  useEffect(() => {
    async function createMessage() {
      if (error === 0) {
        setMessage(await precision())
      } else if (error === 1) {
        setMessage("Mi spiace, non sono riuscito a trovare il personaggio che stai cercando... Riprova e giochiamo ancora!")
      } else if (error === 2) {
        setMessage("Non sai manco tu il personaggio a cui stai pensando, ritorna quando sarai preparato")
      }
    }
    createMessage()
  }, [])

  return (
    <Container sx={{ textAlign: "center" }}>
      {error === 0
      ? (
        <Typography variant="body1">
          La tua descrizione è stata precisa al{" "}
          <Typography component="span"
            sx={{
              color: message >= 90 ? "#00aa00" : "#fa5a00",
              fontWeight: "bold"  
            }}
          >{message}</Typography>%
        </Typography>
      ) : (
        <Typography variant="body1">{message}</Typography>
      )}
      <Button
        variant = "contained"
        onClick={() => {
          navigate('/')
        }}
      >Torna alla Home</Button>
    </Container>
  )
}

export default Result