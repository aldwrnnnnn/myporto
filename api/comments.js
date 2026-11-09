/**
 * Vercel Serverless Function: /api/comments
 * Handles fetching and posting comments.
 */

// In-memory cache for serverless invocation lifecycle
let memoryComments = [];

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            count: memoryComments.length,
            comments: memoryComments
        });
    }

    if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const rawName = (body.name || '').trim();
        const rawComment = (body.comment || '').trim();

        if (rawName.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Nama wajib diisi minimal 2 karakter.'
            });
        }
        if (rawName.length > 50) {
            return res.status(400).json({
                success: false,
                error: 'Nama maksimal 50 karakter.'
            });
        }
        if (rawComment.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Komentar wajib diisi minimal 3 karakter.'
            });
        }
        if (rawComment.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'Komentar maksimal 500 karakter.'
            });
        }

        // Basic escape
        const cleanName = rawName
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const cleanComment = rawComment
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const formattedDate = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

        const newComment = {
            id: 'cmt_' + Math.random().toString(36).substring(2, 10),
            name: cleanName,
            comment: cleanComment,
            created_at: now.toISOString(),
            formatted_date: formattedDate
        };

        memoryComments.unshift(newComment);
        if (memoryComments.length > 200) {
            memoryComments = memoryComments.slice(0, 200);
        }

        return res.status(200).json({
            success: true,
            message: 'Komentar berhasil dikirim!',
            comment: newComment,
            comments: memoryComments
        });
    }

    return res.status(405).json({
        success: false,
        error: 'Method not allowed.'
    });
}
