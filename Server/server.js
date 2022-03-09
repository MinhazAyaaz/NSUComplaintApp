const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql')

//Database connection credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nsucomplaints'
})
db.connect()

app.use(express.json());

app.get("/api", (req,res)=>{
  res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(5000, ()=>{console.log("Server started on port 5000")})

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { 
      name: req.body.name,
      nsuid: req.body.nsuid,
      email: req.body.email,
      password: hashedPassword,
     }
    users.push(user)
    let name= req.body.name
    let nsuid= req.body.nsuid
    let email= req.body.email
    let password= hashedPassword
    let sql = 'INSERT INTO user(nsuid, name, email, password) VALUES ('
    sql = sql + mysql.escape(nsuid) +', '+ mysql.escape(name) +', '+ mysql.escape(email) +', '+ mysql.escape(password) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})
