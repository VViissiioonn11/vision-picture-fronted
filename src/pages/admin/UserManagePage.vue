<template>
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="showAddUserModal">添加用户</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" @click="doUpdate(record)">编辑</a-button>
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="doDelete(record.id)"
            >
              <a-button danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 添加用户模态框 -->
    <a-modal
      v-model:visible="addUserModalVisible"
      title="添加用户"
      width="800px"
      :footer="null"
      @cancel="handleAddUserCancel"
    >
      <AddUser @success="handleAddUserSuccess" />
    </a-modal>

    <!-- 编辑用户模态框 -->
    <a-modal
      v-model:visible="updateUserModalVisible"
      title="编辑用户"
      width="800px"
      :footer="null"
      @cancel="handleUpdateUserCancel"
    >
      <UserUpdatePage
        :initial-values="currentEditUser"
        @success="handleUpdateUserSuccess"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  deleteUserUsingPost,
  getUserByIdUsingGet,
  listUserVoByPageUsingPost
} from '@/api/userController.ts'
import dayjs from 'dayjs'
import AddUser from './UserAddPage.vue'
import UserUpdatePage from './UserUpdatePage.vue'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 加载状态
const loading = ref(false)

// 添加用户模态框状态
const addUserModalVisible = ref(false)
const showAddUserModal = () => {
  addUserModalVisible.value = true
}
const handleAddUserCancel = () => {
  addUserModalVisible.value = false
}
const handleAddUserSuccess = () => {
  addUserModalVisible.value = false
  fetchData()
}

// 编辑用户模态框状态
const updateUserModalVisible = ref(false)
const currentEditUser = ref<API.UserVO | null>(null)
const doUpdate = async (record: API.UserVO) => {
  try {
    loading.value = true
    const res = await getUserByIdUsingGet({ id: record.id })
    if (res.data.data) {
      currentEditUser.value = res.data.data
      updateUserModalVisible.value = true
    } else {
      message.error('获取用户信息失败')
    }
  } catch (e) {
    message.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}
const handleUpdateUserCancel = () => {
  updateUserModalVisible.value = false
  currentEditUser.value = null
}
const handleUpdateUserSuccess = () => {
  updateUserModalVisible.value = false
  currentEditUser.value = null
  fetchData()
}

// 删除用户
const doDelete = async (id: number) => {
  try {
    loading.value = true
    const res = await deleteUserUsingPost({ id })
    if (res.data.code === 0) {
      message.success('删除成功')
      await fetchData()
    } else {
      message.error(res.data.message || '删除失败')
    }
  } catch (e) {
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

// 数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const res = await listUserVoByPageUsingPost({
      ...searchParams,
    })
    if (res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (e) {
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
#userManagePage {
  padding: 20px;
}
</style>
