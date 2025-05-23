import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

interface CommentData {
  _id: string;
  content: string;
  likes: string[];
  numberOfLikes: number;
  userId: string;
  createdAt: string;
}

interface CommentProps {
  comment: CommentData;
  onLike: (commentId: string) => Promise<void>;
  onEdit: (comment: CommentData, editedContent: string) => Promise<void>;
  onDelete: (commentId: string) => void;
}

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface RootState {
  user: {
    currentUser: {
      _id: string;
      username: string;
      email: string;
      profilePicture: string;
      isAdmin: boolean;
    };
    error: string | null;
    loading: boolean;
  };
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onLike,
  onEdit,
  onDelete,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>

          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                className="bg-gradient-to-r from-[#4B5320] via-[#556B2F] to-[#8B8C7A] text-white"
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                type="button"
                size="sm"
                className="bg-gradient-to-r from-[#4B5320] via-[#556B2F] to-[#8B8C7A] text-white"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>

            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 
                                    ${
                                      currentUser &&
                                      comment.likes.includes(currentUser._id) &&
                                      "!text-blue-500"
                                    }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>

              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      type="button"
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(comment._id)}
                      type="button"
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
