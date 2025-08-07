import { createClient } from "@supabase/supabase-js"

const url = "https://hqwgodduwropoldqavdt.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxd2dvZGR1d3JvcG9sZHFhdmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjUwMDYsImV4cCI6MjA0NDY0MTAwNn0.-82Y5pZd_MPSG3n7PCAV7mAzRAHRnU-3-XzV-Wm8Lcc"

export async function getNTotPg() {
const { count, error } = await supabase
  .from('characters')
  .select('*', { count: 'exact', head: true });
  return count
}

export async function getFirstQuestion() {
  const { data, error } = await supabase
    .from("questions")
    .select("topic, question")
    .order("n_yes", { ascending: false })
    .limit(20);

  const singleQuestion = data[Math.floor(Math.random() * data.length)];
  return singleQuestion;
}

export async function getDetailPg(id, topic) {
  const { data, error } = await supabase
    .from("characters")
    .select(`${topic}`)
    .eq("id", id);

  return data?.[0];
}

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
    const { newData, error } = await supabase
      .from("characters")
      .select("id")
      .not("id", "in", whoYes);
    return newData;
  }
}

export async function nextQuestion(){
    const {data, error} = await supabase
        .from("questions")
        .select("question")
}

export const supabase = createClient(url, key)