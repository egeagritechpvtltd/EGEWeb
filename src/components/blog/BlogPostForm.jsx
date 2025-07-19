import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Cloudinary Upload Widget
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function BlogPostForm({ post = null }) {
  const [imagePublicId, setImagePublicId] = useState(post?.imagePublicId || '');
  const [bannerPreview, setBannerPreview] = useState(post?.bannerImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      slug: post?.slug || '',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      isPublished: post?.isPublished || false,
    },
  });

  // Watch slug changes to update the URL preview
  const slug = watch('slug');
  const title = watch('title');

  // Generate slug from title if empty
  useEffect(() => {
    if (!post?.slug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      setValue('slug', generatedSlug);
      
      // Also set meta title if empty
      if (!post?.metaTitle) {
        setValue('metaTitle', title);
      }
    }
  }, [title, post, setValue]);

  useEffect(() => {
    // Function to initialize Cloudinary widget
    const initCloudinaryWidget = () => {
      if (typeof window.cloudinary !== 'undefined') {
        cloudinaryRef.current = window.cloudinary;
        
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            multiple: false,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            cropping: true,
            croppingAspectRatio: 16 / 9,
            showSkipCropButton: false,
            folder: 'ege-blog',
            sources: ['local', 'url', 'camera', 'image_search'],
            theme: 'minimal',
            styles: {
              palette: {
                window: '#FFFFFF',
                sourceBg: '#F4F4F4',
                windowBorder: '#90A0B3',
                tabIcon: '#0078D4',
                inactiveTabIcon: '#0E2F5A',
                menuIcons: '#5A616A',
                link: '#0078D4',
                action: '#FF620C',
                inProgress: '#0078D4',
                complete: '#20B832',
                error: '#EA0017',
                textDark: '#000000',
                textLight: '#FFFFFF'
              },
              fonts: {
                default: null,
                "sans-serif": {
                  url: null,
                  active: true
                }
              }
            }
          },
          (error, result) => {
            if (error) {
              console.error('Upload Error:', error);
              toast.error('Failed to upload image: ' + (error.message || 'Unknown error'));
              setIsUploading(false);
              return;
            }

            if (result.event === 'success') {
              setImagePublicId(result.info.public_id);
              setBannerPreview(result.info.secure_url);
              toast.success('Image uploaded successfully');
            } else if (result.event === 'close') {
              // Reset uploading state when widget is closed
              setIsUploading(false);
            } else if (result.event === 'upload-added') {
              // File added, now uploading
              toast.loading('Uploading image...');
            }
          }
        );
      } else {
        // If Cloudinary script isn't loaded yet, try again after a delay
        console.log('Cloudinary script not loaded, retrying...');
        const timer = setTimeout(initCloudinaryWidget, 1000);
        return () => clearTimeout(timer);
      }
    };

    // Initialize the widget when component mounts
    initCloudinaryWidget();

    // Cleanup on unmount
    return () => {
      if (widgetRef.current) {
        widgetRef.current.close();
      }
    };
  }, [CLOUD_NAME, UPLOAD_PRESET]);

  const handleBannerUpload = () => {
    if (isUploading) return;
    
    if (!widgetRef.current) {
      toast.error('Image uploader is not ready. Please refresh the page and try again.');
      console.error('Cloudinary widget not initialized');
      return;
    }
    
    try {
      setIsUploading(true);
      widgetRef.current.open();
    } catch (error) {
      console.error('Error opening upload widget:', error);
      toast.error('Failed to open image uploader. Please try again.');
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Get the editor content
      if (!editorRef.current) {
        throw new Error('Editor not initialized');
      }
      
      const content = editorRef.current.getContent();
      if (!content) {
        toast.error('Please add some content to your post');
        return;
      }
      
      // Prepare the post data
      const postData = {
        ...data,
        content,
        updatedAt: serverTimestamp(),
      };
      
      // Only include image fields if they have values
      const currentImagePublicId = imagePublicId || post?.imagePublicId;
      const currentBannerImage = bannerPreview || post?.bannerImage;
      
      if (currentImagePublicId) {
        postData.imagePublicId = currentImagePublicId;
      }
      
      if (currentBannerImage) {
        postData.bannerImage = currentBannerImage;
      }
      
      if (!post) {
        // New post
        postData.createdAt = serverTimestamp();
        postData.views = 0;
        postData.isPublished = data.isPublished || false;
        
        // Add to Firestore
        const newPostRef = doc(collection(db, 'blogPosts'));
        await setDoc(newPostRef, postData);
        
        toast.success('Blog post created successfully!');
        navigate(`/admin/blog`);
      } else {
        // Update existing post
        await setDoc(doc(db, 'blogPosts', post.id), postData, { merge: true });
        toast.success('Blog post updated successfully!');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(`Error saving post: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          
          {/* Banner Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <div className="mt-1">
              <button
                type="button"
                onClick={handleBannerUpload}
                disabled={isUploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isUploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isUploading ? (
                  'Uploading...'
                ) : bannerPreview ? (
                  'Change Image'
                ) : (
                  'Upload Image'
                )}
              </button>
              
              {bannerPreview && (
                <div className="mt-4">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="max-w-full h-auto max-h-64 rounded-md shadow-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Click the button above to change the image
                  </p>
                </div>
              )}
              
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse"></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Uploading image, please wait...</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="mt-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL Slug *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                /blog/
              </span>
              <input
                type="text"
                id="slug"
                {...register('slug', { 
                  required: 'Slug is required',
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
                  },
                })}
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Preview: /blog/{slug || 'your-blog-post-url'}
            </p>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="mt-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <div className="mt-1">
              <textarea
                id="excerpt"
                rows={3}
                {...register('excerpt')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="A short summary of your post"
              />
              <p className="mt-1 text-xs text-gray-500">
                A brief summary of your post that will show in blog listings and search results.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'r26zp0zc2jd7ygi8e3qmb15cvtj2t8ry28qddk8t2uuz5rk1'}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={post?.content || ''}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
              }}
            />
          </div>

          {/* SEO Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              SEO Settings
            </h3>
            
            {/* Meta Title */}
            <div className="mt-4">
            </div>

            {/* Meta Description */}
            <div className="mt-4">
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <div className="mt-1">
                <textarea
                  id="metaDescription"
                  rows={3}
                  {...register('metaDescription')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="A brief description of the page for search results"
                  maxLength="160"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {watch('metaDescription') ? 
                    `${watch('metaDescription').length}/160 characters` : 
                    'A brief summary of the page for search results (max 160 characters).'}
                </p>
              </div>
            </div>
          </div>

          {/* Publish Status */}
          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              {...register('isPublished')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              Publish this post
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
