<template>
  <div id="userUpdatePage">
    <h2 class="title">vision云图库 - 编辑用户</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      @finish="onFinish"
    >
      <!-- ID字段（只读） -->
      <a-form-item label="用户ID" v-if="formState.id">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>

      <!-- 用户名 -->
      <a-form-item
        label="用户名"
        name="userName"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input
          v-model:value="formState.userName"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>

      <!-- 用户头像 -->
      <a-form-item
        label="用户头像URL"
        name="userAvatar"
        :rules="[{ type: 'url', message: '请输入有效的URL地址' }]"
      >
        <a-input
          v-model:value="formState.userAvatar"
          placeholder="请输入头像URL地址"
          allow-clear
        />
      </a-form-item>

      <!-- 用户简介 -->
      <a-form-item label="用户简介" name="userProfile">
        <a-textarea
          v-model:value="formState.userProfile"
          placeholder="请输入用户简介"
          :rows="4"
          show-count
          :maxlength="200"
        />
      </a-form-item>

      <!-- 用户角色 -->
      <a-form-item
        label="用户角色"
        name="userRole"
        :rules="[{ required: true, message: '请选择用户角色' }]"
      >
        <a-select
          v-model:value="formState.userRole"
          placeholder="请选择用户角色"
        >
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="admin">管理员</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 提交按钮 -->
      <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
        <a-button type="primary" html-type="submit" :loading="submitting">提交</a-button>
        <a-button style="margin-left: 10px" @click="onReset">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { updateUserUsingPost } from '@/api/userController.ts';

interface Props {
  initialValues?: {
    id?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({
    userName: '',
    userAvatar: '',
    userProfile: '',
    userRole: 'user'
  })
});

const emit = defineEmits(['success']);

interface FormState {
  id?: string;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: string;
}

const formState = reactive<FormState>({
  id: props.initialValues.id,
  userName: props.initialValues.userName || '',
  userAvatar: props.initialValues.userAvatar || '',
  userProfile: props.initialValues.userProfile || '',
  userRole: props.initialValues.userRole || 'user'
});

const submitting = ref(false);

watch(() => props.initialValues, (newVal) => {
  if (!newVal) return; // 安全防护

  Object.assign(formState, {
    id: newVal.id,
    userName: newVal.userName || '',
    userAvatar: newVal.userAvatar || '',
    userProfile: newVal.userProfile || '',
    userRole: newVal.userRole || 'user'
  });
}, { immediate: true, deep: true });

const onFinish = async () => {
  submitting.value = true;
  try {
    const res = await updateUserUsingPost(formState);
    if (res.data.code === 0) {
      message.success('更新成功');
      emit('success');
    } else {
      message.error('更新失败: ' + res.data.message);
    }
  } catch (e) {
    message.error('请求失败');
  } finally {
    submitting.value = false;
  }
};

const onReset = () => {
  Object.assign(formState, {
    userName: props.initialValues.userName || '',
    userAvatar: props.initialValues.userAvatar || '',
    userProfile: props.initialValues.userProfile || '',
    userRole: props.initialValues.userRole || 'user'
  });
};
</script>

<style scoped>
#userUpdatePage {
  padding: 20px;
}
.title {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.desc {
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
</style>
