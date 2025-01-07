import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

/**
 * 生成唯一的文件名
 */
function generateUniqueFileName(file: File): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}

/**
 * 上传单个图片
 */
export async function uploadImage(file: File, bucket: string = 'rooms'): Promise<string> {
  try {
    const fileName = generateUniqueFileName(file)
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // 获取公共 URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('上传图片失败:', error)
    throw new Error(error.message || '上传图片失败')
  }
}

/**
 * 批量上传图片
 */
export async function uploadImages(files: File[], bucket: string = 'rooms'): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, bucket))
    return await Promise.all(uploadPromises)
  } catch (error: any) {
    console.error('批量上传图片失败:', error)
    throw new Error(error.message || '批量上传图片失败')
  }
}

/**
 * 从 URL 中提取文件路径
 */
function getPathFromUrl(url: string): string {
  const { pathname } = new URL(url)
  return pathname.split('/').pop() || ''
}

/**
 * 删除图片
 */
export async function deleteImage(url: string, bucket: string = 'rooms'): Promise<void> {
  try {
    const path = getPathFromUrl(url)
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('删除图片失败:', error)
    throw new Error(error.message || '删除图片失败')
  }
} 