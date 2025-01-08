<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Room, RoomPackage } from '../types/room'
import { RoomStatus } from '../types/room'
import { getRoomDetail, getRoomPackages } from '../api/room'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const room = ref<Room>()
const packages = ref<RoomPackage[]>([])

// 获取房间详情
const fetchRoomDetail = async () => {
  try {
    loading.value = true
    const id = Number(route.params.id)
    const roomResponse = await getRoomDetail(id)
    if (roomResponse.data && roomResponse.data.length > 0) {
      room.value = roomResponse.data[0]
      const packagesResponse = await getRoomPackages(id)
      if (packagesResponse.data && packagesResponse.data.length > 0) {
        packages.value = packagesResponse.data[0].packages || []
      }
    } else {
      ElMessage.error('房间不存在')
      router.back()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取房间详情失败')
  } finally {
    loading.value = false
  }
}

// 获取状态文本
const getStatusText = (status: RoomStatus) => {
  const map = {
    [RoomStatus.Available]: '可用',
    [RoomStatus.Occupied]: '已占用',
    [RoomStatus.Maintenance]: '维护中',
    [RoomStatus.Disabled]: '已禁用'
  }
  return map[status]
}

// 获取状态标签类型
const getStatusType = (status: RoomStatus) => {
  const map = {
    [RoomStatus.Available]: 'success',
    [RoomStatus.Occupied]: 'warning',
    [RoomStatus.Maintenance]: 'info',
    [RoomStatus.Disabled]: 'danger'
  }
  return map[status]
}

onMounted(() => {
  fetchRoomDetail()
})
</script>

<template>
  <div class="room-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>房间详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <template v-if="room">
        <div class="detail-content">
          <!-- 基本信息 -->
          <div class="section">
            <h3>基本信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="房间名称">
                {{ room.name }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusType(room.status)">
                  {{ getStatusText(room.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="面积">
                {{ room.area || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="价格">
                ¥{{ room.price }}
              </el-descriptions-item>
              <el-descriptions-item label="标签" :span="2">
                <el-tag
                  v-for="tag in room.tags"
                  :key="tag"
                  class="mr-1"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">
                {{ room.description || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 房间图片 -->
          <div class="section">
            <h3>房间图片</h3>
            <div class="image-list">
              <el-image
                v-for="(image, index) in room.images"
                :key="index"
                :src="image"
                :preview-src-list="room.images"
                :initial-index="index"
                fit="cover"
                class="room-image"
              />
            </div>
          </div>

          <!-- 套餐信息 -->
          <div class="section">
            <h3>套餐信息</h3>
            <el-table :data="packages" style="width: 100%">
              <el-table-column prop="name" label="套餐名称" />
              <el-table-column prop="hours" label="时长">
                <template #default="{ row }">
                  {{ row.hours }}小时
                </template>
              </el-table-column>
              <el-table-column prop="price" label="价格">
                <template #default="{ row }">
                  ¥{{ row.price }}
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip />
            </el-table>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.room-detail {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section {
    margin-bottom: 24px;

    h3 {
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .room-image {
    width: 200px;
    height: 150px;
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 4px;
    cursor: pointer;
  }

  .mr-1 {
    margin-right: 4px;
  }
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 