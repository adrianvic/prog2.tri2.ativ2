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
            update: db.prepare("UPDATE items SET title=? WHERE title=?")
        }

        set title(title: string) {
            this.props.title = title;
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
            return this.get(changes.lastInsertRowid as number)
        }
        
        store() {
            if (!this.changed) 
                return
        }
        
        toJSON() {
            return {
                id: this.id,
                title: this.props.title
            }
        }
    }