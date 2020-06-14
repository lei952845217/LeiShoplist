var express = require('express');
var fs = require('fs');
var router = express.Router();

function Note(pType, pName, pQty,pPrice) {
  this.type= pType;
  this.name = pName;
  this.qty = pQty;
this.price = pPrice;
}

var ServerNotes = [];

// ServerNotes.push(new Note("Food", "Pizza", 1,9));
// ServerNotes.push(new Note("Clothes", "Coat", 1,50));
// ServerNotes.push(new Note("Meat", "Chicken", 2,5));

fs.readFile('./node.txt',function(err,data){
    if(err) throw err;
    ServerNotes = JSON.parse(data)
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html')
});

/* GET all Notes data */
router.get('/getAllNotes', function(req, res) {
  fs.readFile('./node.txt',function(err,data){
      if(err) throw err;
      ServerNotes = JSON.parse(data)
  });
  res.status(200).json(ServerNotes);
});


router.post('/AddNote', function(req, res,next) {
  const newNote = req.body;
  ServerNotes.push(newNote);
  fs.writeFile('./node.txt',JSON.stringify(ServerNotes),'utf8',function(err) {
      if(err) throw err;
      console.log('Saved');
  });
  res.status(200);
})

router.delete('/DeleteNote/:name', (req, res, next) => {
  const name = req.params.name;
  let found = false;

  for(var i = 0; i < ServerNotes.length; i++) // find the match
  {
      if(ServerNotes[i].name === name){
        ServerNotes.splice(i,1);  // remove object from array
          found = true;
          break;
      }
  }
  fs.writeFile('./node.txt',JSON.stringify(ServerNotes),'utf8',function(err) {
      if(err) throw err;
      console.log('Saved');
  });
  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
  res.send('Note ' + name + ' deleted!');
  }
});

router.post('/Change', function(req, res,next) {
    ServerNotes = [];
    ServerNotes = req.body;
    const newNote = req.body;
    fs.writeFile('./node.txt',JSON.stringify(ServerNotes),'utf8',function(err) {
        if(err) throw err;
        console.log('Saved');
    });
    res.status(200).json(ServerNotes);
})



module.exports = router;
