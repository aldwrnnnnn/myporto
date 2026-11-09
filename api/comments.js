/**
 * Vercel Serverless Function: /api/comments
 * Handles fetching and posting comments.
 */

// Initial seed comments (migrated from local comments.json)
let memoryComments = [
    {
        "id": "cmt_f6b165a75ceb",
        "name": "CEO PT LAGUNA",
        "comment": "anjayy",
        "created_at": "2026-11-07T19:11:38+07:00",
        "formatted_date": "7 Nov 2026"
    },
    {
        "id": "cmt_7a9b07f2382a",
        "name": "timothy ronald",
        "comment": "bagus anak muda",
        "created_at": "2026-11-06T11:52:53+07:00",
        "formatted_date": "6 Nov 2026"
    },
    {
        "id": "cmt_78f7e9a5537e",
        "name": "prikitiw",
        "comment": "bjirrrrr boboiboy halilintar",
        "created_at": "2026-11-06T11:51:51+07:00",
        "formatted_date": "6 Nov 2026"
    },
    {
        "id": "cmt_3163edfcaab6",
        "name": "gusj",
        "comment": "mantap bang",
        "created_at": "2026-11-06T11:51:17+07:00",
        "formatted_date": "6 Nov 2026"
    },
    {
        "id": "cmt_8d8f62be9c5c",
        "name": "renky.",
        "comment": "bagi source code bg",
        "created_at": "2026-11-06T11:30:49+07:00",
        "formatted_date": "6 Nov 2026"
    },
    {
        "id": "cmt_e059818d7ad6",
        "name": "ticanddzzz",
        "comment": "alamak",
        "created_at": "2026-11-06T11:30:18+07:00",
        "formatted_date": "6 Nov 2026"
    }
];

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
