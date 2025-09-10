import { getRightIds, nextQuestion } from "./supabase_client"
import { questionsDone } from "./Game"

class PgList {
  constructor() {
    this.pgList = new Map()
  }

  add(id, length) {
    this.pgList.set(id, 1/length)
  }

  getList() {
    return this.pgList
  }

  first() {
    return this.pgList.first
    //return this.pgList.size > 0 ? [...this.pgList.keys()][0] : null
  }

  async checkAnswer(answer, topic, value) {
    const ids = await getRightIds(answer, topic, value)
    const lengthListPg = this.pgList.size + ids.length

    for (const id of ids) {
      if (this.pgList.has(id)) {
        this.pgList.set(id, this.pgList.get(id) * 0.1)
      } else {
        this.add(id, lengthListPg)
      }
    }
    //console.log(this.pgList)
  }

  keys(){
    return [...this.pgList.keys()]
  }

  has(id) {
    return this.pgList.has(id)
  }

  size(){
    return this.pgList.size
  }
}

export default PgList