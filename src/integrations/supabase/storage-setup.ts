
import { supabase } from "./client";

/**
 * This function checks if the necessary storage buckets and policies exist,
 * and creates them if they don't.
 * 
 * NOTE: This requires admin privileges in Supabase and should typically 
 * be run in a migration script or setup script with appropriate permissions.
 * For a production app, consider using Supabase migrations instead.
 */
export const setupStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketError) {
      console.error("Error checking storage buckets:", bucketError);
      return;
    }
    
    const designBucketExists = buckets.some(bucket => bucket.name === 'design_images');
    
    if (!designBucketExists) {
      console.log("Creating design_images bucket");
      // In the client SDK, we can't create buckets or policies directly
      // This would need to be done via Supabase Studio or migrations
      console.log(`
        Please run the following SQL in the Supabase SQL Editor:
        
        -- Create storage bucket for design images
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('design_images', 'design_images', true);
        
        -- Create storage policy to allow authenticated users to upload
        CREATE POLICY "Allow authenticated uploads"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (
          bucket_id = 'design_images' 
          AND auth.role() = 'authenticated'
        );
        
        -- Allow public read access to design images
        CREATE POLICY "Allow public read access"
        ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'design_images');
      `);
    } else {
      console.log("Design images bucket already exists");
    }
    
    return designBucketExists;
  } catch (error) {
    console.error("Error setting up storage:", error);
    return false;
  }
};

/**
 * Helper function to upload a design image to the storage bucket
 */
export const uploadDesignImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file path using timestamp and userId
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${timestamp}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('design_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: publicURL } = supabase.storage
      .from('design_images')
      .getPublicUrl(filePath);
      
    return publicURL.publicUrl || null;
  } catch (error) {
    console.error("Error in uploadDesignImage:", error);
    return null;
  }
};

/**
 * Helper function to delete a design image from the storage bucket
 */
export const deleteDesignImage = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('design_images')
      .remove([filePath]);
      
    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteDesignImage:", error);
    return false;
  }
};
