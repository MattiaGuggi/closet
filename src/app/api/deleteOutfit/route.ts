import { deleteOutfitFromDb } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID della mossa non fornito' },
                { status: 400 }
            );
        }

        const result = await deleteOutfitFromDb(id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Mossa non trovata' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: 'Mossa eliminata con successo',
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false, error: error.message || 'Errore interno del server'
            }, { status: 500 }
        );
    }
}
