import { useState } from 'react';
import { assembleQuestion } from './methods';
import './Home.css';

function Home() {
  const [nQuestion, setNquestion] = useState(1)
  const [question, setQuestion] = useState("")
  
  function generateQuestion(){
    const newQuestion = assembleQuestion(nQuestion, setNquestion)
    setQuestion(newQuestion)
  }

  return (
    <div className="Home">
      <button onClick={generateQuestion}/>
      <p style={{whiteSpace: 'pre-line'}}>{question}</p>
    </div>
  );
}

export default Home;
