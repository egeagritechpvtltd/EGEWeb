import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import BlogPostForm from '../../components/blog/BlogPostForm';
import { toast } from 'react-hot-toast';

export default function EditBlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postRef = doc(db, 'blogPosts', id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          toast.error('Post not found');
          navigate('/admin/posts');
          return;
        }

        const postData = {
          id: postSnap.id,
          ...postSnap.data(),
          // Convert Firestore timestamps to Date objects if they exist
          createdAt: postSnap.data().createdAt?.toDate(),
          updatedAt: postSnap.data().updatedAt?.toDate(),
          publishedAt: postSnap.data().publishedAt?.toDate(),
        };

        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        navigate('/admin/posts');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }


  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
      {post && <BlogPostForm post={post} />}
    </div>
  );
}
