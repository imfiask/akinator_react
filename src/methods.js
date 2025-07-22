import { getDetailPg } from "./supabase_client"

export async function assembleQuestion(nQuestion, setNquestion){
    const questionHeader = "Il tuo personaggio "
    setNquestion(n => n + 1)
    const id = Math.floor(Math.random()*478+1)
    //const topic = questionBasedContext()
    const topic = "common_notes"
    const example = await getDetailPg(id, topic)
    console.log(example)
    return example.name + " " + example[topic];
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
            return 'gender';
        case 7:
        case 8:
            return 'race';
        case 9:
        case 10:
        case 11:
            return 'hero';
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