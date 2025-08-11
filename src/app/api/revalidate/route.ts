import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    
    if (slug) {
      // Revalider la page spécifique de l'article
      revalidatePath(`/${slug}`);
      console.log(`[REVALIDATE] Revalidated article page: /${slug}`);
    } else {
      // Revalider toutes les pages d'articles
      revalidatePath('/blog');
      revalidatePath('/');
      console.log('[REVALIDATE] Revalidated blog and home pages');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: slug ? `Revalidated /${slug}` : 'Revalidated blog pages',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[REVALIDATE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
