import { getRightIds, getInfoSolution } from "./supabase_client"
import { removeAnime } from "./methods"
import { gameState, maxExpansionRound } from "./Game"

class PgList {
  constructor() {
    this.pgList = []
  }

  add(id, length) {
    let map = new Map()
    this.pgList.push(map.set(id, 1/length))
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
  
  firstKey() {
    return this.pgList[0].keys().next().value
  }

  secondKey() {
    return this.pgList[1].keys().next().value
  }

  firstValue(){
    return this.pgList[0].values().next().value
  }

  secondValue(){
    return this.pgList[1].values().next().value
  }

  async checkAnswer(answer, topic, value, nQuestion) {
    if(gameState.flagFocus){
      if(answer === "sì" || answer === "probSì"){
        gameState.flagWin = true
        const pg = await getInfoSolution(this.firstKey())
        //navigate('/win', {state: { name: pg.name, image: pg.image }})
        gameState.nameWinner = pg.name
        gameState.imageWinner = pg.image
      }
      this.pgList[0].set(this.firstKey(), this.firstValue() * 0.5) 
      gameState.flagFocus = false
      console.log("focus false")
      return
    }
    const ids = await getRightIds(answer, topic, value)
    console.log("ids:", ids)
    this.updateProbabilities(ids, nQuestion)

    if (topic === "anime") {
      removeAnime(answer === "sì" || answer === "probSì", value)
      this.remove(ids)
      this.normalize()
      return
    }

    this.normalize()
    console.log(nQuestion, maxExpansionRound, nQuestion > maxExpansionRound)
    if (nQuestion > maxExpansionRound) {
      console.log("tolgo pg")
      this.selectAndRemoveLowProbabilities(topic, answer)
      this.normalize()
      if (this.isFirstHighEnough()) {
        gameState.flagWin = true
        const pg = await getInfoSolution(this.firstKey())
        //navigate('/win', { state: { name: pg.name, image: pg.image } })
        gameState.nameWinner = pg.name
        gameState.imageWinner = pg.image
      }
    }
  }

  updateProbabilities(ids, nQuestion) {
    let listLength = this.length()
    for (const id of ids) {
      const i = this.pgList.findIndex(map => map.has(id))
      if (i !== -1) {
        const oldVal = [...this.pgList[i].values()][0]
        this.pgList[i].set(id, oldVal * 1.3)
      } else {
        if (nQuestion < maxExpansionRound){
          console.log("aggiungo nuovi id")
          this.add(id, listLength + ids.length)
        }
      }
    }
  }

  selectAndRemoveLowProbabilities(topic, answer) {
    const toRemove = []
    const minValue = this.firstValue() * 0.2
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
    console.log("toRemove: ", toRemove)
  }

  isFirstHighEnough() {
    const first = this.pgList[0].values().next().value
    const second = this.pgList[1].values().next().value
    console.log(first / second)
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

  //?controlla perché forse è inutile il flag
  remove(toRemove, { flag = false } = {}) {
    this.pgList = this.pgList.filter(map => {
      const id = [...map.keys()][0]
      return flag ? toRemove.includes(id) : !toRemove.includes(id)
    })
  }
}

export default PgList