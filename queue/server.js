var express = require('express')
var queue = require('express-queue');
var cors = require('cors')
const Queue = require('bull');
var app = express()

port = process.env.PORT || 3000
//app.use(queue({ activeLimit: 1, queuedLimit: 1 }));

app.use((req, res,next) => {
    const imageProcessingQueue = new Queue('teste1'); // Create a queue object.
    req.queue = imageProcessingQueue; // add this queue to req object so its accessible in the request handler.

    next(); // important!
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const wait5Seconds =async()=>{
    await sleep(5000);
}

app.get('/', async (req, res) => {
    req.queue.process(1,async (job,done)=>{
        await wait5Seconds()
        console.log(new Date())
        done()

    })
    req.queue.add({})
    return res.json({
        message: 'successfully queued',
    });


})


app.listen(port);
console.log('Message RESTful API server started on: ' + port);