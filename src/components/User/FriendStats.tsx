import { FaBell } from "react-icons/fa";
import FriendActions from "./FriendActions";

type User = { follower_count?: number; unread_pm_count?: number };

export default function FriendStats({ user }: { user: User }) {
  return (
    <div className="flex gap-3">
        <FriendActions
          status={{
            isFriend: false,
            isBlocked: false,
            isMutual: false,
            followsMe: false,
            loading: false,
          }}
          onAdd={() => {}}
          onRemove={() => {}}
          onBlock={() => {}}
          onUnblock={() => {}}
        />
      <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 friend-button-shadow">
        <FaBell className="w-4 h-4" />
        <span>{user.unread_pm_count ?? 0}</span>
      </div>
    </div>
  );
}