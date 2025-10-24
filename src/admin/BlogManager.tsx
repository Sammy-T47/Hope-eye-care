"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  published_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching posts:", error);
    else setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async () => {
    if (!editingPost) return;

    setLoading(true);

    const postToSave = {
      ...editingPost,
      updated_at: new Date().toISOString(),
      published_date: editingPost.is_published
        ? new Date().toISOString()
        : editingPost.published_date,
    };

    let result;
    if (editingPost.id) {
      result = await supabase
        .from("blog_posts")
        .update(postToSave)
        .eq("id", editingPost.id);
    } else {
      result = await supabase.from("blog_posts").insert([
        {
          ...postToSave,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    if (result.error) console.error(result.error);
    else {
      fetchPosts();
      setEditingPost(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) console.error(error);
    else fetchPosts();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>

      {loading && <p className="text-blue-600 mb-4">Loading...</p>}

      {/* Form Section */}
      {editingPost && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-3">
            {editingPost.id ? "Edit Post" : "New Post"}
          </h2>
          <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Title"
            value={editingPost.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditingPost({ ...editingPost, title: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Summary"
            value={editingPost.summary}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditingPost({ ...editingPost, summary: e.target.value })
            }
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            placeholder="Content"
            rows={5}
            value={editingPost.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditingPost({ ...editingPost, content: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Author"
            value={editingPost.author}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditingPost({ ...editingPost, author: e.target.value })
            }
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={editingPost.is_published}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditingPost({
                  ...editingPost,
                  is_published: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label>Published</label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingPost(null)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add New Post Button */}
      {!editingPost && (
        <button
          onClick={() =>
            setEditingPost({
              id: "",
              title: "",
              summary: "",
              content: "",
              author: "",
              published_date: null,
              is_published: false,
              created_at: "",
              updated_at: "",
            })
          }
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Post
        </button>
      )}

      {/* List of Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border p-4 rounded-lg hover:shadow transition"
            >
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-600">{post.summary}</p>
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>
                  Author: {post.author || "Unknown"} |{" "}
                  {post.is_published ? "Published" : "Draft"}
                </span>
                <span>
                  {new Date(post.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
