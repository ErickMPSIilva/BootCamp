const express = require('express')

const server = express()

server.use(express.json())

const users = ['Erick', 'Lucas', 'Matheus', 'Nicolas']

server.use((req, res, next) => {
    
    console.time('Request')

    console.log(`O método chamado é o ${req.method}; URL: ${req.url}`)

    next()

    console.timeEnd('Request')
})

function checkUserExists(req, res, next){
    if (!req.body.name){
        return res.status(400).json({ error: 'Please insert a name'})
    }
    return next()
}

function checkUserInArray(req, res, next){
    if (!users[req.params.index]){
        return res.status(400).json({ error: "This name does not exist!"})
    }

    return next()
}
/*server.get('/teste', (req, res) =>{
    const nome = req.query.nome

    return res.json({message: `Hello ${nome}`})
})

server.get('/users/:id', (req, res) =>{
    const id = req.params.id

    return res.json({message: `Hello ${id}`})
})
*/

server.get('/users', (req, res) => {
    return res.json(users)
})

server.get('/users/:index',checkUserInArray, (req, res) =>{
    const { index } = req.params
    
    return res.json(users[index])
})

server.post('/users',checkUserExists, (req, res) => {
    const { name } = req.body

    users.push(name)

    return res.json(users)

})

server.put('/users/:index',checkUserExists, checkUserInArray, (req, res) => {
    const { index } = req.params
    const { name } = req.body

    users[index] = name;

    return res.json(users)
})

server.delete('/users/:index',checkUserInArray,  (req, res) => {
    const { index } = req.params

    users.splice(index, 1)

    return res.json(users)  

})
server.listen(3000)