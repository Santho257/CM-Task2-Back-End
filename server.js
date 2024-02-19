const { searchProducts } = require("./searchProducts.js");
const mysql = require("mysql2");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 2507;

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });
//let categoryBody = [];

const con = mysql.createConnection({
  host: "localhost",
  user: "santho",
  password: "Santho@257",
  database: "Task2",
});
/* const putDocs = async () => {
  const { response } = await client.bulk({ body: categoryBody, refresh: true });
}; */
app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Running on ${port}...`);
});

app.get("/Category", (req, res) => {
  console.count("Category Triggered Times: ");
  con.connect((err) => {
    if (err) res.status(504).send(`${err}`);
    let query = `SELECT * FROM Category`;
    con.query(query, (err, result) => {
      if (err) {
        res.status(404).send(`${err}`);
      } else {
        res.send(result);
      }
    });
  });
});

app.get("/Product", (req, res) => {
  console.count("Product Triggered Times: ");
  con.connect((err) => {
    if (err) res.status(504).send(`${err}`);
    let query = `SELECT *,(SELECT name FROM Category WHERE id=catId) Category FROM Product`;
    con.query(query, async (err, result) => {
      if (err) {
        res.status(404).send(`${err}`);
      } else {
        /* categoryBody = result;
        categoryBody = categoryBody.flatMap((doc) => [
          { index: { _index: "product", _id: doc.id } },
          doc,
        ]);
        putDocs().catch(console.log); */
        res.send(result);
      }
    });
  });
});

app.get("/Product/search=:term", async (req, res) => {
  console.count("Search Triggered Times: ");
  const searchTerm = req.params.term;
  let result = await searchProducts(searchTerm, client);
  // console.log(result);
   
  res.send(result);
});
/* app.get('/:tableName/page=:id',(req,res)=>{
    con.connect((err)=>{
        if(err) res.status(504).send(`${err}`);
        let query = `SELECT * FROM ${req.params.tableName}  LIMIT ${(req.params.id - 1) *10}, 10`;
        con.query(query, function (err, result) {
            if (err){
                res.status(404).send(`${err}`);
            }
            else{
                res.send(result);
            }  
          });
    });
}); */

/* app.get('/Product/catId=:cId/page=:pNo',(req,res)=>{
    con.connect((err)=>{2
        if(err) res.status(504).send(`${err}`);
        let query = `SELECT * FROM Product WHERE catId=${req.params.cId} LIMIT ${(req.params.pNo - 1) *10}, 10`;
        con.query(query, function (err, result) {
            if (err){
                res.status(404).send(`${err}`);
            }
            else{
                res.send(result);
            }
          });
    });
}); */

app.all("*", (req, res) => {
  res.status(404).send(`${req.path} does not exists`);
});
