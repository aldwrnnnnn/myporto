/**
 * Vercel Serverless Function: /api/comments
 * Handles fetching and posting comments with persistent Supabase storage.
 */

// Initial seed comments (migrated from local comments.json / fallback if db not configured yet)
const DEFAULT_SEED_COMMENTS = [
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

let memoryFallback = [...DEFAULT_SEED_COMMENTS];

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const supabaseUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/+$/, '') : null;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

    if (req.method === 'GET') {
        if (isSupabaseConfigured) {
            try {
                const endpoint = `${supabaseUrl}/rest/v1/comments?select=id,name,comment,created_at,formatted_date&order=created_at.desc&limit=200`;
                const response = await fetch(endpoint, {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        return res.status(200).json({
                            success: true,
                            count: data.length,
                            comments: data
                        });
                    }
                } else {
                    const errText = await response.text();
                    console.error('Supabase GET comments failed:', response.status, errText);
                }
            } catch (err) {
                console.error('Supabase fetch error:', err);
            }
        }

        // Fallback if Supabase is not configured yet or temporary fetch failure
        return res.status(200).json({
            success: true,
            count: memoryFallback.length,
            comments: memoryFallback
        });
    }

    if (req.method === 'POST') {
        let body = {};
        try {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'Format data JSON tidak valid.'
            });
        }

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

        // Basic HTML entity escape
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
            id: 'cmt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
            name: cleanName,
            comment: cleanComment,
            created_at: now.toISOString(),
            formatted_date: formattedDate
        };

        if (isSupabaseConfigured) {
            try {
                const insertEndpoint = `${supabaseUrl}/rest/v1/comments`;
                const insertResp = await fetch(insertEndpoint, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(newComment)
                });

                if (insertResp.ok) {
                    // Fetch latest comments to return fresh list
                    const getEndpoint = `${supabaseUrl}/rest/v1/comments?select=id,name,comment,created_at,formatted_date&order=created_at.desc&limit=200`;
                    const getResp = await fetch(getEndpoint, {
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    let commentsList = [newComment];
                    if (getResp.ok) {
                        const fetched = await getResp.json();
                        if (Array.isArray(fetched)) commentsList = fetched;
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Komentar berhasil dikirim!',
                        comment: newComment,
                        comments: commentsList
                    });
                } else {
                    const errText = await insertResp.text();
                    console.error('Supabase INSERT comments failed:', insertResp.status, errText);
                    return res.status(500).json({
                        success: false,
                        error: 'Gagal menyimpan komentar ke database server.'
                    });
                }
            } catch (err) {
                console.error('Supabase insert network error:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Koneksi ke database bermasalah. Coba lagi beberapa saat lagi.'
                });
            }
        }

        // Memory fallback if Supabase not configured yet
        memoryFallback.unshift(newComment);
        if (memoryFallback.length > 200) {
            memoryFallback = memoryFallback.slice(0, 200);
        }

        return res.status(200).json({
            success: true,
            message: 'Komentar berhasil dikirim!',
            comment: newComment,
            comments: memoryFallback
        });
    }

    return res.status(405).json({
        success: false,
        error: 'Method not allowed.'
    });
}
