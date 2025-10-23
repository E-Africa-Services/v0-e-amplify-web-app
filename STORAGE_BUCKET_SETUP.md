# E-Amplify Storage Bucket Configuration

## Quick Setup with Supabase CLI

### Prerequisites
\`\`\`bash
npm install -g supabase
supabase login
\`\`\`

### Create All Buckets

\`\`\`bash
# Navigate to your project directory
cd your-e-amplify-project

# Create buckets
supabase storage create-bucket avatars --public
supabase storage create-bucket cover-images --public
supabase storage create-bucket post-images --public
supabase storage create-bucket documents --public
supabase storage create-bucket session-recordings --public
\`\`\`

### Bucket Specifications

#### 1. Avatars Bucket
\`\`\`
Name: avatars
Public: Yes
Purpose: User profile pictures
Max Size: 5MB per file
Recommended Format: JPG, PNG, WebP
\`\`\`

#### 2. Cover Images Bucket
\`\`\`
Name: cover-images
Public: Yes
Purpose: User profile cover/banner images
Max Size: 10MB per file
Recommended Format: JPG, PNG, WebP
\`\`\`

#### 3. Post Images Bucket
\`\`\`
Name: post-images
Public: Yes
Purpose: Images attached to social posts
Max Size: 5MB per file
Recommended Format: JPG, PNG, WebP, GIF
\`\`\`

#### 4. Documents Bucket
\`\`\`
Name: documents
Public: No (Private)
Purpose: Shared resources, PDFs, materials
Max Size: 50MB per file
Recommended Format: PDF, DOCX, XLSX, PPTX
\`\`\`

#### 5. Session Recordings Bucket
\`\`\`
Name: session-recordings
Public: No (Private)
Purpose: Video recordings of mentorship sessions
Max Size: 500MB per file
Recommended Format: MP4, WebM
\`\`\`

## Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to "Storage" in the left sidebar
3. Click "New Bucket" for each bucket:
   - avatars (Public)
   - cover-images (Public)
   - post-images (Public)
   - documents (Private)
   - session-recordings (Private)

## File Upload Paths

### Avatar Upload Path
\`\`\`
avatars/{user_id}/avatar.jpg
\`\`\`

### Cover Image Upload Path
\`\`\`
cover-images/{user_id}/cover.jpg
\`\`\`

### Post Image Upload Path
\`\`\`
post-images/{user_id}/{post_id}/image.jpg
\`\`\`

### Document Upload Path
\`\`\`
documents/{user_id}/{document_name}.pdf
\`\`\`

### Session Recording Upload Path
\`\`\`
session-recordings/{session_id}/recording.mp4
\`\`\`

## Frontend Integration Example

\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Upload avatar
async function uploadAvatar(file: File, userId: string) {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${userId}/avatar.jpg`, file, {
      cacheControl: '3600',
      upsert: true,
    })
  
  if (error) throw error
  return data
}

// Get public URL
function getAvatarUrl(userId: string) {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.jpg`)
  
  return data.publicUrl
}
\`\`\`

## Security Considerations

1. **File Validation**: Always validate file types and sizes on the client
2. **Virus Scanning**: Consider adding virus scanning for user uploads
3. **Rate Limiting**: Implement rate limiting on upload endpoints
4. **Access Control**: Use RLS policies to restrict access
5. **CDN**: Enable CDN for public buckets to improve performance

## Monitoring Storage Usage

In Supabase Dashboard:
1. Go to Storage section
2. View total storage used
3. Monitor individual bucket sizes
4. Set up alerts for storage limits

## Cleanup & Maintenance

### Delete Old Files
\`\`\`typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove([`${userId}/old-avatar.jpg`])
\`\`\`

### List Files in Bucket
\`\`\`typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .list(userId)
\`\`\`

## Troubleshooting

### Upload Fails with 403 Error
- Check RLS policies are correctly configured
- Verify user is authenticated
- Ensure bucket exists

### Files Not Accessible
- Verify bucket is public (if needed)
- Check file path is correct
- Ensure file was uploaded successfully

### Slow Upload/Download
- Check file size
- Consider using CDN
- Verify network connection
