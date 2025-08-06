import { getRightIds } from "./supabase_client";

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

  checkAnswer(answer, topic, value) {
    const correctIds = getRightIds(answer, topic, value);

    for (const id of correctIds) {
      if (this.pgList.has(id)) {
        this.pgList.set(id, this.pgList.get(id) + 1);
      } else {
        this.pgList.add(id);
      }
    }
  }

  length() {
    return this.pgList.length;
  }
}

export default PgList;
