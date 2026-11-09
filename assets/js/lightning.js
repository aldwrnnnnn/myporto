/**
 * Procedural Neon Lightning Background Engine
 * Creates realistic, branched electric purple lightning discharges every few seconds.
 * High performance: runs on canvas with zero CPU usage between strikes.
 */

export function initLightningEngine(canvasId = 'lightning-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let strikeTimer = null;
    let animFrame = null;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Recursive midpoint displacement for realistic jagged electric path
    function generateSegment(x1, y1, x2, y2, displace, segments) {
        if (displace < 5) {
            segments.push({ x1, y1, x2, y2 });
        } else {
            let midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
            let midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
            generateSegment(x1, y1, midX, midY, displace / 2, segments);
            generateSegment(midX, midY, x2, y2, displace / 2, segments);
        }
    }

    // Generate bolt with organic branches
    function createBolt(x1, y1, x2, y2) {
        const mainSegments = [];
        generateSegment(x1, y1, x2, y2, 140, mainSegments);

        const branches = [{ segments: mainSegments, width: 2.2, alpha: 1 }];

        // Add 2 to 3 organic side branches
        const branchCount = Math.floor(Math.random() * 2) + 2;
        for (let b = 0; b < branchCount; b++) {
            if (mainSegments.length > 8) {
                const idx = Math.floor(Math.random() * (mainSegments.length - 6)) + 3;
                const origin = mainSegments[idx];
                const angle = (Math.random() - 0.5) * 1.5;
                const len = (Math.random() * 0.35 + 0.25) * Math.max(120, y2 - origin.y1);
                const bEndX = origin.x1 + Math.sin(angle) * len;
                const bEndY = origin.y1 + Math.cos(angle) * len;

                const branchSegs = [];
                generateSegment(origin.x1, origin.y1, bEndX, bEndY, 70, branchSegs);
                branches.push({ segments: branchSegs, width: 1.1, alpha: 0.75 });
            }
        }

        return branches;
    }

    function renderBolt(branches, intensity, flashIntensity) {
        ctx.clearRect(0, 0, width, height);

        // Ambient atmospheric flash
        if (flashIntensity > 0.01) {
            ctx.fillStyle = `rgba(168, 85, 247, ${flashIntensity * 0.15})`;
            ctx.fillRect(0, 0, width, height);
        }

        if (intensity <= 0.01) return;

        branches.forEach(branch => {
            const branchAlpha = branch.alpha * intensity;
            if (branchAlpha <= 0.01) return;

            // Outer Purple Neon Glow
            ctx.save();
            ctx.strokeStyle = `rgba(192, 132, 252, ${branchAlpha * 0.9})`;
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 18;
            ctx.lineWidth = branch.width * 2.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'miter';

            ctx.beginPath();
            branch.segments.forEach((seg, i) => {
                if (i === 0) ctx.moveTo(seg.x1, seg.y1);
                ctx.lineTo(seg.x2, seg.y2);
            });
            ctx.stroke();

            // Inner Brilliant Core
            ctx.strokeStyle = `rgba(255, 255, 255, ${branchAlpha})`;
            ctx.shadowBlur = 6;
            ctx.lineWidth = branch.width * 0.9;

            ctx.beginPath();
            branch.segments.forEach((seg, i) => {
                if (i === 0) ctx.moveTo(seg.x1, seg.y1);
                ctx.lineTo(seg.x2, seg.y2);
            });
            ctx.stroke();
            ctx.restore();
        });
    }

    // Trigger an electric strike with authentic multi-stage flicker
    function strike() {
        const startX = width * (0.15 + Math.random() * 0.7);
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 220;
        const endY = height * (0.65 + Math.random() * 0.35);

        const bolt = createBolt(startX, startY, endX, endY);
        const startTime = performance.now();
        const duration = 260; // 260ms full animation lifecycle

        function animate(now) {
            const elapsed = now - startTime;
            if (elapsed >= duration) {
                ctx.clearRect(0, 0, width, height);
                scheduleNextStrike();
                return;
            }

            let boltAlpha = 1;
            let flashAlpha = 1;

            // Realistic lightning discharge profile:
            // 0 - 30ms: Initial powerful strike
            // 30 - 60ms: Slight dip
            // 60 - 90ms: Secondary surge re-strike
            // 90 - 260ms: Smooth decay
            if (elapsed < 30) {
                boltAlpha = 1;
                flashAlpha = 1;
            } else if (elapsed < 60) {
                boltAlpha = 0.4;
                flashAlpha = 0.3;
            } else if (elapsed < 90) {
                boltAlpha = 0.95;
                flashAlpha = 0.85;
            } else {
                const decay = 1 - (elapsed - 90) / (duration - 90);
                boltAlpha = Math.max(0, decay * 0.8);
                flashAlpha = Math.max(0, decay * 0.6);
            }

            renderBolt(bolt, boltAlpha, flashAlpha);
            animFrame = requestAnimationFrame(animate);
        }

        animFrame = requestAnimationFrame(animate);
    }

    function scheduleNextStrike() {
        if (strikeTimer) clearTimeout(strikeTimer);
        // Sambaran petir muncul setiap 1 hingga 5 detik sekali
        const delay = Math.random() * 4000 + 1000;
        strikeTimer = setTimeout(strike, delay);
    }

    // Sambaran pertama segera aktif setelah halaman dimuat (800ms)
    strikeTimer = setTimeout(strike, 800);

    return () => {
        if (strikeTimer) clearTimeout(strikeTimer);
        if (animFrame) cancelAnimationFrame(animFrame);
        window.removeEventListener('resize', resize);
    };
}
