import { supabase } from './supabase'

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
export async function uploadImage(file: File | any, bucket: string = 'rooms'): Promise<string> {
  try {
  
    // 如果传入的是 el-upload 的文件对象，获取实际的 File 对象
    const actualFile = file.raw || file
    
    // 检查文件是否有效
    if (!(actualFile instanceof File)) {
      throw new Error('无效的文件对象')
    }

    // 检查文件大小（5MB）
    if (actualFile.size > 5 * 1024 * 1024) {
      throw new Error('图片大小不能超过 5MB')
    }

    // 生成文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = actualFile.name.split('.').pop()
    const fileName = `${timestamp}-${random}.${extension}`
    
    console.log('准备上传文件:', {
      fileName,
      fileSize: actualFile.size,
      fileType: actualFile.type
    })

    // 上传文件
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`images/${fileName}`, actualFile, {
       cacheControl: '3600',
        contentType: actualFile.type // 显式设置 content-type
      })

    if (error) {
      console.error('Supabase 上传错误:', error)
      throw error
    }

    // 获取公共 URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(`images/${fileName}`)

    return publicUrl
  } catch (error: any) {
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