const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const app = express()
const uri = process.env.DB_PATH
console.log(uri);
let client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors())
app.use(bodyParser.json());

// all get request
app.get('/appointment', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) {
            console.log('connection err', err)
        } else {
            const collection = client.db("doctorsPortal").collection("appointmentData");
            console.log('database connected successfully');
            // perform actions on the collection object
            collection.find().toArray((error, document) => {
                if (error) {
                    console.log('Appointment data find error', error);
                } else {
                    console.log('Appointment data find successful');
                    res.send(document)
                }
            })
            client.close();
        }
    });
})


//all post request
// app.post('/addAppointmentData', (req, res) => {
//     const appointmentData = req.body
//     client = new MongoClient(uri, { useNewUrlParser: true });
//     client.connect(err => {
//         if (err) {
//             console.log('connection err', err)
//         } else {
//             const collection = client.db("doctorsPortal").collection("appointmentData");
//             // perform actions on the collection object
//             collection.insert(appointmentData, (error, result) => {
//                 if (error) {
//                     console.log('Appointment data add error', error);
//                 } else {
//                     console.log('Appointment data added successful', result);
//                     res.send('data added')
//                 }
//             })
//             client.close();
//         }
//     });
// })


app.post('/bookAppointment', (req, res) => {//add book Appointment data
    const bookAppointmentData = req.body
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) {
            console.log('connection err-->', err)
        } else {
            const collection = client.db("doctorsPortal").collection("bookAppointmentData");
            // perform actions on the collection object
            collection.insert(bookAppointmentData, (error, result) => {
                if (error) {
                    console.log('Appointment data add error', error);
                } else {
                    console.log('Appointment data added successful');
                    res.send(result.ops[0])
                }
            })
            client.close();
        }
    });
})

const port = 4200
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
)