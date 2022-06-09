const express = require('express')
const app = express()
const path = require('path')
const {read, write} = require('./lib/fs')
const jwt = require('jsonwebtoken')

app.use(express.json())


const middleware = (req, res, next) => {
    const { name, password } = req.body
    const user = read(path.resolve('./model/user.json'))
    const findUser = user.find(e => e.name == name && e.password == password)
    
    if(!findUser){
        return res.sendStatus(401).send("Go away")
    }
    
    req.body.rolUser = findUser.authId
    next()
}

app.post('/login',middleware, (req,res) => {
    const { rolUser } = req.body
    res.send(jwt.sign({id: rolUser}, "SECRET_KEY"))
})


// get
app.get('/sofa', (req, res) => {
    
    try {
       const { token } = req.headers
       const { authId } = jwt.verify(token, 'SECRET_KEY')
       res.send(read(path.resolve('./model/sofa.json')))
    } catch (error) {
        res.send('Tur yuqol uka')
    }
})

app.get('/sofa/:id', (req, res) => {
    const {id} = req.params
    res.send(read(path.resolve('./model/sofa.json')).find(e => e.id == id))
})

app.get('/*', (req, res) => {
    res.sendStatus(404)
})

// post
app.post('/newSofa', (req, res) => {
    try {
    const { token } = req.headers
    const { authId } = jwt.verify(token, 'SECRET_KEY')
    const { name, cost, made} = req.body
    const data = read(path.resolve('./model/sofa.json'))
    data.push({id:data.length + 1, name, cost, made })

    write(path.resolve('./model/sofa.json'), data)
    res.send('Write')
    } catch (error) {
        res.send("Go away")
    }
   
})

// put
app.put('/sofa', (req, res) => {
     try {
        const { token } = req.headers
        const { authId } = jwt.verify(token, 'SECRET_KEY')
    
        const {id, name, cost, made} = req.body
        const newData = read(path.resolve('./model/sofa.json'))
        const findData = newData.find(a => a.id == id )
    
        findData.name = name ? name : findData.name
        findData.cost = cost ? cost : findData.cost
        findData.made = made ? made : findData.made
        write(path.resolve('./model/sofa.json'), newData)
     } catch (error) {
         res.status(500).send('Uka tur yuqol')
     }
    res.send('Write')
})

// delete
app.delete('/sofa', (req,res) => {
    try {
       const { token } = req.headers
       const { authId } = jwt.verify(token, 'SECRET_KEY')
       const { id } = req.body
       const oldData = read(path.resolve('./model/sofa.json'))
       const findIndex = oldData.findIndex(e => e.id == id)
       if(findIndex != - 1){
        oldData.splice(findIndex, 1) 
        write(path.resolve('./model/sofa.json'), oldData)
        res.send('delete')
       }else{
           res.send('Bir aylanib kel uka')
       }
       
    } catch (error) {
        res.send('Go away')
    }
})


app.listen(9000, console.log('Worked'))