import { useState, useEffect, useRef } from 'react'
import { generateQuestion } from './methods'
import './Home.css'
import PgList from './PgList'

var topic, value
export const pgList = new PgList()
export var questionsDone = []
//DEVI MODIFICARE LE FUNZIONI SQL, AGGIUNTA CONTROLLO DELLA LISTA PG ANIME
function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  const initialized = useRef(false)
  
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
      <button onClick={async() => {await pgList.checkAnswer("sì", topic, value, nQuestion); await createQuestion()}}>sì</button>
      <button onClick={async() => {await pgList.checkAnswer("no", topic, value, nQuestion); await createQuestion()}}>no</button>
    </div>
  )
}

export default Home