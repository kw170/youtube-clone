import express from "express"
import ffmpeg from "fluent-ffmpeg"

const app = express()
app.use(express.json())

app.post("/process-video", (req, res) =>{
  //Get path of the input video
  const inputFilePath = req.body.inputFilePath
  const outputFilePath = req.body.outputFilePath

  //Check if there were no parameters recieved
  if(!inputFilePath){
    res.status(400).send("Bad Request: Missing input file path.")
  }
  if (!outputFilePath) {
    res.status(400).send("Bad Request: Missing output file path.")
  }

  //Convert video
  //maybe change 360 to 480 or 720 later
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") //360p  resolution
    .on("end", () => {
      res.status(200).send("Processing finished successfully")
    })
    .on("error", (err) => {
      console.log(`An error has occurred: ${err.message}`)
      res.status(500).send(`Internal Server Error ${err.message}`)
    })
    .save(outputFilePath)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`)
})


