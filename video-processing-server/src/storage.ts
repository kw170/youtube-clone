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
  ensureDirectoryExistence(localRawVideoPath)
  ensureDirectoryExistence(localRawVideoPath)
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

/**
 * Downloads raw video from gs and downloads to local folder
 *
 * @param fileName - The name of the file to download from the {@link rawVideoBucketName}
 * bucket into the link {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string){
  await storage.bucket(rawVideoBucketName)
  .file(fileName)
  .download({destination : `${localRawVideoPath}/${fileName}`}
  )

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/ ${fileName}.`
  )
}

/**
 * Uploads processed video to gs
 *
 * @param fileName - The name of the file to upload from the {@link localProcessedVideoPath}
 * folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName)

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName
  })
  console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`)

  await bucket.file(fileName).makePublic()
}


/**
 * Deletes raw file from local
 *
 * @param fileName - The name of the file to delete
 * from the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`)
}


/**
 * Deletes processed file from local
 *
 * @param fileName - The name of the file to delete
 * from the {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted
 */

export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`)
}


/**
 * @param filePath - The path of the file to delete
 * @returns A promise that resolves when the file has been deleted
 */

function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) =>{
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) =>{
        if (err) {
          console.log(`Failed to delete file at ${filePath}`, err)
          reject(err)
        }
        else {
          console.log(`File deleted at ${filePath}.`)
          resolve()
        }
      })
    }
    else {
      console.log(`File not found at ${filePath}, skipping the delete.`)
      resolve()
    }
  })
}


/**
 * Ensures a directory exists, creates it if needed
 *
 * @param {string} dirPath - The directory path to check
 */

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true}) //recursion allows for nested directories
    console.log(`Directory created at ${dirPath}`)
  }
}
