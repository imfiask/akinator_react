import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="Home">
      <button onClick={() => navigate('/game')}>Vai al gioco</button>
    </div>
  );
}

export default Home;