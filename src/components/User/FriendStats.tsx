import { FaBell } from "react-icons/fa";
import FriendActions from "./FriendActions";
import { useFriendRelationship } from "../../hooks/useFriendRelationship";
import { useAuth } from "../../contexts/AuthContext";
type User = { id: number; follower_count?: number; unread_pm_count?: number };

export default function FriendStats({ user, selfId }: { user: User; selfId?: number }) {
  const { user: self } = useAuth();
  const resolvedSelfId = selfId ?? self?.id;
  
  // If there is no valid userID, no friend operation is displayed
  if (!resolvedSelfId || !user?.id) {
    console.log('Missing user IDs:', { resolvedSelfId, userId: user?.id });
    return (
      <div className="flex gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>loading...</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 friend-button-shadow">
          <FaBell className="w-4 h-4" />
          <span>{user.unread_pm_count ?? 0}</span>
        </div>
      </div>
    );
  }
  // Check directly whether it is yourself
  const isCurrentUserSelf = resolvedSelfId === user.id;
  
  const {
    status,
    isSelf,
    add,
    remove,
    block,
    unblock,
  } = useFriendRelationship(user.id, resolvedSelfId);

  // Priority is given to the results of direct comparison, only if it is impossible to determine hook Results
  const finalIsSelf = isCurrentUserSelf;

  console.log('FriendStats debug:', { 
    resolvedSelfId, 
    userId: user.id, 
    isCurrentUserSelf, 
    hookIsSelf: isSelf,
    finalIsSelf,
    status 
  });

  return (
    <div className="flex gap-3 relative">
      <FriendActions
        status={status}
        onAdd={add}
        onRemove={remove}
        onBlock={block}
        onUnblock={unblock}
        followerCount={user.follower_count ?? 0}
        isSelf={finalIsSelf}
      />
      <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 friend-button-shadow">
        <FaBell className="w-4 h-4" />
        <span>{user.unread_pm_count ?? 0}</span>
      </div>
    </div>
  );
}