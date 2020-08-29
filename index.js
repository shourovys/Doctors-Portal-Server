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
app.get('/appointment', (req, res) => { //give all appointment sedule fo doctor
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

app.get('/getAppointments/:appointmentBookingData', (req, res) => { //give all appointment for doctor
    const appointmentBookingData = req.param
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) {
            console.log('connection err', err)
        } else {
            const collection = client.db("doctorsPortal").collection("bookAppointmentData");
            console.log('database connected successfully');
            // perform actions on the collection object
            collection.find({ appointmentBookingData }).toArray((error, document) => {
                if (error) {
                    console.log('Booking Appointment data find error', error);
                } else {
                    console.log('Booking Appointment data find successful');
                    res.send(document)
                }
            })
            client.close();
        }
    });
})


// all post request
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

app.post('/updateAppointment', (req, res) => {//update appointment data by doctor // { action: 'Panning', bookingId: '5f476ca279be9f5f5423c457' }
    const bookingId = req.body.bookingId
    const query = { "_id": bookingId }
    console.log(query)
    const update = {
        "$set": {
            "action": req.body.action
        }
    };
    const options = { returnNewDocument: true };

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) {
            console.log('connection err-->', err)
        } else {
            const collection = client.db("doctorsPortal").collection("bookAppointmentData");
            // perform actions on the collection object
            collection.findOneAndUpdate(query, update, options)
                .then(updatedDocument => {
                    if (updatedDocument) {
                        console.log(`Successfully updated document: ${updatedDocument}.`)
                        // res.send('successfully change')
                    } else {
                        console.log("No document matches the provided query.")
                    }
                    return updatedDocument
                })
                .catch(err => console.error(`Failed to find and update document: ${err}`))
            client.close();
        }
    });
})

const port = 4200 || process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
)