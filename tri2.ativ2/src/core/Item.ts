import { Database, type Changes } from 'bun:sqlite';

const db = new Database('app.db', { strict: true })

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`)
    
    export type ItemProps = {
        id?: number
        title: string
    }
    
    class Item {
        protected id: number | null
        protected changed: boolean = false
        protected props: ItemProps
        
        constructor(props: Partial<ItemProps>) {
            this.id = null
            this.props = Object.assign({ title: '' }, props)
        }

        protected static query = {
            selectAll: db.query('SELECT * FROM items'),
            selectOne: db.query('SELECT * FROM items WHERE id = $id'), 
            insert: db.query('INSERT INTO items (title) VALUES ($title)'),
            update: db.query("UPDATE items SET title=$title WHERE id=$id"),
            delete: db.query("DELETE FROM items WHERE id = $id")
        }

        private setId(id: number) {
          this.id = id;
        }

        set title(title: string) {
            this.props.title = title;
            this.changed = true;
        }

        get title() {
            return this.props.title;
        }
        
        public static all = () => {
            return this.query.selectAll.all() as ItemProps[]
        }
        
        public static get(id: number): ItemProps | null {
            return this.query.selectOne.get({ id }) as ItemProps | null
        }
        
        public static insert(props: ItemProps){
            const changes = this.query.insert.run({ title: props.title }) as Changes
            const item = new Item(props)
            item['setId'](changes.lastInsertRowid as number)
            return item
        }

        public static delete(id: number) {
          return this.query.delete.run({ id })
        }
        
        store() {
          if (!this.changed) return;
          Item.query.update.run({ title: this.props.title, id: this.id }) 
          this.changed = false
        }

        update() {
          this.store();
        }

        delete() {
          Item.delete(this.id!)
        }
        
        toJSON() {
            return {
                id: this.id,
                title: this.props.title
            }
        }
    }
