import { useState } from 'react';
import { uploadService } from '@/services/uploadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedUrl(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting upload...');
      const result = await uploadService.uploadImage(selectedFile);
      console.log('Upload successful:', result);
      setUploadedUrl(result.url);
      toast.success('Upload successful!');
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cloudinary Upload Test</h1>
        <p className="text-muted-foreground mt-1">
          Test your Cloudinary image upload functionality
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Select Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload to Cloudinary
              </>
            )}
          </Button>

          {/* Success State */}
          {uploadedUrl && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Upload Successful!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                Image URL:
              </p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 underline break-all"
              >
                {uploadedUrl}
              </a>
              <div className="mt-4">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Upload Failed</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Click "Choose File" and select an image (JPG, PNG, etc.)</p>
          <p>2. Click "Upload to Cloudinary"</p>
          <p>3. Check the browser console (F12) for detailed logs</p>
          <p>4. If successful, you'll see the uploaded image below</p>
          <p className="text-muted-foreground mt-4">
            Note: Make sure you're logged in to the admin panel first!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadTest;
