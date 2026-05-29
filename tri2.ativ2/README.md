# tri2.ativ1

## Funcionamento
Esse projeto feito em TypeScript/Bun usa a biblioteca `sqlite` do Bun para armazenar uma lista de afazeres.

## Rodando
1. Instale as dependências com o comando `bun i`.
2. Implemente o projeto em seu código TypeScript (exemplos abaixo).

## Exemplos
### Criar item
```typescript
const item = Item.insert({ title: "Exemplo" })
console.log(item.id)
```

### Listar item
```typescript
const items = Item.all()
items.forEach(i => () {
    console.log(i.title);
})
```

### Atualizar
```typescript
item.title = "Título atualizado :)"
item.update()
```

### Deletar
```typescript
item.delete()
```