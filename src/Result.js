import { Button, Container, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function Result() {
  const location = useLocation()
  const { error } = location.state || {}
  const navigate = useNavigate()

  function createMessage(){
    switch(error){
      case 0:
        return "SONO TROPPO FORTE!"
      case 1:
        return "Mi spiace, non sono riuscito a trovare il personaggio che stai cercando... Riprova e giochiamo ancora!"
      case 2:
        return "Non sai manco tu il personaggio a cui stai pensando, ritorna quando sarai preparato"
      default: console.log("yoyoyo")
    }
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography
          variant = "body1"
          sx={{ whiteSpace: "pre-line" }}
        >{createMessage()}
      </Typography>
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