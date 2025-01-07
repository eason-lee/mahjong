<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用棋牌室管理系统</span>
        </div>
      </template>
      <div class="card-content">
        <p>您可以通过左侧菜单访问各个功能模块：</p>
        <ul>
          <li>房间管理：管理棋牌室的所有房间</li>
          <li>订单管理：查看和处理预订订单</li>
          <li>数据统计：查看营业数据和统计报表</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.welcome-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  line-height: 1.8;
}

.card-content ul {
  margin-top: 16px;
  padding-left: 20px;
}

.card-content li {
  margin-bottom: 8px;
}
</style> 