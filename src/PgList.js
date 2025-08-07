import { getRightIds } from "./supabase_client";
import { topic, value } from "./Game";

class PgList {
  constructor() {
    this.pgList = new Map();
  }

  add(id) {
    this.pgList.set(id, 1);
  }

  getList() {
    return this.pgList;
  }

  first() {
    return this.pgList.first;
  }

  async checkAnswer(answer) {
    const ids = await getRightIds(answer, topic, value);

    for (const id of ids) {
      if (this.pgList.has(id)) {
        this.pgList.set(id, this.pgList.get(id) + 1);
      } else {
        this.add(id);
      }
    }
    console.log(this.pgList)
  }

  size() {
    return this.pgList.size;
  }
}

export default PgList;