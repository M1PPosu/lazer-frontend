export const settingsPage = {
  settings: {
    title: '账户设置',
    description: '管理您的账户信息和偏好设置',
    errors: {
      loadFailed: '无法加载设置',
      tryRefresh: '请尝试刷新页面'
    },
    username: {
      title: '用户名设置',
      current: '当前用户名',
      change: '修改用户名',
      placeholder: '输入新的用户名',
      hint: '用户名修改后，您的原用户名将保存在历史记录中',
      save: '保存',
      saving: '保存中...',
      cancel: '取消',
      success: '用户名修改成功！',
      errors: {
        empty: '用户名不能为空',
        sameAsOld: '新用户名与当前用户名相同',
        taken: '用户名已被占用，请选择其他用户名',
        userNotFound: '找不到指定用户',
        failed: '修改用户名失败，请稍后重试'
      }
    },
    avatar: {
      title: '头像设置',
      current: '当前头像',
      change: '修改头像',
      hint: '支持 PNG、JPEG、GIF 格式，建议尺寸 256x256 像素，最大 5MB',
      success: '头像修改成功！'
    },
    cover: {
      title: '头图设置',
      label: '个人资料头图',
      hint: '建议尺寸：2000x500 像素（官方推荐 4:1 比例），支持 PNG、JPEG、GIF 格式，最大 10MB'
    },
    account: {
      title: '账户信息',
      userId: '用户 ID',
      joinDate: '注册时间',
      country: '国家/地区',
      lastVisit: '最后访问'
    }
  },
} as const;
