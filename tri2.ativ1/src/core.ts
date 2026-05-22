import { Database } from "bun:sqlite";

// class Item_ {
//   public title: string
//   constructor(title: string) {
//     this.title = title
//   }
// }

const db = new Database("database.sqlite");

db.run(`
  DROP TABLE IF EXISTS items;
  `)

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL
  )
`);

const querySelectItems = db.prepare("SELECT * FROM items");
const queryInsertItem = db.prepare("INSERT INTO items (title) VALUES (?)");
const queryDeleteItem = db.prepare("DELETE FROM items WHERE title=?");
const queryUpdateItem = db.prepare("UPDATE items SET title=? WHERE title=?");

class Item {
  constructor(public title: string) { }
}


class TodoList {
  private items: Item[] = []

  constructor() {
    this.loadFromDatabase();
  }

  private loadFromDatabase() {
    const rows = querySelectItems.all();
    this.items = rows.map((row: any) => new Item(row.title));
  }

  addItem(item: Item) {
    queryInsertItem.run(item.title);
    this.items.push(item);
  }

  updateItem(index: number, title: string) {
    if (index < 0 || index >= this.items.length) {
      throw new Error(`Índice inválido: ${index}`);
    }
    const item = this.items[index]!;
    item.title = title;
    queryUpdateItem.run(title, item.title);
  }

  removeItem(index: number) {
    if (index < 0 || index >= this.items.length) {
      throw new Error(`Índice inválido: ${index}`);
    }
    const item = this.items[index]!;
    this.items.splice(index, 1);
    queryDeleteItem.run(item.title);
  }

  swapItems(index1: number, index2: number) {
    if (index1 < 0 || index1 >= this.items.length || 
        index2 < 0 || index2 >= this.items.length) {
      throw new Error(`Índices inválidos: ${index1}, ${index2}`);
    }
    const item1 = this.items[index1]!;
    const item2 = this.items[index2]!;
    [this.items[index1], this.items[index2]] = [item2, item1];
    queryUpdateItem.run(item1.title, item2.title);
    queryUpdateItem.run(item2.title, item1.title);
  }

  getItems() {
    return this.items;
  }
}

function logAll(items: Item[]) {
  let index = 0;
  items.forEach(item => {
    console.log(`[${index}] ${item.title}`);
    index++;
  });
  console.log('Fim da lista.');
}

//
// exemplo [ [ [ NÃO COPIEM ] ] ] 
//

const lista = new TodoList();
lista.addItem(new Item("ficar quieto"));
lista.addItem(new Item("prestar atenção"));
lista.addItem(new Item("aprender typescript"));
logAll(lista.getItems());
lista.removeItem(1);
logAll(lista.getItems());
lista.updateItem(0, "atualizado");
logAll(lista.getItems());

// Atividades
// 1. permitir trocar ordem dos itens // feito