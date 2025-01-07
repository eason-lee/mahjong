<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, View } from '@element-plus/icons-vue'
import { RoomStatus } from '../types/room'
import type { Room } from '../types/room'
import { getRooms, deleteRoom, updateRoomStatus } from '../api/room'

const router = useRouter()
const rooms = ref<Room[]>([])
const loading = ref(false)

// 获取房间列表
const fetchRooms = async () => {
  try {
    loading.value = true
    rooms.value = await getRooms()
  } catch (error: any) {
    ElMessage.error(error.message || '获取房间列表失败')
  } finally {
    loading.value = false
  }
}

// 删除房间
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该房间吗？', '提示', {
      type: 'warning'
    })
    
    await deleteRoom(id)
    ElMessage.success('删除成功')
    fetchRooms()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 更新房间状态
const handleStatusChange = async (id: number, status: RoomStatus) => {
  try {
    await updateRoomStatus(id, status)
    ElMessage.success('更新状态成功')
    fetchRooms()
  } catch (error: any) {
    ElMessage.error(error.message || '更新状态失败')
  }
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

// 跳转到创建页面
const handleCreate = () => {
  router.push('/rooms/create')
}

onMounted(() => {
  fetchRooms()
})
</script>

<template>
  <div class="rooms">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>房间管理</span>
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleCreate"
          >
            添加房间
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="rooms"
        style="width: 100%"
      >
        <el-table-column prop="name" label="房间名称" min-width="120" />
        
        <el-table-column prop="area" label="面积" width="100">
          <template #default="{ row }">
            {{ row.area || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        
        <el-table-column prop="tags" label="标签" min-width="120">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              class="mr-1"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                :icon="View"
                link
              >
                查看
              </el-button>
              <el-button
                type="primary"
                :icon="Edit"
                link
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                :icon="Delete"
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.rooms {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-table) {
  margin-top: 10px;
}

.mr-1 {
  margin-right: 4px;
}
</style> 