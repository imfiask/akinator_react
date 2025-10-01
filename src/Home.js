import { useNavigate } from 'react-router-dom'
import { Button, Container } from '@mui/material';

function Home() {
  const navigate = useNavigate();

  return (
    <Container sx={{ textAlign: "center" }}>
      <Button variant = "contained" onClick={() => navigate('/game')}>Vai al gioco</Button>
    </Container>
  )
}

export default Home;