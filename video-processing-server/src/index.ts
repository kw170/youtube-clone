import express from "express"
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage"

setupDirectories()

const app = express()
app.use(express.json())

app.post("/process-video", async (req, res) =>{
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
  const inputFilename = data.name
  const outputFileName = `processed-${inputFilename}`

  // Download raw video from storage
  await downloadRawVideo(inputFilename)

  // Convert the video to 360p (Process)
  try{
    await convertVideo(inputFilename, outputFileName)
  }
  catch (err) {
    // Runs async in parallel
    await Promise.all([
      deleteRawVideo(inputFilename),
      deleteProcessedVideo(outputFileName)
    ])

    console.log(err)
    return res.status(500).send(`Internal Server Error: video processing failed.`)
  }
  // Upload the processed video to gs
  await uploadProcessedVideo(outputFileName)

  await Promise.all([
    deleteRawVideo(inputFilename),
    deleteProcessedVideo(outputFileName)
  ])

  return res.status(200).send('Process finished successfully.')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`)
})


