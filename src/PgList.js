import { getRightIds, getInfoSolution } from "./supabase_client"
import { removeAnime } from "./methods"
import { maxExpansionRound } from "./Game"

class PgList {
  constructor() {
    this.pgList = []
  }

  add(id, prob) {
    let map = new Map()
    this.pgList.push(map.set(id, prob))
  }

  getList() {
    return this.pgList
  }

  sort() {
    this.pgList.sort((a, b) => {
      const el1 = [...a.values()][0]
      const el2 = [...b.values()][0]
      return  (el1 === el2) ? Math.random() - 0.5 : el2 - el1
    })
  }

  normalize(){
    let sum = 0
    this.pgList.forEach(map => sum += [...map.values()][0])
    this.pgList = this.pgList.map(map => {
      const id = [...map.keys()][0]
      const value = [...map.values()][0] / sum
      return new Map([[id, value]])
    })
    this.sort()
  }
  
  getFirstKey() {
    return this.pgList[0].keys().next().value
  }

  getSecondKey() {
    return this.pgList[1].keys().next().value
  }

  getFirstValue(){
    return this.pgList[0].values().next().value
  }

  getSecondValue(){
    return this.pgList[1].values().next().value
  }

updateValueByID(id, weight) {
  const map = this.pgList.find(m => m.has(id))
  const [[key, oldVal]] = map.entries()
  map.set(key, oldVal * weight)
}

  //risposta utente, tema domanda, domanda, peso, nDomanda, focus on, gameState, progress
  async checkAnswer(answer, topic, value, weight, nQuestion, flagFocus, setGameState) {
    setGameState(state =>({...state, isLoading: true}))
    if(flagFocus){
      const pg = await getInfoSolution(this.getFirstKey())
      if(answer === "sì" || answer === "probSì"){
        setGameState(state =>({...state, progress: 1}))
        setTimeout(() => {
            setGameState(state =>({
            ...state,
            flagWin: true,
            isLoading: false,
            nameWinner: pg.name,
            imageWinner: pg.image
          }))
        }, 500)
        return true
      }
      this.pgList[0].set(this.getFirstKey(), this.getFirstValue() * 0.5) 
      this.normalize()
      setGameState(state =>({
        ...state,
        flagFocus: false,
      }))
      return false
    }
    const ids = await getRightIds(answer, topic, value)
    this.updateProbabilities(ids, weight, nQuestion)

    if (topic === "anime") {
      removeAnime(answer === "sì" || answer === "probSì", value)
      this.remove(ids)
    }

    //this.normalize()
    if (nQuestion > maxExpansionRound) {
      this.sort()
      //console.log("entro perché ", nQuestion, " > ", maxExpansionRound)
      this.selectAndRemoveLowProbabilities(topic)
      this.normalize()
      if (this.isFirstHighEnough()) {
        const pg = await getInfoSolution(this.getFirstKey())
        setGameState(state =>({...state, progress: 1}))
        setTimeout(() => {
            setGameState(state =>({
            ...state,
            flagWin: true,
            isLoading: false,
            nameWinner: pg.name,
            imageWinner: pg.image
          }))
        }, 500)
        return true
      }
    }
    return false
  }
  
  /*
    ids: lista di id da aggiungere o aggiornare 
    weight: il peso della risposta data
    nQuestion: numero della domanda
  */
  updateProbabilities(ids, weight, nQuestion) {
    const listLength = this.length()
    const newIds = []
    for (const id of ids)
      if (this.has(id)) this.updateValueByID(id, weight)
      else newIds.push(id)
    if (nQuestion >= maxExpansionRound) return
    const prob = (1 / (listLength + newIds.length)) * weight
    for (const id of newIds) this.add(id, prob)
  }

  selectAndRemoveLowProbabilities(topic) {
    const toRemove = []
    const minValue = this.getFirstValue() * 0.2
    let i = this.length() - 1
    while (i >= 0) {
      const value = this.pgList[i].values().next().value
      if (value < minValue) {
        toRemove.push(this.pgList[i].keys().next().value)
        i--
      } else break
    }

    if(toRemove.length !== 0){
      if(topic === "anime") return
      this.remove(toRemove)
    }
  }

  isFirstHighEnough() {
    const first = this.pgList[0].values().next().value
    const second = this.pgList[1].values().next().value
    return first / second > 1.65
  }

  keys(){
    return this.pgList.map(map => [...map.keys()][0])
  }

  has(id) {
    return this.pgList.some(map => map.has(id))
  }

  length(){
    return this.pgList.length
  }

  remove(toRemove) {
    this.pgList = this.pgList.filter(map => {
      const id = [...map.keys()][0]
      return !toRemove.includes(id)
    })
  }

  clone(){
    return this.pgList.map(m => new Map([...m.entries()]))
  }

  overwrite(newData) {
    this.pgList = newData.map(m => new Map([...m.entries()]))
  }
}

export default PgList