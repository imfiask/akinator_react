import { useState, useEffect } from 'react';
import { generateQuestion } from './methods';
import './Home.css';

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  const [pgList, setPgList] = useState([])
  
  function createQuestion(){
    const newQuestion = generateQuestion(pgList.first, nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  useEffect(() => {
    createQuestion()
  }, [])

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
    </div>
  );
}

export default Home;