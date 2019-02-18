const express = require ('express');

const server = express();

// middleware
server.use(express.json());

const db = require ('./data/db.js');

server.get('/',(req, res) => {
    res.send('Hello World')
})

server.get("/now", (req, res) => {
    var dt = new Date();
    var utcDate = dt.toUTCString();
    res.send(utcDate);
  });

// RETRIEVE - R IN CRUD
server.get('/hubs', (req, res) =>{
    const hubs = db.hubs
    .find()
    .then(hubs => {
        res.status(200).json(hubs);
    })
    .catch(({ code, message }) => {
        res.status(code).json({
            success: false,
            message,
        })
    })
})

server.post('/hubs', (req,res) => {
    const hubInfo = req.body

    db.hubs
    .add(hubInfo)
    .then(hub => {
        res.status(201).json({ success: true, hub});
    })
    .catch(({ code, message }) => {
        res.status(code).json({
            success: false,
            message,
        })
    })

})

server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id

    db.hubs
    .remove(id)
    .then( () => {
        res.status(204).end()
        
    })
    .catch(({ code, message }) => {
        res.status(code).json({
            success: false,
            message,
        })
    })
})

//U in CRUD
server.put('/hubs/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.hubs 
        .update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json({success: true, updated})
            } else {
                res.status(404).json({
                    success: false,
                    message: 'I cannot find that id'
                })
            }
        })
        .catch(({ code, message }) => {
            res.status(code).json({
            success: false,
            message,
            });
    });
})


// get specific id
server.get("/hubs/:id", (req, res) => {
    const { id } = req.params;
  
    db.hubs
      .findById(id)
      .then(hubs => {
        if (hubs) {
          res.status(200).json({ success: true, hubs });
        } else {
          res.status(404).json({
            success: false,
            message: "unable to find requested id"
          });
        }
      })
      .catch(({ code, message }) => {
        res.status(code).json({
          success: false,
          message
        });
      });
  });

server.listen(4000, () => {
    console.log('\n*** Server Running on heep:localhost:OVER9000!')
})