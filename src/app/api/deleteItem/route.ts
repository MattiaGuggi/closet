import { deleteItemFromDb, getClothingFromDb } from '@/lib/database';
import { NextResponse } from 'next/server';
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN! });

// Helper to extract the unique file key from the URL
const getFileKey = (url: string | undefined | null) => {
    if (!url || !url.includes("utfs.io")) return null;
    return url.split("/").pop(); 
};

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID non fornito' }, 
                { status: 400 }
            );
        }

        // Fetch the item safely using your existing database method
        const itemToDelete = await getClothingFromDb(id);

        // If it's not found (already deleted via a double-click), return success
        if (!itemToDelete) {
            return NextResponse.json({ 
                success: true, 
                message: 'Item già eliminato' 
            });
        }

        // Gather UploadThing file keys
        const filesToDelete: string[] = [];
        
        const imageKey = getFileKey(itemToDelete.image);
        if (imageKey) filesToDelete.push(imageKey);

        const modelKey = getFileKey(itemToDelete.modelFile);
        if (modelKey) filesToDelete.push(modelKey);

        // Delete files from UploadThing
        if (filesToDelete.length > 0) {
            // Run asynchronously, catch errors so it doesn't break the response
            await utapi.deleteFiles(filesToDelete).catch(err => 
                console.error("Failed to delete files from UploadThing:", err)
            );
        }

        // Delete the item from your database
        await deleteItemFromDb(id);

        return NextResponse.json({
            success: true,
            message: 'Item ed eventuali file eliminati con successo',
        });
    } catch (error: any) {
        console.error("API Delete Error:", error);
        return NextResponse.json({
            success: false, error: error.message || 'Errore interno del server'
        }, { status: 500 });
    }
}