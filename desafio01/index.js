const express = require('express')

const server = express()

let contagem = 0

server.use(express.json())

const projects = []

function checkExistingProject(req, res, next){
    const { id } = req.params
    
    const project = projects.find((search) => {
        return search.id == id
    })

    if(!project){
        return res.status(400).json({ error: 'This project does not exist !' })
    }

    return next()
}

server.use((req, res, next) => {
    
    contagem++
    
    console.log(`${contagem} - Metodo: ${req.method}; URL: ${req.url}`)

    return next()

})
    

server.post('/projects', (req, res) => {
    const project = {id: req.body.id, 
        title: req.body.title, 
        task: []}

    projects.push(project)

    return res.json(projects)

})

server.get('/projects', (req, res) => {
    return res.json(projects)    
})

server.put('/projects/:id', checkExistingProject, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const project = projects.find((search) => {
        return search.id == id
    })

    project.title = title

    return res.json(projects)
})

server.delete('/projects/:id', checkExistingProject, (req, res) => {
    const { id } = req.params

    const projectDelete = projects.find((search) => {
        return search.id == id
    })

    projects.splice(projectDelete, 1)

    return res.json(projects)
})

server.post('/projects/:id/tasks', checkExistingProject, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const project = projects.find((search) => {
        return search.id == id
    })

    project.task.push(title)

    return res.json(projects)

})
server.listen(3000)
