import { createClient } from "@supabase/supabase-js"

const url = "https://hqwgodduwropoldqavdt.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2dvZGR1d3JvcG9sZHFhdmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjUwMDYsImV4cCI6MjA0NDY0MTAwNn0.-82Y5pZd_MPSG3n7PCAV7mAzRAHRnU-3-XzV-Wm8Lcc"

export async function getNTotPg() {
const { count, error } = await supabase
  .from('characters')
  .select('*', { count: 'exact', head: true })
  return count
}

//pesca la prima domanda
export async function getFirstQuestion() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, topic, question, n_yes")
    .order("n_yes", { ascending: false })
    .limit(20)

  const singleQuestion = data[Math.floor(Math.random() * data.length)]
  return singleQuestion
}

//prende gli id che corrispondono alla risposta data
export async function getRightIds(answer, topic, value) {
  const { data, error } = await supabase
    .from("questions")
    .select("who_yes")
    .eq("topic", topic)
    .eq("question", JSON.stringify(value))
  
  const whoYes = data[0].who_yes
  if (answer === "sì" || answer === "probSì") {
    return whoYes
  } else {
    const { data: whoNo, error: error2 } = await supabase
      .from("characters")
      .select("id")
      .filter("id", "not.in", `(${whoYes.join(",")})`)
    return whoNo.map(item => item.id)
  }
}

//query per pescare la domanda giusta
export async function nextQuestion(ids, qd) {
  const { data, error } = await supabase.rpc("next_question", {
    ids: ids,
    questions_done: qd
  })
  console.log(qd)
  if (error) {
    console.error("Errore in next_question:", error)
    return []
  }
  
  //console.log(data)
  return data
}

//query per pescare la domanda giusta basata sul pg
export async function nextPgQuestion(ids, qd, idPg) {
  const { data, error } = await supabase.rpc("next_pg_question", {
    ids: ids,
    questions_done: qd,
    idpg: idPg
  })

  if (error) {
    console.error("Errore in next_pg_question:", error)
    return []
  }
  //console.log(ids)
  console.log(qd)
  //console.log(idPg)
  console.log(data)
  return data 
}

export async function getDetailsPg(id) {
  const { data, error } = await supabase
    .from("characters")
    .select("name, image")
    .eq("id", id)
    .single()

  return data
}

export async function getAnimePgs(answer, anime){
  const { data, error } = await supabase
    .from("questions")
    .select("who_yes")
    .eq("topic", "anime")
    .eq("question", JSON.stringify(anime))
  
  const whoYes = data[0].who_yes
  if (answer === "sì" || answer === "probSì") {
    return whoYes
  } else {
    const { data: whoNo, error: error2 } = await supabase
      .from("characters")
      .select("id")
      .filter("id", "not.in", `(${whoYes.join(",")})`)
    return whoNo.map(item => item.id)
  }
}

export const supabase = createClient(url, key)