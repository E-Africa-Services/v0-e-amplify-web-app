import { FeedNavbar } from "@/components/feed-navbar"
import { CreatePost } from "@/components/create-post"
import { FeedPost } from "@/components/feed-post"
import { FeedSidebar } from "@/components/feed-sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { getFeedPosts } from "@/lib/feed-actions"

export default async function FeedPage() {
  const result = await getFeedPosts(20, 0)
  const posts = result.data || []

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <FeedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <CreatePost />

              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post: any) => <FeedPost key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No posts yet. Be the first to share your learning journey!</p>
                  </div>
                )}
              </div>

              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">You've reached the end of your feed</p>
              </div>
            </div>

            <div className="lg:col-span-4">
              <FeedSidebar />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
