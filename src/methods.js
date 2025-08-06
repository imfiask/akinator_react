import { getFirstQuestion, nextQuestion } from "./supabase_client";

const questionHeader = "Il tuo personaggio ";

export async function generateQuestion(pg, nQuestion, setNquestion) {
  setNquestion((n) => n + 1);
  //const id = (pg) ? pg.id : Math.floor(Math.random()*478+1)
  const question = nQuestion === 1 ? await getFirstQuestion() : await nextQuestion();
  return [
    `Domanda n°${nQuestion}:\n${questionHeader} ${analyzeQuestion(question)}`,
    question.topic,
    question.question,
  ];
}

function analyzeQuestion(question) {
  console.log(question);
  const topic = question.topic;
  const value = question.question;
  switch (topic) {
    case "anime": return `proviene dall'universo di ${value}?`;
    case "is_male": return value == null
        ? "ha un sesso non specificato nella serie?"
        : value
        ? "è maschio?"
        : "è femmina?";
    case "race": return `è un ${value}?`;
    case "is_hero": return value ? "è buono/un alleato?" : "è un villain?";
    case "team": return `attualmente fa parte ${value}?`;
    case "saga": return `è stato presentato per la prima volta durante la saga ${value}?`;
    default: return value;
  }
}