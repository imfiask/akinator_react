import { createClient } from "@supabase/supabase-js"
import { animeInGame } from "./Game"

const url = process.env.REACT_APP_SUPABASE_URL
const key = process.env.REACT_APP_SUPABASE_KEY

//prende tutti gli anime distinti
export async function getAllAnime(){
  const { data, error } = await supabase
    .from('distinct_anime')
    .select('*')

    return data.map(element => element.anime)
}

//prende il count di tutti i pg
export async function getAmountPg(){
  const { count, error } = await supabase
    .from('characters')
    .select('*', { count: 'exact', head: true})

    return count
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

export async function calculateAccuracy(dataClean, idPg) {
  const { data, error } = await supabase.rpc("calculate_accuracy", {
    dataclean: dataClean,
    idpg: idPg
  })
  
  if (error) {
    console.error("Errore in calculate_accuracy:", error)
    return []
  }
  console.log(data)
  return data 
}

export const supabase = createClient(url, key)