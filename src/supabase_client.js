import { createClient } from "@supabase/supabase-js"
import { pgList, questionsDone } from "./Game";

const url = "https://hqwgodduwropoldqavdt.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2dvZGR1d3JvcG9sZHFhdmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjUwMDYsImV4cCI6MjA0NDY0MTAwNn0.-82Y5pZd_MPSG3n7PCAV7mAzRAHRnU-3-XzV-Wm8Lcc"

export async function getNTotPg() {
const { count, error } = await supabase
  .from('characters')
  .select('*', { count: 'exact', head: true });
  return count
}

//pesca la prima domanda
export async function getFirstQuestion() {
  const { data, error } = await supabase
    .from("questions")
    .select("topic, question")
    .order("n_yes", { ascending: false })
    .limit(20);

  const singleQuestion = data[Math.floor(Math.random() * data.length)];
  return singleQuestion;
}

//pesca il topic specifico per un pg
export async function getDetailPg(id, topic) {
  const { data, error } = await supabase
    .from("characters")
    .select(`${topic}`)
    .eq("id", id);

  return data?.[0];
}

//prende gli id che corrispondono alla risposta data
export async function getRightIds(answer, topic, value) {
  const { data, error } = await supabase
    .from("questions")
    .select("who_yes")
    .eq("topic", topic)
    .eq("question", JSON.stringify(value));
  
  const whoYes = data[0].who_yes
  if (answer === "sì" || answer === "probSì") {
    return whoYes;
  } else {
    const { data: whoNo, error: error2 } = await supabase
      .from("characters")
      .select("id")
      .filter("id", "not.in", `(${whoYes.join(",")})`);
    return whoNo;
  }
}

//query per pescare la domanda giusta
// ids: number[]           -> lista degli ID rimasti in gioco
// questionsDone: Array<[topic: string, question: any]> -> coppie già chieste
export async function nextQuestion() {
  const { data, error } = await supabase
    .from('questions')
    .select('topic, question, who_yes')
    .overlaps('who_yes', pgList);

  if (error) throw error;
  if (!data) return [];

  /*const doneSet = new Set(
    questionsDone.map(([t, q]) => `${t}||${JSON.stringify(q)}`)
  );*/

  // 3) per robustezza, confronto come stringhe (nel caso gli id in who_yes fossero stringhe)
  //const idSet = new Set(ids.map(String));

  // 4) calcolo n_yes_in_game = |who_yes ∩ ids|
  const ranked = data
    .map(({ topic, question, who_yes }) => {
      const overlapCount = (who_yes || []).reduce(
        (acc, id) => acc + (pgList.has(String(id)) ? 1 : 0),
        0
      );
      return { topic, question, n_yes_in_game: overlapCount };
    })
    .filter(r => r.n_yes_in_game > 0)
    .filter(r => !questionsDone.has(`${r.topic}||${JSON.stringify(r.question)}`))
    .sort((a, b) => b.n_yes_in_game - a.n_yes_in_game)
    .slice(0, 20);

  return ranked; // [{ topic, question, n_yes_in_game }, ...]
}


export const supabase = createClient(url, key)