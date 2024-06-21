// 1. Google Cloud Storage File Interactions
// 2. Local file interactions

import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

const storage = new Storage()

const rawVideoBucketName = "kw-yt-raw-videos"
const processedVideoBucketName = "kw-yt-processed-videos"

const localRawVideoPath = "./raw-videos"
const localProcessedVideoPath = "./processed-videos"


// Creates the local directories forr raw and processed videos
export function setupDirectories() {

}


/**
 * Converts raw video to processed video locally
 *
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 * */
export function convertVideo(rawVideoName: string, processedVideoName: string){
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
    .outputOptions("-vf", "scale=-1:360") //360p  resolution
    .on("end", () => {
      console.log("Processing finished successfully")
      resolve()
    })
    .on("error", (err) => {
      console.log(`An error has occurred: ${err.message}`)
      reject(err)
    })
    .save(`${localProcessedVideoPath}/${processedVideoName}`)
  })
}
