import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuestion } from './methods'
import { getAllAnime } from './supabase_client'
import './Home.css'
import PgList from './PgList'

var topic, value
export const pgList = new PgList()
export var questionsDone = []
export var animeList = await getAllAnime()
export const gameState = {
  flagFocus: false,
  flagWin: false
}

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  const initialized = useRef(false)
  const navigate = useNavigate()
  
  async function createQuestion(){
    let newQuestion
    [newQuestion, topic, value] = await generateQuestion(nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    
    createQuestion()
  }, [])

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
      <button onClick={async() => {await pgList.checkAnswer("sì", topic, value, nQuestion, navigate); await createQuestion()}}>sì</button>
      <button onClick={async() => {await pgList.checkAnswer("no", topic, value, nQuestion, navigate); await createQuestion()}}>no</button>
    </div>
  )
}

export default Home