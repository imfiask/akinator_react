import { useState, useEffect, useRef } from 'react';
import { generateQuestion } from './methods';
import { getNTotPg } from './supabase_client';
import './Home.css';
import PgList from './PgList';

var topic, value, nPg
export const pgList = new PgList()
export var questionsDone = []

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  const initialized = useRef(false);
  
  async function createQuestion(){
    //nPg = await getNTotPg()
    var newQuestion
    [newQuestion, topic, value] = await generateQuestion(nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    createQuestion()
  }, [])

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
      <button onClick={async() => {await pgList.checkAnswer("sì", topic, value); await createQuestion()}}>sì</button>
      <button onClick={async() => {await pgList.checkAnswer("no", topic, value); await createQuestion()}}>no</button>
    </div>
  );
}

export default Home;