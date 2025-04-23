import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Make sure this is imported
import { toast } from 'react-toastify';
import { useContext } from 'react';
// import { AuthContext } from './AuthContext';
import { AuthContext } from '../../provider/Authprovider';


const ViewComments = () => {
    
const { userInfo } = useContext(AuthContext);  // Assuming userInfo contains the logged-in user's data
const userId = userInfo ? userInfo._id : null; 
console.log('userId:', userInfo); // Debugging line to check userId

    const { id } = useParams(); // Extract projectId from URL params
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
console.log('Project ID:', userInfo); // Debugging line to check projectId
    useEffect(() => {
        if (id) { // Ensure id is available before making the fetch request
            fetchComments(id);
        } else {
            toast.error('Project ID is missing!');
        }
    }, [id]);

    const fetchComments = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${projectId}`);
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setComments(data);
            } else {
                throw new Error('Unexpected data format');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        }
    };

    const handleAddComment = async () => {
        // Ensure that content and userId are valid
        if (!newComment.trim()) {
            toast.error('Please enter a valid comment');
            return;
        }
    
        if (!userId) {
            toast.error('User ID is missing');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: id,   // Ensure 'id' is the project ID from URL
                    userId,  // Use the dynamically fetched userId
                    content: newComment,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setNewComment(''); // Reset the comment input
                fetchComments(id); // Reload the comments
                toast.success('Comment added successfully');
            } else {
                toast.error(data.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };
    
    return (
        <div>
            <h1>Comments for Project</h1>
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="border-b p-2">
                            <p>{comment.content}</p>
                            {/* <small>By  {comment.userId.username}  </small> */}
                            <small>By {comment?.userId? comment.userId.name : 'Unknown User'}</small>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to add one!</p>
                )}
            </div>

            <textarea
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="textarea textarea-bordered w-full mt-4"
            ></textarea>
            <button onClick={handleAddComment} className="btn btn-primary mt-2">
                Add Comment
            </button>
        </div>
    );
};

export default ViewComments;
