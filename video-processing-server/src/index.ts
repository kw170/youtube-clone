import express from "express"
import ffmpeg from "fluent-ffmpeg"
import { setupDirectories } from "./storage"

setupDirectories()

const app = express()
app.use(express.json())

app.post("/process-video", (req, res) =>{
  //Get the bucket and filename from the cloub pub/sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8')
    data = JSON.parse(message)
    if (!data.name) {
      throw new Error('Invalid messgae payload received.')
    }
  }
  catch (error) {
    console.log(error)
    return res.status(400).send('Bad Request: missing filename')
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`)
})


