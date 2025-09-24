import { getRightIds, getDetailsPg } from "./supabase_client"

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

  firstValue(){
    return this.pgList[0].get(this.firstKey())
  }

  async checkAnswer(answer, topic, value, nQuestion) {
    const ids = await getRightIds(answer, topic, value)
    this.updateProbabilities(ids, nQuestion)

    if (topic === "anime" && nQuestion-1 > 1) {
      console.log(ids)
      this.remove(ids, {flag: answer === "sì" || answer === "probSì"})
      this.normalize()
      console.log(this.pgList)
      return
    }

    this.normalize()
    console.log(this.pgList)
    if (nQuestion > 3) {
      this.selectAndRemoveLowProbabilities()
      this.normalize()
      if (this.isFirstHighEnough()) {
        const pg = await getDetailsPg(this.firstKey())
        console.log("IL PERSONAGGIO È " + pg.name)
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
        if (nQuestion < 4){
          this.add(id, listLength + ids.length)
        }
      }
    }
  }

  selectAndRemoveLowProbabilities() {
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
    console.log(toRemove)
    this.remove(toRemove)
  }

  isFirstHighEnough() {
    if (this.length() < 2) return false
    const first = this.pgList[0].values().next().value
    const second = this.pgList[1].values().next().value
    return first / second > 1.6
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

  remove(toRemove, { flag = false } = {}) {
    console.log(flag)
    this.pgList = this.pgList.filter(map => {
      const id = [...map.keys()][0]
      return flag ? toRemove.includes(id) : !toRemove.includes(id)
    })
  }
}

export default PgList