import { getRightIds } from "./supabase_client"

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
  }
  
  firstKey() {
    return this.pgList[0].keys().next().value
  }

  firstValue(){
    return this.pgList[0].get(this.firstKey())
  }

  async checkAnswer(answer, topic, value, nQuestion) {
    const ids = await getRightIds(answer, topic, value)
    let listLength = this.length()

    for (const id of ids) {
      const existingIndex = this.pgList.findIndex(map => map.has(id))
      if (existingIndex !== -1) {
        const oldVal = [...this.pgList[existingIndex].values()][0]
        this.pgList[existingIndex].set(id, oldVal * 1.3)
      } else {
        if (nQuestion < 5){
          this.add(id, listLength + ids.length)
        }
      }
    }
    this.normalize()
    this.sort()
    console.log(this.pgList)
    console.log("kakashi è alla posizione " + this.pgList.findIndex(map => map.has(487)))
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
}

export default PgList