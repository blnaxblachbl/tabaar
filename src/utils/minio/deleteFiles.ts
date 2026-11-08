import { minioClient, bucketName } from '#utils/minio'

export async function deleteFiles(objectNames: string[]) {
  try {
    return await minioClient.removeObjects(bucketName, objectNames)
  } catch (e) {
    console.error('Minio remove error', e)
    throw new Error('Delete Error')
  }
}
