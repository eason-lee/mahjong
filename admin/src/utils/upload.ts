import { supabase } from './supabase'

export async function uploadImage(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('room-images')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error('图片上传失败')
  }

  const { data } = supabase.storage
    .from('room-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteImage(url: string) {
  const path = url.split('/').pop()
  if (!path) return

  const { error } = await supabase.storage
    .from('room-images')
    .remove([path])

  if (error) {
    throw new Error('图片删除失败')
  }
}

export async function uploadImages(files: File[], path: string): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, path))
  return Promise.all(uploadPromises)
} 