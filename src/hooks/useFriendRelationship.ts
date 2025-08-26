import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { friendsAPI, handleApiError } from '../utils/api';

export type FriendStatus = {
  isFriend: boolean;
  isBlocked: boolean;
  isMutual: boolean;
  followsMe: boolean;
  loading: boolean;
  isSelf: boolean;
};

export function useFriendRelationship(targetUserId: number, selfUserId: number) {
  const mountedRef = useRef(true);
  
  // 添加调试日志
  console.log('useFriendRelationship called with:', { targetUserId, selfUserId });
  
  // 参数验证
  const isValidUserId = (id: any): id is number => {
    return typeof id === 'number' && !isNaN(id) && id > 0;
  };
  
  if (!isValidUserId(targetUserId)) {
    console.error('Invalid targetUserId:', targetUserId);
  }
  
  if (!isValidUserId(selfUserId)) {
    console.error('Invalid selfUserId:', selfUserId);
  }
  
  const [status, setStatus] = useState<FriendStatus>({
    isFriend: false,
    isBlocked: false,
    isMutual: false,
    followsMe: false,
    loading: true, // 初始总是 loading，让 API 来判断
    isSelf: false, // 初始假设不是自己，让 API 来判断
  });

  const refresh = useCallback(async () => {
    // 验证 targetUserId 是否有效
    if (!isValidUserId(targetUserId)) {
      console.error('Cannot make API call with invalid targetUserId:', targetUserId);
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('Making API call to check relationship for userId:', targetUserId);
      setStatus(prev => ({ ...prev, loading: true }));
      
      const res = await friendsAPI.checkRelationship(targetUserId);
      console.log('API response:', res);
      
      if (!mountedRef.current) return;

      // 如果成功获取到关系数据，说明不是自己
      setStatus({
        isFriend: !!res?.isFriend,
        isBlocked: !!res?.isBlocked,
        isMutual: !!res?.isMutual,
        followsMe: !!res?.followsMe,
        loading: false,
        isSelf: false,
      });
    } catch (err: any) {
      console.log('API call failed:', err);
      
      // 检查是否是"不能查看自己"的错误
      const errorMessage = err?.response?.data?.message || err?.message || '';
      const isSelfError = errorMessage.includes('Cannot check relationship with yourself') || 
                         errorMessage.includes('yourself') ||
                         (err?.response?.status === 422 && errorMessage.includes('relationship'));
      
      if (isSelfError) {
        console.log('Detected self-relationship error, setting isSelf to true');
        if (mountedRef.current) {
          setStatus({
            isFriend: false,
            isBlocked: false,
            isMutual: false,
            followsMe: false,
            loading: false,
            isSelf: true,
          });
        }
        return; // 不显示错误toast，这是正常情况
      }
      
      // 其他错误正常处理
      console.error('Real API error:', {
        targetUserId,
        selfUserId,
        errorMessage,
        status: err?.response?.status
      });
      
      if (mountedRef.current) {
        setStatus(prev => ({ ...prev, loading: false }));
      }
      handleApiError(err);
    }
  }, [targetUserId]);

  useEffect(() => {
    mountedRef.current = true;
    
    console.log('useEffect triggered:', { targetUserId, selfUserId });
    
    // 总是尝试请求，让后端来判断是否为自己
    refresh();

    return () => {
      mountedRef.current = false;
    };
  }, [targetUserId, selfUserId, refresh]);

  // 动态获取 isSelf 状态
  const currentIsSelf = status.isSelf;

  // 乐观更新辅助函数
  const withOptimisticUpdate = useCallback((
    updater: (prev: FriendStatus) => FriendStatus,
    action: () => Promise<any>,
    okMsg?: string
  ) => {
    const prev = status;
    const optimistic = updater(prev);
    setStatus(optimistic);

    return action()
      .then(() => {
        if (okMsg) toast.success(okMsg);
        return refresh();
      })
      .catch((err) => {
        setStatus(prev);
        handleApiError(err);
      });
  }, [status, refresh]);

  // 创建操作函数
  const add = useCallback(() => {
    if (currentIsSelf) return Promise.resolve();
    
    return withOptimisticUpdate(
      (s) => ({ ...s, isFriend: true }),
      () => friendsAPI.addFriend(targetUserId),
      '已关注该用户'
    );
  }, [targetUserId, currentIsSelf, withOptimisticUpdate]);

  const remove = useCallback(() => {
    if (currentIsSelf) return Promise.resolve();
    
    return withOptimisticUpdate(
      (s) => ({ ...s, isFriend: false, isMutual: false }),
      () => friendsAPI.removeFriend(targetUserId),
      '已取消关注'
    );
  }, [targetUserId, currentIsSelf, withOptimisticUpdate]);

  const block = useCallback(() => {
    if (currentIsSelf) return Promise.resolve();
    
    return withOptimisticUpdate(
      (s) => ({ ...s, isBlocked: true, isFriend: false, isMutual: false }),
      () => friendsAPI.blockUser(targetUserId),
      '已屏蔽该用户'
    );
  }, [targetUserId, currentIsSelf, withOptimisticUpdate]);

  const unblock = useCallback(() => {
    if (currentIsSelf) return Promise.resolve();
    
    return withOptimisticUpdate(
      (s) => ({ ...s, isBlocked: false }),
      () => friendsAPI.unblockUser(targetUserId),
      '已取消屏蔽'
    );
  }, [targetUserId, currentIsSelf, withOptimisticUpdate]);
  console.log('Current status:', status);
  return {
    status,
    isSelf: currentIsSelf,
    refresh,
    add,
    remove,
    block,
    unblock,
  };
}