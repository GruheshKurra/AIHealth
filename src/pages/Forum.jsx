import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import {
  MessageCircle, Send, Loader2, User, Clock, Reply,
  AlertCircle, Plus, Check, X, Trash2, MoreVertical
} from 'lucide-react';
import { initializeDatabase, forumOperations } from '../lib/database';

const ForumPost = ({ post, onReply, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useUser();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const replyData = {
        forum_id: post.id,
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
        content: replyContent.trim()
      };

      const result = await forumOperations.addReply(replyData);
      if (result.success) {
        setReplyContent('');
        setShowReplyForm(false);
        onReply(); // Refresh the posts
      } else {
        alert('Failed to add reply: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.clerk_user_id) {
      console.log('Delete blocked - user check failed:', {
        hasUser: !!user,
        userId: user?.id,
        postUserId: post.clerk_user_id,
        match: user?.id === post.clerk_user_id
      });
      return;
    }

    console.log('Starting delete process for post:', post.id);
    setIsDeleting(true);
    try {
      const result = await forumOperations.deletePost(post.id, user.id);
      console.log('Delete result:', result);

      if (result.success) {
        console.log('Post deleted successfully, refreshing posts');
        setShowDeleteConfirm(false);
        onDelete(); // Refresh the posts
      } else {
        console.error('Delete failed:', result.error);
        alert('Failed to delete post: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwner = user && user.id === post.clerk_user_id;

  return (
    <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
      {/* Main Post */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-800/50 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-200">{post.user_name}</h3>
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
                <span className="px-2 py-1 bg-green-800/30 rounded text-xs">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Post Menu */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-green-800/30 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-green-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-green-800 rounded-lg shadow-lg ring-1 ring-green-700 z-10">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors w-full text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-green-100 mb-2">{post.title}</h2>
        <p className="text-green-200 mb-4">{post.content}</p>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-green-400">
            {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
          </span>

          <SignedIn>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </SignedIn>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-green-900 rounded-lg p-6 max-w-md w-full mx-4 ring-1 ring-green-800">
            <h3 className="text-lg font-semibold text-green-100 mb-4">Delete Post</h3>
            <p className="text-green-200 mb-6">
              Are you sure you want to delete this post? This action cannot be undone and will also delete all replies.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-red-100 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-green-800/50 text-green-200 rounded-lg hover:bg-green-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {post.forum_replies && post.forum_replies.length > 0 && (
        <div className="border-l-2 border-green-800/50 ml-5 pl-4 space-y-3">
          {post.forum_replies.map((reply) => (
            <div key={reply.id} className="bg-green-800/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-800/50 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <span className="font-medium text-green-200">{reply.user_name}</span>
                  <div className="flex items-center space-x-1 text-xs text-green-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(reply.created_at)}</span>
                  </div>
                </div>
              </div>
              <p className="text-green-100">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 border-l-2 border-green-800/50 ml-5 pl-4">
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-3 py-2 bg-green-800/20 border border-green-800/50 rounded-lg text-green-100 placeholder-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting || !replyContent.trim()}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Reply</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="flex items-center space-x-1 px-4 py-2 bg-green-800/50 text-green-200 rounded-lg hover:bg-green-700/50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const categories = [
    { value: 'general', label: 'General Discussion' },
    { value: 'crops', label: 'Crops & Planting' },
    { value: 'irrigation', label: 'Irrigation & Water' },
    { value: 'pests', label: 'Pest Control' },
    { value: 'soil', label: 'Soil Management' },
    { value: 'equipment', label: 'Equipment & Tools' },
    { value: 'market', label: 'Market & Pricing' },
    { value: 'weather', label: 'Weather & Climate' }
  ];

  useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDatabase();
        loadPosts();
      } catch (error) {
        console.error('Database initialization failed:', error);
        setError('Database connection failed');
        setLoading(false);
      }
    };

    initDB();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await forumOperations.getAllPosts();

      if (result.success) {
        setPosts(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const postData = {
        clerk_user_id: user.id,
        user_name: user.fullName || user.firstName || 'Anonymous',
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category
      };

      const result = await forumOperations.createPost(postData);
      if (result.success) {
        setNewPost({ title: '', content: '', category: 'general' });
        setShowNewPostForm(false);
        loadPosts(); // Refresh posts
      } else {
        alert('Failed to create post: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-400" />
          <p className="text-green-200">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-900/50 rounded-full mb-4 ring-1 ring-green-800/50">
            <MessageCircle className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-green-100 mb-2">Farmers' Forum</h1>
          <p className="text-green-200">Share knowledge and get help from the farming community</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/40 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
              <button
                onClick={loadPosts}
                className="ml-auto px-3 py-1 bg-red-700 text-red-100 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Create Post Section */}
        <div className="mb-8">
          <SignedOut>
            <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50 text-center">
              <h3 className="text-lg font-semibold text-green-200 mb-2">Join the Discussion</h3>
              <p className="text-green-300 mb-4">Sign in to ask questions and share your farming knowledge</p>
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors">
                  Sign In to Post
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            {!showNewPostForm ? (
              <button
                onClick={() => setShowNewPostForm(true)}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-green-900/40 rounded-lg ring-1 ring-green-800/50 hover:bg-green-800/40 transition-colors"
              >
                <Plus className="w-5 h-5 text-green-400" />
                <span className="text-green-200">Ask a Question</span>
              </button>
            ) : (
              <div className="bg-green-900/40 rounded-lg p-6 ring-1 ring-green-800/50">
                <h3 className="text-lg font-semibold text-green-200 mb-4">Ask a Question</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-200 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-3 py-2 bg-green-800/20 border border-green-800/50 rounded-lg text-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-200 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="What's your question about?"
                      className="w-full px-3 py-2 bg-green-800/20 border border-green-800/50 rounded-lg text-green-100 placeholder-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-200 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Provide more details about your question..."
                      className="w-full px-3 py-2 bg-green-800/20 border border-green-800/50 rounded-lg text-green-100 placeholder-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newPost.title.trim() || !newPost.content.trim()}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-green-100 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Post Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-800/50 text-green-200 rounded-lg hover:bg-green-700/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </SignedIn>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ForumPost
                key={post.id}
                post={post}
                onReply={loadPosts}
                onDelete={loadPosts}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-green-400">No discussions yet. Be the first to ask a question!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
