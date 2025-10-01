import { createClient } from "@supabase/supabase-js"
import { animeInGame } from "./Game"

const url = "https://hqwgodduwropoldqavdt.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2dvZGR1d3JvcG9sZHFhdmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjUwMDYsImV4cCI6MjA0NDY0MTAwNn0.-82Y5pZd_MPSG3n7PCAV7mAzRAHRnU-3-XzV-Wm8Lcc"

//prende tutti gli anime distinti
export async function getAllAnime(){
  const { data, error } = await supabase
    .from('distinct_anime')
    .select('*')

    return data.map(element => element.anime)
}

//pesca la prima domanda
export async function getFirstQuestion() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, topic, question, n_yes")
    .order("n_yes", { ascending: false })
    .neq("topic", "anime")
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
  let flag = answer === "sì" || answer === "probSì"
  if (topic === "anime") flag = !flag
  if (flag) {
    const { data, error } = await supabase
      .from("characters")
      .select("id")
      .in("id", whoYes)
      .in("anime", animeInGame)
    if (error) {
      console.error(error)
      return []
    }
    return data.map(element => element.id)
  } else {
    const { data: whoNo, error: error2 } = await supabase
      .from("characters")
      .select("id")
      .filter("id", "not.in", `(${whoYes.join(",")})`)
      .in("anime", animeInGame)
    console.log("sono sopravvissuto")
    if (error2) {
      console.error(error2)
      return []
    }
    return whoNo.map(element => element.id)
  }
}

//query per pescare la domanda giusta
export async function nextQuestion(ids, qd) {
  const { data, error } = await supabase.rpc("next_question", {
    ids: ids,
    questions_done: qd
  })
  if (error) {
    console.error("Errore in next_question:", error)
    return []
  }
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
  return data 
}

//prende nome e img della soluzione
export async function getInfoSolution(id) {
  const { data, error } = await supabase
    .from("characters")
    .select("name, image")
    .eq("id", id)
    .single()

  return data
}

export async function getSpecificQuestion(id){
  const { data, error } = await supabase
    .from("questions")
    .select("id, topic, question")
    .eq("n_yes", 1)
    .overlaps("who_yes", [id])
  
  if(error) console.error(error)
  return data[0]
}

export const supabase = createClient(url, key)