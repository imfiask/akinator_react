import { useState, useEffect } from 'react';
import { generateQuestion } from './methods';
import './Home.css';
import PgList from './PgList';

var topic, value
export const pgList = new PgList()

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  
  
  function createQuestion(){
    var newQuestion
    [newQuestion, topic, value] = generateQuestion(pgList.first(), nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  useEffect(() => {
    createQuestion()
  }, [])

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
      <button onClick={pgList.checkAnswer("si", topic, value)}>si</button>
    </div>
  );
}

export default Home;