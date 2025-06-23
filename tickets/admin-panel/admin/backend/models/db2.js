const mysql = require('mysql2/promise'); // Use the promise-based version
const bcrypt = require('bcrypt')
const { hash } = require('crypto')



//Database Connection
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'__Piyush_91_',
    database:'Dummy'
})

db.getConnection(err=>{
    if(err){
        console.error('Database connection failed:',err)
        return
    }
    console.log('Connected to MySQl')

})

module.exports=db


