import { useState, useEffect } from 'react';
import { generateQuestion } from './methods';
import { getNTotPg } from './supabase_client';
import './Home.css';
import PgList from './PgList';

export var topic, value, nPg
export const pgList = new PgList()

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  
  async function createQuestion(){
    nPg = await getNTotPg()
    var newQuestion
    [newQuestion, topic, value] = await generateQuestion(pgList.first(), nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  useEffect(() => {
    createQuestion()
  }, [])

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
      <button onClick={() => pgList.checkAnswer("sì")}>si</button>
    </div>
  );
}

export default Home;