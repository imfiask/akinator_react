import { getRightIds } from "./supabase_client";
import { topic, value } from "./Game";

class PgList {
  constructor() {
    this.pgList = new Map();
  }

  add(id, length) {
    this.pgList.set(id, 1/length);
  }

  getList() {
    return this.pgList;
  }

  first() {
    return this.pgList.first;
  }

  async checkAnswer(answer) {
    const ids = await getRightIds(answer, topic, value);
    const lengthListPg = this.pgList.size + ids.length
    console.log(lengthListPg)

    for (const id of ids) {
      if (this.pgList.has(id)) {
        this.pgList.set(id, this.pgList.get(id) * 0.1);
      } else {
        this.add(id, lengthListPg);
      }
    }
    console.log(this.pgList)
  }
}

export default PgList;