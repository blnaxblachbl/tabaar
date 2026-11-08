import sharp from 'sharp'
import type { TagList } from 'minio'

import { minioClient, bucketName } from '#utils/minio'

export async function setTags(objectName: string, tags: TagList) {
  await minioClient.setObjectTagging(bucketName, objectName, tags)
}

export async function uploadImage(fileBuffer: Buffer, objectName: string) {
  try {
    // const fileBuffer = Buffer.from(await file.arrayBuffer())
    const buffer = await sharp(fileBuffer).webp({ quality: 60 }).toBuffer()
    await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
      'Content-Type': 'image/webp',
    })
    return true
  } catch (e) {
    console.error('Minio upload error', e)
    throw new Error('Upload error')
  }
}

// export async function uploadFile(file: File, objectName: string) {
//   try {
//     const fileBuffer = Buffer.from(await file.arrayBuffer())
//     await minioClient.putObject(
//       bucketName,
//       objectName,
//       fileBuffer,
//       fileBuffer.length,
//       {
//         'Content-Type': file.type,
//       },
//     )
//     return true
//   } catch (e) {
//     console.error('Minio upload error', e)
//     throw new Error('Upload error')
//   }
// }
