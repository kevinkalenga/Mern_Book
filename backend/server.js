import express from 'express'

const port = 8080;
const app = express();

app.get("/", (req, res) => res.send("Api is running"))

app.listen(port, () => console.log(`Server is running on port ${port}!!!`))