<template>
  <div id="userAddPage">
    <h2 class="title">vision云图库 - 添加用户</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish">
      <a-form-item
        name="userAccount"
        :rules="[
          { required: true, message: '请输入账号' },
          { validator: validateAccount }
        ]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能小于6位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码(至少6位)" />
      </a-form-item>

      <a-form-item
        name="userName"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="formState.userName" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item name="userRole" :rules="[{ required: true, message: '请选择角色' }]">
        <a-select v-model:value="formState.userRole" placeholder="请选择角色">
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="admin">管理员</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item name="userAvatar">
        <a-input v-model:value="formState.userAvatar" placeholder="请输入头像URL" />
      </a-form-item>

      <a-form-item name="userProfile">
        <a-textarea
          v-model:value="formState.userProfile"
          placeholder="请输入个人简介"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { addUserUsingPost } from '@/api/userController';
import router from '@/router'

// 用于接受表单输入的值
const formState = reactive<API.UserAddRequest>({
  userName: '',
  userAccount: '',
  userPassword: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
});

// 自定义账号验证规则
const validateAccount = async (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请输入账号');
  }
  return Promise.resolve();
};

const onFinish = async (values: any) => {
  try {
    const response = await addUserUsingPost(formState);
    if (response.data.code === 0) {
      message.success('添加用户成功');
      resetForm()

    } else {
      message.error('添加用户失败'+response.data.message);
    }
  } catch (error) {
    message.error('请求失败，请稍后重试');
  }
};

const resetForm = () => {
  formState.userName = '';
  formState.userAccount = '';
  formState.userPassword = '';
  formState.userAvatar = '';
  formState.userProfile = '';
  formState.userRole = '';
};
</script>

<style scoped>
#userAddPage {
  max-width: 360px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: #333;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 24px;
  font-size: 14px;
}

.ant-form-item {
  margin-bottom: 16px;
}

.ant-btn {
  height: 40px;
  font-size: 16px;
}
</style>
