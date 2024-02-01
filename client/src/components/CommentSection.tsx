import { Textarea, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

interface CommentSectionProps {
    postId: string;
}

interface CommentData {
    _id: string;
    content: string;
    likes: string[];
    numberOfLikes: number;
    userId: string;
    createdAt: string;
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

const CommentSection: React.FC<CommentSectionProps> = ({postId}) => {

    const [comment, setComment] = useState<string>('');
    const [commentError, setCommentError] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);

    const {currentUser} = useSelector((state: RootState) => state.user);

    const navigate = useNavigate()
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (comment.length > 200) {
            return;
        }

        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment, 
                    postId,
                    userId: currentUser._id
                })
            });
    
            const data = await res.json();
    
            if (res.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments])
            }
        } catch (error: any) {
            setCommentError(error.message)
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);

                if (res.ok) {
                    const data = await res.json();
                    setComments(data)
                }
            } catch (error: any) {
                console.log(error.message);
            }
        };

        getComments();
    }, [postId]);

    const handleLike = async (commentId: string) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });

            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId ? {
                            ...comment,
                            likes: data.likes,
                            numberOfLikes: data.likes.length,
                        } : comment
                    )
                );
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const handleEdit = async (comment: CommentData, editedContent: string) => {
        setComments(
            comments.map((c) =>
              c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? 
                (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p>Signed in as:</p>
                        <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username} />
                        <Link className='text-xs text-cyan-600 hover:underline' to={'/dashboard?tab=profile'}>
                            @{currentUser.username}
                        </Link>
                    </div>
                ) : 
                (
                    <div className='text-sm text-teal-500 my-5 flex gap-1'>
                        You must be signed in to comment.
                        <Link className='text-blue-500 hover:underline' to='/sign-in'>
                            Sign in
                        </Link>
                    </div>
                )
            }

            {
                currentUser && (
                    <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                        <Textarea
                            placeholder='Add a comment...'
                            rows={3}
                            maxLength={200}
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />

                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-gray-500 text-xs'>
                                {200 - comment.length} characters remaining
                            </p>
                            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                                Submit
                            </Button>
                        </div>

                        {commentError && (
                            <Alert color='failure' className='mt-5'>
                                {commentError}
                            </Alert>
                        )}
                    </form>
                )
            }

            {comments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>

                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((comment) => (
                        <Comment 
                            key={comment._id}
                            comment={comment}
                            onLike = {handleLike}
                            onEdit = {handleEdit}
                        />
                    ))}
                </>
            )}
        </div>
    )
}

export default CommentSection;