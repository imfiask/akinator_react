import { useState, useEffect } from 'react';
import { generateQuestion } from './methods';
import { getNTotPg, getNull } from './supabase_client';
import './Home.css';
import PgList from './PgList';

export var topic, value, nPg
export const pgList = new PgList()
export var questionsDone = []

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
      <button onClick={() => pgList.checkAnswer("sì")}>sì</button>
      <button onClick={() => pgList.checkAnswer("no")}>no</button>
    </div>
  );
}

export default Home;