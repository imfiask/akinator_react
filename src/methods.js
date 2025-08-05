import { getDetailPg } from "./supabase_client"

const questionHeader = "Il tuo personaggio "

export async function generateQuestion(pg, nQuestion, setNquestion){
    setNquestion(n => n + 1)
    const id = (pg) ? pg : Math.floor(Math.random()*478+1)
    const topic = questionBasedContext()
    //const topic = "common_notes"
    const value = await getDetailPg(id, topic)
    return `Domanda n°${nQuestion}:\n${questionHeader} (id ${id}) ${checkResponse(value, topic)}`
}

function questionBasedContext() {
    const idTopic = Math.floor(Math.random()*19)
    switch (idTopic) {
        case 1:
        case 2:
        case 3:
            return 'anime';
        case 4:
        case 5:
        case 6:
            return 'is_male';
        case 7:
        case 8:
            return 'race';
        case 9:
        case 10:
        case 11:
            return 'is_hero';
        case 12:
            return 'team';
        case 13:
            return 'saga';
        case 14:
        case 15:
        case 16:
            return 'common_notes';
        default:
            return 'special_notes';
    }
}

function checkResponse(value, topic){
    const result = value[topic]
    switch (topic) {
        case 'anime':
            return `proviene dall'universo di ${result}?`;
        case 'is_male':
            return (result == null) ? 'ha un sesso non specificato nella serie?' : (result) ? 'è maschio?' : 'è femmina?';
        case 'race':
            return `è un ${result}?`;
        case 'is_hero':
            return (result) ? 'è buono/un alleato?' : 'è un villain?';
        case 'team':
            return `attualmente fa parte ${result}?`;
        case 'saga':
            return `è stato presentato per la prima volta durante la saga ${result}?`;
        default:
            return singleNote(result);
    }
}

function singleNote(notes){
    const id = Math.floor(Math.random()*notes.length)
    return notes[id]
}

function checkAnswer(answer, topic){
}