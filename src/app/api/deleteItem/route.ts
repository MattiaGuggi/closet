import { deleteItemFromDb } from '@/lib/database';
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

        const result = await deleteItemFromDb(id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Item non trovato' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: 'Item eliminato con successo',
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false, error: error.message || 'Errore interno del server'
            }, { status: 500 }
        );
    }
}
