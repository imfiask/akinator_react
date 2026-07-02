import { useNavigate } from 'react-router-dom'
import { Button, Box } from '@mui/material';

/*export const background = {
  textAlign: "center",
  height: "100vh",
  backgroundImage: "url('/background2.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  animation: "scroll 30s linear infinite",
  "@keyframes scroll": {
    "0%": { backgroundPosition: "center 0%" },
    "100%": { backgroundPosition: "center -1650%" },
  }
}*/

export const background = {
  textAlign: "center",
  height: "100vh",
  //backgroundImage: "url('/background2.png')",
  backgroundImage: `url(${process.env.PUBLIC_URL}/background2.png)`,
  backgroundSize: "cover",
  backgroundRepeat: "repeat-y",
  animation: "scroll 500000s linear infinite",
  "@keyframes scroll": {
    "0%": { backgroundPositionY: "0" },
    "100%": { backgroundPositionY: "-60000000%" },
  },
};


function Home() {
  const navigate = useNavigate();

  return (
      <Box sx={background}>
        <Box component="img" src="satoshi_0.png"
          sx={{
            maxWidth: "auto",
            height: "87vh",
          }}>
        </Box>
        <br/>
        <Button variant = "contained"
        size='large' 
          sx={{
            backgroundColor: "#428280ff",
            color: "#73f3f1ff",
            margin: 2,
            fontWeight: "bold"
          }}
          onClick={() => navigate('/game')}
        >Gioca</Button>
      </Box>
  )
}

export default Home;