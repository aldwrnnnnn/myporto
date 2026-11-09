/**
 * Main Application Logic - Neon Aesthetic Portfolio
 * Features: Spotify Web Audio Synth, Interactive Avatar Morph, Form Validation,
 * Lightbox Gallery, Copy Actions, and Custom Neon Cursor.
 */

import { projectsData } from './projects-data.js?v=25';
import { initLightningEngine } from './lightning.js';

function initApp() {
    initScrollAndEntranceAnimations();
    initSPARouter();
    initMobileMenu();
    initWelcomeLoader();
    initLightningEngine();
    initCustomCursor();
    initNavbarScroll();
    initLanyardCard();
    initAudioToggle();
    initContactForm();
    initCommentsSection();
    initCopyButtons();
    
    // Page-specific initialization
    if (document.getElementById('projects-grid-container')) {
        renderProjectsGrid();
    }
    
    if (document.getElementById('project-detail-container')) {
        initProjectDetailPage();
    }
    
    initLightbox();
    initPagePrefetch();
    suppressBrowserUrlPreview();
}

// Welcome loader pop-up (Greeting, Name, and 0-100% Loading Animation)
function initWelcomeLoader() {
    const backdrop = document.getElementById('welcome-loader-backdrop');
    const popup = document.getElementById('welcome-loader-popup');
    if (!backdrop || !popup) return;

    // Skip the welcome pop-up if already seen in this session or returning from internal page
    let isInternalReturn = false;
    try {
        if (document.referrer) {
            const refUrl = new URL(document.referrer);
            if (refUrl.origin === window.location.origin && refUrl.pathname !== window.location.pathname) {
                isInternalReturn = true;
            }
        }
    } catch (err) {
        isInternalReturn = false;
    }

    const navEntries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (sessionStorage.getItem('welcome_seen') === 'true' || (isInternalReturn && !isReload)) {
        backdrop.classList.add('is-hidden');
        document.body.classList.remove('welcome-lock');
        setTimeout(revealHeroAndNavbar, 80);
        return;
    }

    document.body.classList.add('welcome-lock');

    const counterNumEl = document.getElementById('welcome-counter-num');
    const barFillEl = document.getElementById('welcome-bar-fill');

    let isClosing = false;
    let rafId = null;
    let fallbackTimer = null;
    const totalDuration = 2700; // 2.7s counter progress + 300ms pause = 3.0 seconds total loading sequence
    const startTime = performance.now();

    function applyProgressUI(pct) {
        const clamped = Math.max(0, Math.min(100, Math.floor(pct)));

        if (counterNumEl) counterNumEl.textContent = String(clamped);
        if (barFillEl) barFillEl.style.width = `${clamped}%`;

        if (clamped === 100) {
            popup.classList.add('is-complete');
        }
    }

    function closeWelcomeLoader() {
        if (isClosing) return;
        isClosing = true;
        try { sessionStorage.setItem('welcome_seen', 'true'); } catch (e) {}
        if (rafId) cancelAnimationFrame(rafId);
        if (fallbackTimer) clearTimeout(fallbackTimer);

        applyProgressUI(100);

        setTimeout(() => {
            backdrop.classList.add('is-exiting');
            document.body.classList.remove('welcome-lock');
            revealHeroAndNavbar();

            setTimeout(() => {
                backdrop.classList.add('is-hidden');
            }, 720);
        }, 180);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function stepLoader(now) {
        if (isClosing) return;
        const currentNow = typeof now === 'number' ? now : performance.now();
        const elapsed = Math.max(0, currentNow - startTime);
        const rawRatio = Math.min(1, elapsed / totalDuration);
        const easedRatio = easeOutCubic(rawRatio);
        const currentPct = Math.round(easedRatio * 100);

        applyProgressUI(currentPct);

        if (rawRatio < 1) {
            rafId = requestAnimationFrame(stepLoader);
        } else {
            applyProgressUI(100);
            setTimeout(() => {
                closeWelcomeLoader();
            }, 350);
        }
    }

    fallbackTimer = setTimeout(() => {
        closeWelcomeLoader();
    }, totalDuration + 800);

    document.addEventListener('keydown', function onEscWelcome(e) {
        if (e.key === 'Escape' && !isClosing) {
            closeWelcomeLoader();
            document.removeEventListener('keydown', onEscWelcome);
        }
    });

    rafId = requestAnimationFrame(stepLoader);
}

/* ==========================================================================
   1. CUSTOM NEON CURSOR (Desktop only)
   ========================================================================== */
function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    
    if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) {
        if (dot) dot.style.display = 'none';
        if (ring) ring.style.display = 'none';
        return;
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });
    
    function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
    
    // Interactive hover states
    const interactiveElements = 'a, button, input, textarea, .project-card, .badge-card-container, .screenshot-card, .skill-chip, .stacked-card, .stacked-deck-wrap, .nav-audio-btn, [data-href], [data-external-href]';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            ring.style.width = '48px';
            ring.style.height = '48px';
            ring.style.borderColor = 'var(--neon-purple-light)';
            ring.style.boxShadow = '0 0 16px var(--neon-purple-glow)';
            dot.style.transform = 'translate(-50%, -50%) scale(1.6)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(interactiveElements)) {
                return;
            }
            ring.style.width = '32px';
            ring.style.height = '32px';
            ring.style.borderColor = 'rgba(192, 132, 252, 0.65)';
            ring.style.boxShadow = '0 0 12px rgba(168, 85, 247, 0.35)';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
}

/* ==========================================================================
   2. NAVBAR ACTIVE STATE & SMOOTH SCROLL
   ========================================================================== */
let isNavbarScrollInitialized = false;
function initNavbarScroll() {
    if (isNavbarScrollInitialized) return;
    isNavbarScrollInitialized = true;

    window.addEventListener('scroll', () => {
        const navLinks = document.querySelectorAll('.nav-link');
        if (!navLinks.length) return;

        const scrollY = window.scrollY + 160;
        let currentSectionId = '';

        const sections = Array.from(navLinks).map(link => {
            const id = link.getAttribute('data-href') || link.getAttribute('href');
            return (id && id.startsWith('#')) ? document.querySelector(id) : null;
        }).filter(Boolean);

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        // Pastikan link navigasi terakhir (Kontak) tetap aktif saat discroll mendekati bawah halaman
        const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);
        if (isNearBottom && sections.length > 0) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            const raw = link.getAttribute('data-href') || link.getAttribute('href') || '';
            const target = raw.replace('#', '');
            if (target && target === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, { passive: true });
}

/* ==========================================================================
   3. LANYARD & ID BADGE INTERACTIVE PENDULUM DRAG PHYSICS
   ========================================================================== */
function initLanyardCard() {
    const stage = document.getElementById('hero-lanyard-stage');
    const badgeContainer = document.getElementById('badge-card-container');
    const pathLeft = document.getElementById('lanyard-path-left');
    const pathRight = document.getElementById('lanyard-path-right');
    const shadowLeft = document.getElementById('lanyard-shadow-left');
    const shadowRight = document.getElementById('lanyard-shadow-right');

    if (!stage || !badgeContainer || !pathLeft || !pathRight) return;
    window.__lanyardInitialized = true;

    // Physics constants
    let restLength = 190; // Natural resting distance from top edge of website to hook
    let currentLength = 190; // Dynamic length (stretches or slacks)
    const gravityFactor = 0.0032; // Pendulum restoring force
    const dampingFactor = 0.982; // Air resistance velocity decay

    // State variables
    let stageWidth = stage.offsetWidth || 320;
    let anchorX = stageWidth / 2;
    let anchorY = -140; // Starts from very top edge of website

    let hookX = anchorX;
    let hookY = anchorY + restLength;
    let currentAngle = 0; // In radians
    let angularVelocity = 0; // In radians/frame
    let radialVelocity = 0; // For bounce on stretch/slack release
    let tiltY = 0; // 3D card perspective tilt in degrees (Y-axis)
    let tiltX = 0; // 3D card perspective tilt in degrees (X-axis)

    let isDragging = false;
    let physicsRafId = null;
    let hasDismissedHint = false;
    let hasTriggeredEntrance = false;

    // Grab tracking
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerTime = 0;
    let releaseVelocityX = 0;
    let releaseVelocityY = 0;

    // Calculate stage geometry and anchor at the very top edge of the website
    function updateStageGeometry() {
        stageWidth = stage.offsetWidth || 280;
        anchorX = stageWidth / 2;

        const isStackedMobile = window.innerWidth <= 900;
        const hero = document.getElementById('home') || document.querySelector('.hero-section');
        const stageRect = stage.getBoundingClientRect();

        if (isStackedMobile) {
            // On stacked mobile layout, anchor right above the stage so straps don't cross over hero text
            anchorY = -28;
        } else if (hero) {
            const heroRect = hero.getBoundingClientRect();
            // Distance from top of stage to top of website / hero section (negative value)
            anchorY = Math.round(heroRect.top - stageRect.top);
        } else {
            anchorY = -115;
        }

        // Resting position of the hook inside the stage (0 on desktop so card aligns 1:1 with left column)
        const targetRestHookY = isStackedMobile ? 20 : 0;
        restLength = Math.max(48, targetRestHookY - anchorY);
        if (!isDragging && Math.abs(currentAngle) < 0.01) {
            currentLength = restLength;
            hookX = anchorX;
            hookY = anchorY + restLength;
        }
    }

    // Update the visual position of the badge and the SVG straps
    function render() {
        const badgeWidth = badgeContainer.offsetWidth || 276;
        const posX = hookX - badgeWidth / 2;
        const posY = hookY;

        // Position & rotate badge around the top hook slot (50% 0px)
        // In CSS, positive rotation swings bottom to the left, negative to the right.
        const deg = -currentAngle * (180 / Math.PI);
        badgeContainer.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${deg.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;

        // Left & right strap anchor offsets at very top edge of website
        const pegOffset = 26;
        const leftPegX = anchorX - pegOffset;
        const rightPegX = anchorX + pegOffset;
        const pegY = anchorY;

        // Distance from anchor to hook
        const currentDist = Math.hypot(hookX - anchorX, hookY - anchorY);

        // Slack & curve calculations:
        // If currentDist < restLength (card pushed upward), lanyard droops with gravity (slack)
        // If currentDist >= restLength, lanyard pulls straight & taut
        let sag = 2;
        if (currentDist < restLength) {
            sag = Math.max(0, restLength - currentDist) * 0.65 + 4;
        }
        const swingOffset = Math.sin(currentAngle) * 8;

        const ctrlLX = (leftPegX + hookX) / 2 + swingOffset;
        const ctrlLY = (pegY + hookY) / 2 + sag;

        const ctrlRX = (rightPegX + hookX) / 2 + swingOffset;
        const ctrlRY = (pegY + hookY) / 2 + sag;

        const dLeft = `M ${leftPegX.toFixed(1)} ${pegY.toFixed(1)} Q ${ctrlLX.toFixed(1)} ${ctrlLY.toFixed(1)} ${(hookX - 2).toFixed(1)} ${(hookY + 2).toFixed(1)}`;
        const dRight = `M ${rightPegX.toFixed(1)} ${pegY.toFixed(1)} Q ${ctrlRX.toFixed(1)} ${ctrlRY.toFixed(1)} ${(hookX + 2).toFixed(1)} ${(hookY + 2).toFixed(1)}`;

        pathLeft.setAttribute('d', dLeft);
        pathRight.setAttribute('d', dRight);

        if (shadowLeft && shadowRight) {
            shadowLeft.setAttribute('d', dLeft);
            shadowRight.setAttribute('d', dRight);
        }

        // Position ceiling bracket at top edge of website
        const topBracket = document.getElementById('lanyard-top-bracket');
        if (topBracket) {
            topBracket.setAttribute('x', (anchorX - 34).toFixed(1));
            topBracket.setAttribute('y', anchorY.toFixed(1));
            topBracket.style.display = 'block';
        }
    }

    // Physics step
    function step() {
        if (!isDragging) {
            // Free oscillation: Damped Harmonic Pendulum Motion
            const accel = -gravityFactor * Math.sin(currentAngle);
            angularVelocity += accel;
            angularVelocity *= dampingFactor;
            currentAngle += angularVelocity;

            // Soft pendulum limits: prevent card from looping over the ceiling
            const maxSwingAngle = Math.PI * 0.38; // ~68 degrees
            if (currentAngle > maxSwingAngle) {
                currentAngle = maxSwingAngle;
                angularVelocity = -angularVelocity * 0.25;
            } else if (currentAngle < -maxSwingAngle) {
                currentAngle = -maxSwingAngle;
                angularVelocity = -angularVelocity * 0.25;
            }

            // Radial spring oscillation (bouncing back to restLength if stretched or compressed)
            if (currentLength !== restLength || Math.abs(radialVelocity) > 0.05) {
                const springForce = -0.08 * (currentLength - restLength) - 0.16 * radialVelocity;
                radialVelocity += springForce;
                currentLength += radialVelocity;
                if (Math.abs(currentLength - restLength) < 0.25 && Math.abs(radialVelocity) < 0.08) {
                    currentLength = restLength;
                    radialVelocity = 0;
                }
            }

            // Calculate hook position from current angle and length
            hookX = anchorX + currentLength * Math.sin(currentAngle);
            hookY = anchorY + currentLength * Math.cos(currentAngle);

            // 3D card tilts dampen to 0
            tiltY *= 0.93;
            tiltX *= 0.93;

            // Rest threshold: stop RAF when motion is negligible to save CPU
            if (Math.abs(currentAngle) < 0.0003 && Math.abs(angularVelocity) < 0.0001 && currentLength === restLength && Math.abs(tiltY) < 0.04 && Math.abs(tiltX) < 0.04) {
                currentAngle = 0;
                angularVelocity = 0;
                radialVelocity = 0;
                tiltY = 0;
                tiltX = 0;
                hookX = anchorX;
                hookY = anchorY + restLength;
                render();
                physicsRafId = null;
                return;
            }
        }

        render();
        physicsRafId = requestAnimationFrame(step);
    }

    function startPhysics() {
        if (!physicsRafId) {
            physicsRafId = requestAnimationFrame(step);
        }
    }

    // Trigger entrance throw animation ("awal show itu case nya seperti terlempar ada goyang goyang sedikit")
    function triggerEntranceToss() {
        if (hasTriggeredEntrance) return;
        hasTriggeredEntrance = true;
        updateStageGeometry();
        // Drop straight down from above the stage; the radial spring gives a bounce on landing
        currentAngle = 0;
        angularVelocity = 0.004; // Tiny sideways nudge so the landing wobbles a little
        currentLength = Math.max(40, restLength - 480);
        radialVelocity = 0;
        hookX = anchorX + currentLength * Math.sin(currentAngle);
        hookY = anchorY + currentLength * Math.cos(currentAngle);
        tiltY = 0;
        startPhysics();
    }

    // Pointer Event Handlers for Dragging (Direct 2D Cursor Following)
    function onPointerDown(e) {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        
        updateStageGeometry();
        isDragging = true;
        badgeContainer.classList.add('is-dragging');

        if (!hasDismissedHint) {
            hasDismissedHint = true;
            badgeContainer.classList.add('hint-dismissed');
        }

        if (badgeContainer.setPointerCapture && e.pointerId) {
            try { badgeContainer.setPointerCapture(e.pointerId); } catch (_) {}
        }

        const stageRect = stage.getBoundingClientRect();
        const curX = e.clientX - stageRect.left;
        const curY = e.clientY - stageRect.top;

        // Record grab offset relative to current hook position
        grabOffsetX = curX - hookX;
        grabOffsetY = curY - hookY;

        lastPointerX = curX;
        lastPointerY = curY;
        lastPointerTime = performance.now();
        releaseVelocityX = 0;
        releaseVelocityY = 0;

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        startPhysics();
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const stageRect = stage.getBoundingClientRect();
        const curX = e.clientX - stageRect.left;
        const curY = e.clientY - stageRect.top;

        // Calculate velocity for momentum release
        const now = performance.now();
        const dt = Math.max(1, now - lastPointerTime);
        releaseVelocityX = ((curX - lastPointerX) / dt) * 16;
        releaseVelocityY = ((curY - lastPointerY) / dt) * 16;
        lastPointerX = curX;
        lastPointerY = curY;
        lastPointerTime = now;

        // Desired hook position following cursor directly
        const targetHookX = curX - grabOffsetX;
        const targetHookY = curY - grabOffsetY;

        // Vector from ceiling anchor to target hook
        const dx = targetHookX - anchorX;
        const dy = targetHookY - anchorY;
        const dist = Math.hypot(dx, dy);

        // Smooth, responsive elastic lanyard stretch
        let constrainedX = targetHookX;
        let constrainedY = targetHookY;

        if (dist > restLength) {
            const extra = dist - restLength;
            const effectiveDist = restLength + (Math.atan(extra / 150) * 120 + extra * 0.35);
            constrainedX = anchorX + (dx / dist) * effectiveDist;
            constrainedY = anchorY + (dy / dist) * effectiveDist;
        }

        // Clamp so hook doesn't pass above ceiling
        constrainedY = Math.max(anchorY + 30, constrainedY);

        // Responsive direct follow (smooth 95% per frame)
        hookX += (constrainedX - hookX) * 0.95;
        hookY += (constrainedY - hookY) * 0.95;

        // Current strap angle
        const strapAngle = Math.atan2(hookX - anchorX, hookY - anchorY);
        // Subtle tilt (0.35x) keeps photo centered with cursor, plus slight wrist drag momentum
        const pullAngle = strapAngle * 0.35 + Math.max(-0.15, Math.min(0.15, releaseVelocityX * 0.008));
        currentAngle += (pullAngle - currentAngle) * 0.45;

        // 3D perspective tilts: facing direction of drag
        const targetTiltY = -Math.max(-20, Math.min(20, (curX - anchorX) / 100 * 18));
        const targetTiltX = Math.max(-14, Math.min(14, -(hookY - (anchorY + restLength)) / 80 * 12));
        tiltY += (targetTiltY - tiltY) * 0.35;
        tiltX += (targetTiltX - tiltX) * 0.35;

        render();
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        badgeContainer.classList.remove('is-dragging');

        if (e && badgeContainer.releasePointerCapture && e.pointerId) {
            try { badgeContainer.releasePointerCapture(e.pointerId); } catch (_) {}
        }

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        // Convert release velocity into angular & radial momentum (clamped to realistic wrist fling)
        const strapAngle = Math.atan2(hookX - anchorX, hookY - anchorY);
        const currentDist = Math.hypot(hookX - anchorX, hookY - anchorY);

        // Set currentAngle to actual strapAngle for natural pendulum oscillation
        currentAngle = strapAngle;

        // Tangential velocity -> angular velocity
        const vTan = releaseVelocityX * Math.cos(strapAngle) - releaseVelocityY * Math.sin(strapAngle);
        angularVelocity = Math.max(-0.045, Math.min(0.045, (vTan / restLength) * 0.45));

        // Radial velocity -> subtle spring bounce
        const vRad = releaseVelocityX * Math.sin(strapAngle) + releaseVelocityY * Math.cos(strapAngle);
        radialVelocity = Math.max(-6, Math.min(6, vRad * 0.3));
        currentLength = currentDist;

        startPhysics();
    }

    // Attach pointer listeners to badge card container
    badgeContainer.addEventListener('pointerdown', onPointerDown);

    // Completely prevent browser native drag ghost or text selection (keeps photo and case 100% unified)
    badgeContainer.addEventListener('dragstart', (e) => e.preventDefault());
    badgeContainer.addEventListener('selectstart', (e) => e.preventDefault());
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    // Subtle hover breeze nudge
    badgeContainer.addEventListener('mouseenter', (e) => {
        if (!isDragging && !physicsRafId) {
            angularVelocity += (Math.random() > 0.5 ? 0.008 : -0.008);
            startPhysics();
        }
    });

    // Keyboard support: Arrow keys nudge the badge (Accessibility R-32)
    badgeContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            angularVelocity -= 0.035;
            tiltY += 12;
            startPhysics();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            angularVelocity += 0.035;
            tiltY -= 12;
            startPhysics();
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            angularVelocity += (Math.random() > 0.5 ? 0.04 : -0.04);
            tiltY += 15;
            startPhysics();
        }
    });

    // Window resize handler to maintain anchor coordinates
    window.addEventListener('resize', () => {
        updateStageGeometry();
        render();
    });

    // Initial render
    updateStageGeometry();
    render();

    // Trigger the entrance swing when the hero visuals are revealed
    const heroVisuals = document.querySelector('.hero-visuals');
    if (heroVisuals) {
        if (heroVisuals.classList.contains('is-revealed')) {
            // Already revealed
            setTimeout(triggerEntranceToss, 1000);
        } else {
            // Observe or check for reveal class
            const revealObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (heroVisuals.classList.contains('is-revealed')) {
                            revealObserver.disconnect();
                            setTimeout(triggerEntranceToss, 1000);
                        }
                    }
                });
            });
            revealObserver.observe(heroVisuals, { attributes: true });

            // Fallback timeout in case loader is bypassed or observer doesn't trigger
            setTimeout(() => {
                if (!hasTriggeredEntrance) {
                    triggerEntranceToss();
                }
            }, 3600);
        }
    } else {
        setTimeout(triggerEntranceToss, 150);
    }
}

/* ==========================================================================
   4. BACKGROUND MUSIC CONTROLLER (Continuous Playback & Persistent Progress)
   ========================================================================== */
let isAudioPlaying = false;
let audioInstance = null;
let isAudioDelegated = false;

function getOrCreateAudio() {
    if (audioInstance) return audioInstance;
    let audioEl = document.getElementById('bg-music');
    if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.id = 'bg-music';
        audioEl.src = 'assets/backsound/good-for-you.mp3?v=18';
        audioEl.preload = 'auto';
        audioEl.loop = true;
        document.body.appendChild(audioEl);
    }
    audioEl.volume = 1.0; // Volume penuh 100%
    audioEl.loop = true;
    audioInstance = audioEl;
    return audioInstance;
}

function updateAudioUI(playing) {
    isAudioPlaying = playing;
    const allAudioBtns = document.querySelectorAll('.audio-btn');
    allAudioBtns.forEach(btn => {
        const labelEl = btn.querySelector('.audio-btn-label');
        if (playing) {
            btn.classList.add('playing');
            btn.setAttribute('title', 'Jeda Musik');
            btn.setAttribute('aria-label', 'Jeda Musik');
            if (labelEl) labelEl.textContent = 'Jeda';
        } else {
            btn.classList.remove('playing');
            btn.setAttribute('title', 'Putar Musik');
            btn.setAttribute('aria-label', 'Putar Musik');
            if (labelEl) labelEl.textContent = 'Musik';
        }
    });
}

function toggleAudio() {
    const audioEl = getOrCreateAudio();
    if (audioEl.paused) {
        audioEl.play().then(() => {
            updateAudioUI(true);
        }).catch(err => {
            console.warn('Playback blocked:', err);
        });
    } else {
        audioEl.pause();
        updateAudioUI(false);
    }
}

function initAudioToggle() {
    const audioEl = getOrCreateAudio();

    // Attach delegated click listener once for all .audio-btn elements (header, project page, etc.)
    if (!isAudioDelegated) {
        isAudioDelegated = true;
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.audio-btn');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            toggleAudio();
        });
    }

    // Persist playback position to sessionStorage on every timeupdate
    audioEl.addEventListener('timeupdate', () => {
        try {
            sessionStorage.setItem('bg_music_time', String(audioEl.currentTime));
        } catch (e) {}
    });

    audioEl.addEventListener('play', () => {
        updateAudioUI(true);
        try { sessionStorage.setItem('bg_music_playing', '1'); } catch (e) {}
    });

    audioEl.addEventListener('pause', () => {
        updateAudioUI(false);
        try { sessionStorage.setItem('bg_music_playing', '0'); } catch (e) {}
    });

    audioEl.addEventListener('ended', () => {
        updateAudioUI(false);
    });

    // Restore saved playback position if available
    const restoreSavedTime = () => {
        try {
            const savedTime = sessionStorage.getItem('bg_music_time');
            if (savedTime) {
                const t = parseFloat(savedTime);
                if (!isNaN(t) && t > 0) {
                    audioEl.currentTime = t;
                }
            }
        } catch (e) {}
    };

    if (audioEl.readyState >= 1) {
        restoreSavedTime();
    } else {
        audioEl.addEventListener('loadedmetadata', restoreSavedTime, { once: true });
    }

    // Autoplay function: attempts immediate playback, fallbacks to first interaction
    function startAutoPlay() {
        const userPaused = sessionStorage.getItem('bg_music_playing') === '0';
        if (userPaused) {
            updateAudioUI(false);
            return;
        }

        const promise = audioEl.play();
        if (promise !== undefined) {
            promise.then(() => {
                updateAudioUI(true);
            }).catch(() => {
                // If blocked by browser autoplay policy, trigger on first user gesture
                const onFirstInteraction = () => {
                    const stillNotPaused = sessionStorage.getItem('bg_music_playing') !== '0';
                    if (stillNotPaused && audioEl.paused) {
                        audioEl.play().then(() => {
                            updateAudioUI(true);
                        }).catch(() => {});
                    }
                    
                    const events = ['click', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
                    events.forEach(evt => window.removeEventListener(evt, onFirstInteraction, true));
                };

                const events = ['click', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
                events.forEach(evt => window.addEventListener(evt, onFirstInteraction, { capture: true, once: true }));
            });
        }
    }

    // Start autoplay immediately on load
    startAutoPlay();
}

/* ==========================================================================
   5. RENDER PROJECTS GRID ON HOMEPAGE
   ========================================================================== */
function renderProjectsGrid() {
    const container = document.getElementById('projects-grid-container');
    if (!container) return;
    
    const projectsList = Object.values(projectsData);
    
    container.innerHTML = projectsList.map(proj => {
        return `
            <a data-href="project.html?id=${proj.slug}" class="project-card" role="link" tabindex="0">
                <div class="project-card-top">
                    <div class="project-thumb-wrap">
                        <img 
                            src="${proj.thumbnail}" 
                            alt="${proj.title}" 
                            class="project-thumb"
                            loading="lazy"
                        />
                    </div>
                    
                    <h3 class="project-title">${proj.title}</h3>
                </div>
            </a>
        `;
    }).join('');
}

/* ==========================================================================
   6. PROJECT DETAIL PAGE: SPLIT LAYOUT & PURE STACKED IMAGES
   ========================================================================== */
function initProjectDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('id') || 'catara';
    const project = projectsData[slug] || (slug === 'attendance-system' ? projectsData['attendanceweb'] : projectsData['catara']);
    
    if (!project) return;
    
    // Set Page Title
    document.title = `${project.title} | Portofolio ALDI`;
    
    // Render Left Column Header & Content
    const titleEl = document.getElementById('project-detail-title');
    const summaryEl = document.getElementById('project-detail-summary');
    const techEl = document.getElementById('project-detail-tech');
    
    if (titleEl) titleEl.textContent = project.title;
    if (summaryEl) summaryEl.textContent = project.summary;
    
    // Clear Tech Stack Pills if element exists
    if (techEl) {
        techEl.innerHTML = '';
    }

    // Render Project Highlights Box (Left Column)
    const highlightsContainer = document.getElementById('project-highlights-container');
    if (highlightsContainer && project.highlights && project.highlights.length > 0) {
        highlightsContainer.innerHTML = `
            <div class="project-highlights-title">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Sorotan Arsitektur & Keunggulan Sistem</span>
            </div>
            <div class="project-highlights-grid">
                ${project.highlights.map(hl => `
                    <div class="project-highlight-item">
                        <svg class="project-highlight-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${hl}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // =========================================================================
    // RIGHT COLUMN: PURE STACKED IMAGES (CLICK TO ADVANCE)
    // =========================================================================
    const screenshots = project.screenshots || [];
    const total = screenshots.length;
    if (total === 0) return;

    let currentTopIndex = 0;

    // Organic stacking poses that dynamically alternate right and left on each click
    function getLayerPose(k, currentTopIdx) {
        // Alternating base tilt for the top card (k = 0): gentle, subtle tilt alternating right and left
        const topAlternates = [-1.0, 1.1, -1.2, 1.0, -0.9, 1.2, -1.1, 1.0];
        const topRot = topAlternates[currentTopIdx % topAlternates.length];
        const topDir = topRot >= 0 ? 1 : -1;

        if (k === 0) {
            return {
                rot: topRot,
                offX: topDir * 1,
                offY: 0,
                scale: 1.0,
                z: 25
            };
        }

        // For layers behind (k = 1, 2, 3, ...), alternate direction gently relative to top card
        const layerDir = (k % 2 === 1) ? -topDir : topDir;

        const rotMags = [0, 1.6, 1.9, 1.4, 1.1, 1.7, 1.3, 0.9, 1.4, 1.0, 0.8, 0.6];
        const offXMags = [0, 3.5, 4.5, 4.0, 3.0, 3.5, 2.5, 2.5, 2.0, 2.0, 1.5, 1.5];
        const offYSteps = [0, 4, 7, 10, 13, 15, 17, 19, 21, 22, 23, 24];
        const scaleSteps = [1.0, 0.988, 0.976, 0.964, 0.952, 0.94, 0.928, 0.916, 0.904, 0.892, 0.88, 0.87];

        const idx = Math.min(k, rotMags.length - 1);
        return {
            rot: layerDir * rotMags[idx],
            offX: layerDir * offXMags[idx],
            offY: offYSteps[idx],
            scale: scaleSteps[idx],
            z: 25 - k
        };
    }

    const deckEl = document.getElementById('stacked-images-deck');
    const deckWrap = document.getElementById('stacked-deck-wrap');
    const pageContainer = document.querySelector('.project-split-page');
    const rightCol = document.querySelector('.project-right-col');

    const isMobileApp = Boolean(
        (project.badge && project.badge.toLowerCase().includes('mobile')) ||
        (project.category && project.category.toLowerCase().includes('mobile'))
    );

    if (pageContainer) {
        pageContainer.classList.toggle('is-portrait-page', isMobileApp);
        pageContainer.classList.toggle('is-landscape-page', !isMobileApp);
    }
    if (rightCol) {
        rightCol.classList.toggle('is-portrait-layout', isMobileApp);
        rightCol.classList.toggle('is-landscape-layout', !isMobileApp);
    }
    if (deckWrap) {
        deckWrap.classList.toggle('is-portrait', isMobileApp);
        deckWrap.classList.toggle('is-landscape', !isMobileApp);
        deckWrap.style.aspectRatio = isMobileApp ? '575 / 1280' : '1918 / 945';
        if (isMobileApp) {
            deckWrap.style.setProperty('--portrait-ratio', (575 / 1280).toFixed(5));
        }
    }

    // Subtle tactile audio feedback
    function playSlideSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(360, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    }

    // Dynamically conform deck aspect-ratio to the natural image proportion so zero cropping occurs
    function syncImageAspectRatio(idx) {
        const item = screenshots[idx];
        if (!item || !deckWrap) return;

        const img = new Image();
        img.src = item.url;
        img.onload = () => {
            if (img.naturalWidth && img.naturalHeight && deckWrap) {
                const isPortrait = img.naturalHeight > img.naturalWidth;

                deckWrap.classList.toggle('is-portrait', isPortrait);
                deckWrap.classList.toggle('is-landscape', !isPortrait);

                if (rightCol) {
                    rightCol.classList.toggle('is-portrait-layout', isPortrait);
                    rightCol.classList.toggle('is-landscape-layout', !isPortrait);
                }
                if (pageContainer) {
                    pageContainer.classList.toggle('is-portrait-page', isPortrait);
                    pageContainer.classList.toggle('is-landscape-page', !isPortrait);
                }

                deckWrap.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
                if (isPortrait) {
                    const ratio = (img.naturalWidth / img.naturalHeight).toFixed(5);
                    deckWrap.style.setProperty('--portrait-ratio', ratio);
                }
            }
        };
    }

    // Initialize all stacked cards in the DOM (already stacked on load)
    function initStackedCards() {
        if (!deckEl) return;

        deckEl.innerHTML = screenshots.map((item, idx) => `
            <div class="stacked-card" data-index="${idx}" aria-label="Foto ${idx + 1}: ${item.title}">
                <img src="${item.url}" alt="${item.title}" class="stacked-card-img" loading="eager" />
            </div>
        `).join('');

        applyStackPoses();
        syncImageAspectRatio(currentTopIndex);
    }

    // Apply 3D rotation, offset, and z-index to each card based on distance from top card
    function applyStackPoses() {
        const cardElements = deckEl.querySelectorAll('.stacked-card');
        cardElements.forEach(card => {
            const idx = parseInt(card.getAttribute('data-index'), 10);
            const k = (idx - currentTopIndex + total) % total;
            const pose = getLayerPose(k, currentTopIndex);

            card.style.zIndex = pose.z;
            card.style.setProperty('--rot', `${pose.rot}deg`);
            card.style.setProperty('--off-x', `${pose.offX}px`);
            card.style.setProperty('--off-y', `${pose.offY}px`);
            card.style.transform = `translate(${pose.offX}px, ${pose.offY}px) rotate(${pose.rot}deg) scale(${pose.scale})`;
            card.style.opacity = k < 7 ? 1 : 0; // Keep visible stack crisp

            if (k === 0) {
                card.classList.add('is-top');
            } else {
                card.classList.remove('is-top');
                card.classList.remove('card-snap-in');
            }
        });
    }

    // Cycle to next stacked image with snappy Instagram-like spring effect
    function cycleToNextCard() {
        if (total <= 1) return;

        playSlideSound();

        currentTopIndex = (currentTopIndex + 1) % total;
        syncImageAspectRatio(currentTopIndex);
        applyStackPoses();

        // Trigger snappy tactile spring on the newly active top photo
        const newTopCard = deckEl.querySelector(`.stacked-card[data-index="${currentTopIndex}"]`);
        if (newTopCard) {
            newTopCard.classList.remove('card-snap-in');
            void newTopCard.offsetWidth; // Force reflow to retrigger animation cleanly
            newTopCard.classList.add('card-snap-in');
        }
    }

    // Attach click event to the deck wrap (clicking advances)
    if (deckWrap) {
        deckWrap.addEventListener('click', (e) => {
            e.preventDefault();
            cycleToNextCard();
        });
    }

    // Direct Fullscreen Button for mobile & desktop
    const deckFsBtn = document.getElementById('deck-fullscreen-btn');
    if (deckFsBtn) {
        deckFsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(screenshots, currentTopIndex);
        });
    }

    // Keyboard support: Space / ArrowRight to advance
    currentCycleToNextCardFn = cycleToNextCard;
    if (!isProjectKeydownAttached) {
        isProjectKeydownAttached = true;
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('stacked-images-deck')) return;
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            const modal = document.getElementById('lightbox-modal');
            if (modal && modal.classList.contains('active')) return;

            if (e.code === 'Space' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (currentCycleToNextCardFn) currentCycleToNextCardFn();
            }
        });
    }

    // Run initial setup
    initStackedCards();
    suppressBrowserUrlPreview();
}

let isProjectKeydownAttached = false;
let currentCycleToNextCardFn = null;

/* ==========================================================================
   7. LIGHTBOX MODAL FOR SCREENSHOTS
   ========================================================================== */
let activeGallery = [];
let currentImageIndex = 0;
let isLightboxDelegated = false;

function initLightbox() {
    if (isLightboxDelegated) return;
    isLightboxDelegated = true;

    document.addEventListener('click', (e) => {
        if (e.target.closest('#lightbox-close')) {
            closeLightbox();
            return;
        }
        if (e.target.closest('#lightbox-prev')) {
            e.stopPropagation();
            navigateLightbox(-1);
            return;
        }
        if (e.target.closest('#lightbox-next')) {
            e.stopPropagation();
            navigateLightbox(1);
            return;
        }
        const modal = document.getElementById('lightbox-modal');
        if (modal && e.target === modal) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('lightbox-modal');
        if (!modal || !modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(screenshots, index) {
    activeGallery = screenshots;
    currentImageIndex = index;
    updateLightboxContent();
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(dir) {
    if (!activeGallery.length) return;
    currentImageIndex = (currentImageIndex + dir + activeGallery.length) % activeGallery.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const imgEl = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const countEl = document.getElementById('lightbox-counter');
    
    const item = activeGallery[currentImageIndex];
    if (!item) return;
    
    if (imgEl) imgEl.src = item.url;
    if (captionEl) captionEl.textContent = '';
    if (countEl) countEl.textContent = '';
}

/* ==========================================================================
   8. CONTACT FORM & VALIDATION
   ========================================================================== */
let isContactFormAttached = false;
function initContactForm() {
    if (isContactFormAttached) return;
    isContactFormAttached = true;

    document.addEventListener('submit', (e) => {
        const form = e.target.closest('#contact-form');
        if (!form) return;
        e.preventDefault();
        
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const msgInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('contact-submit-btn');
        if (!nameInput || !emailInput || !msgInput || !submitBtn) return;
        
        let isValid = true;
        
        // Reset errors
        document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));
        
        // Validate Name
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            nameInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        }
        
        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        }
        
        // Validate Message
        if (!msgInput.value.trim() || msgInput.value.trim().length < 5) {
            msgInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = msgInput.value.trim();
        
        // Format WhatsApp Message with clean readable layout
        const formattedText = `Halo ALDI,\n\nNama: ${name}\nEmail: ${email}\n\nPesan / Rencana Projek:\n${message}`;
        const waUrl = `https://wa.me/6281529434240?text=${encodeURIComponent(formattedText)}`;
        
        // Open WhatsApp immediately in direct user gesture context (prevents iOS Safari & Chrome popup blocker)
        showToast('Mengalihkan ke WhatsApp...', 'purple');
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        
        // Loading state feedback
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            <span>Membuka WhatsApp...</span>
        `;
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            form.reset();
        }, 1000);
    });
}

/* ==========================================================================
   8B. PUBLIC COMMENTS & GUESTBOOK
   ========================================================================== */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let isCommentsAttached = false;
let currentComments = [];

async function fetchCommentsFromServer() {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.endsWith('.test');

    // On local environment, try PHP endpoint first (Laragon/Apache)
    if (isLocal) {
        try {
            const resp = await fetch('api-php/comments.php', { cache: 'no-cache' });
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.success && Array.isArray(data.comments)) {
                    return data.comments;
                }
            }
        } catch (e) {
            // Fallback to Vercel/localStorage
        }
    }

    // Try Vercel Serverless Function
    try {
        const respVercel = await fetch('/api/comments', { cache: 'no-cache' });
        if (respVercel.ok) {
            const data = await respVercel.json();
            if (data && data.success && Array.isArray(data.comments)) {
                return data.comments;
            }
        }
    } catch (e) {
        // Fallback to localStorage
    }

    // Fallback to localStorage
    try {
        const saved = localStorage.getItem('myporto_comments');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        // Ignore JSON error
    }

    return [];
}

async function postCommentToServer(name, comment) {
    const payload = JSON.stringify({ name, comment });
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.endsWith('.test');

    // On local environment, try PHP endpoint first
    if (isLocal) {
        try {
            const resp = await fetch('api-php/comments.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });
            if (resp.ok) {
                const data = await resp.json();
                if (data && data.success) {
                    return data;
                }
            }
        } catch (e) {
            // Fallback to Vercel/localStorage
        }
    }

    // Try Vercel serverless function
    try {
        const respVercel = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        if (respVercel.ok) {
            const data = await respVercel.json();
            if (data && data.success) {
                return data;
            }
        }
    } catch (e) {
        // Local fallback
    }

    // Local fallback when offline or static hosting
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDate = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    const localComment = {
        id: 'cmt_' + Date.now().toString(36),
        name: name,
        comment: comment,
        created_at: now.toISOString(),
        formatted_date: formattedDate
    };

    let localList = [];
    try {
        const saved = localStorage.getItem('myporto_comments');
        if (saved) localList = JSON.parse(saved) || [];
    } catch (e) {}

    localList.unshift(localComment);
    if (localList.length > 200) localList = localList.slice(0, 200);
    localStorage.setItem('myporto_comments', JSON.stringify(localList));

    return {
        success: true,
        message: 'Komentar berhasil disimpan!',
        comment: localComment,
        comments: localList
    };
}

function renderCommentsList(comments) {
    const listContainer = document.getElementById('comments-list');
    const badge = document.getElementById('comments-count-badge');
    if (!listContainer) return;

    currentComments = Array.isArray(comments) ? comments : [];

    if (badge) {
        badge.textContent = String(currentComments.length);
    }

    if (currentComments.length === 0) {
        listContainer.innerHTML = `
            <div class="comments-empty-state">
                <svg class="comments-empty-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="comments-empty-title">Belum Ada Komentar</div>
                <div class="comments-empty-desc">Jadilah yang pertama meninggalkan pesan atau salam di sini!</div>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = currentComments.map(cmt => {
        const initial = (cmt.name || '?').trim().charAt(0).toUpperCase() || '?';
        const author = escapeHTML(cmt.name || 'Anonim');
        let rawDate = (cmt.formatted_date || '').trim();
        if (rawDate.includes(',')) {
            rawDate = rawDate.split(',')[0].trim();
        }
        const dateStr = escapeHTML(rawDate || 'Baru saja');
        const msg = escapeHTML(cmt.comment || '');

        return `
            <article class="comment-card-item" data-id="${escapeHTML(cmt.id || '')}">
                <div class="comment-avatar" aria-hidden="true">${initial}</div>
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author-name">${author}</span>
                        <time class="comment-time">${dateStr}</time>
                    </div>
                    <div class="comment-message">${msg}</div>
                </div>
            </article>
        `;
    }).join('');
}

export function initCommentsSection() {
    const form = document.getElementById('comment-form');
    const listContainer = document.getElementById('comments-list');

    if (!form && !listContainer) return;

    // Initial load
    if (listContainer) {
        if (!listContainer.hasChildNodes() || listContainer.children.length === 0) {
            listContainer.innerHTML = `
                <div class="comments-loading-state">
                    <div class="comments-spinner" aria-hidden="true"></div>
                    <span>Memuat komentar...</span>
                </div>
            `;
        }

        fetchCommentsFromServer().then(comments => {
            renderCommentsList(comments);
            try {
                localStorage.setItem('myporto_comments', JSON.stringify(comments));
            } catch (e) {}
        }).catch(() => {
            listContainer.innerHTML = `
                <div class="comments-error-state">
                    <span>Gagal memuat komentar.</span>
                    <button type="button" class="comments-retry-btn" id="comments-retry-btn">Coba Lagi</button>
                </div>
            `;
            const retryBtn = document.getElementById('comments-retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => initCommentsSection());
            }
        });
    }

    // Attach listeners once
    if (isCommentsAttached) return;
    isCommentsAttached = true;

    // Submit listener via event delegation on document
    document.addEventListener('submit', async (e) => {
        const activeForm = e.target.closest('#comment-form');
        if (!activeForm) return;
        e.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const textInput = document.getElementById('comment-text');
        const submitBtn = document.getElementById('comment-submit-btn');
        if (!nameInput || !textInput || !submitBtn) return;

        let isValid = true;

        // Reset errors
        activeForm.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

        // Validate name (2 - 50 chars)
        const nameVal = nameInput.value.trim();
        if (nameVal.length < 2 || nameVal.length > 50) {
            nameInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        }

        // Validate comment (3 - 500 chars)
        const textVal = textInput.value.trim();
        if (textVal.length < 3 || textVal.length > 500) {
            textInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        }

        if (!isValid) return;

        // Loading state on button
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            <span>Mengirim...</span>
        `;

        try {
            const res = await postCommentToServer(nameVal, textVal);
            if (res && res.success) {
                showToast(res.message || 'Komentar berhasil dikirim!', 'purple');
                activeForm.reset();

                if (Array.isArray(res.comments)) {
                    renderCommentsList(res.comments);
                    try {
                        localStorage.setItem('myporto_comments', JSON.stringify(res.comments));
                    } catch (e) {}
                } else {
                    const freshComments = await fetchCommentsFromServer();
                    renderCommentsList(freshComments);
                }

                // Scroll to top of comments list smoothly
                const commentsListEl = document.getElementById('comments-list');
                if (commentsListEl) {
                    commentsListEl.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                showToast(res?.error || 'Gagal mengirim komentar.', 'purple');
            }
        } catch (err) {
            console.error('Submit comment error:', err);
            showToast('Terjadi kesalahan saat mengirim komentar.', 'purple');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

/* ==========================================================================
   9. COPY TO CLIPBOARD BUTTONS
   ========================================================================== */
let isCopyButtonsAttached = false;
function initCopyButtons() {
    if (isCopyButtonsAttached) return;
    isCopyButtonsAttached = true;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if (!btn) return;
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Tersalin: ${textToCopy}`, 'purple');
        }).catch(() => {
            showToast('Gagal menyalin text.');
        });
    });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'purple') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'purple' ? 'purple' : ''}`;
    toast.innerHTML = `
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:currentColor;"></span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3200);
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (!menuBtn || !navLinks) return;

    menuBtn.onclick = (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('is-open');
        menuBtn.classList.toggle('active', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.site-header')) {
            if (navLinks.classList.contains('is-open')) {
                navLinks.classList.remove('is-open');
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ==========================================================================
   ACCESSIBLE SPA ROUTER (Preserves Real Links & Audio Across Pages)
   ========================================================================== */
let isRouterAttached = false;
function initSPARouter() {
    if (isRouterAttached) return;
    isRouterAttached = true;

    // Single unified click listener for internal navigation links and clean external links
    document.addEventListener('click', (e) => {
        // 1. Clean External links via [data-external-href] (prevents browser bottom-left URL preview bar)
        const extLink = e.target.closest('[data-external-href]');
        if (extLink) {
            const extUrl = extLink.getAttribute('data-external-href');
            if (extUrl) {
                e.preventDefault();
                if (extUrl.startsWith('mailto:') || extUrl.startsWith('tel:')) {
                    window.location.href = extUrl;
                } else {
                    window.open(extUrl, '_blank', 'noopener,noreferrer');
                }
                return;
            }
        }

        // 2. Navigation links (a[href] or [data-href])
        const link = e.target.closest('a[href], [data-href]');
        if (!link) return;

        const rawHref = link.getAttribute('data-href') || link.getAttribute('href');
        if (!rawHref) return;

        // Skip non-SPA links: new tab, protocols, or external URLs
        if (
            link.getAttribute('target') === '_blank' ||
            rawHref.startsWith('http://') ||
            rawHref.startsWith('https://') ||
            rawHref.startsWith('mailto:') ||
            rawHref.startsWith('tel:') ||
            rawHref.startsWith('javascript:')
        ) {
            return;
        }

        // Allow user modification keys (Ctrl/Cmd click opens in new tab natively)
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
            return;
        }

        // Close mobile menu if open
        const navLinks = document.getElementById('nav-links');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (navLinks && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            if (menuBtn) {
                menuBtn.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        }

        // Check if hash-only jump on the same page
        if (rawHref.startsWith('#')) {
            const currentPath = window.location.pathname;
            const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
            if (isHomePage) {
                const targetEl = document.querySelector(rawHref);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', rawHref);
                    return;
                }
            }
        }

        // SPA Navigation for index.html / project.html
        e.preventDefault();
        navigateToPage(rawHref, true);
    });

    // Keyboard accessibility support: Enter key on focused [data-href] or [data-external-href]
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const el = e.target.closest && e.target.closest('[data-href], [data-external-href]');
            if (el && !el.matches('input, textarea, button')) {
                e.preventDefault();
                el.click();
            }
        }
    });

    // Handle browser back and forward buttons seamlessly
    window.addEventListener('popstate', () => {
        navigateToPage(window.location.href, false);
    });
}

function suppressBrowserUrlPreview(root = document) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('a[href]').forEach(link => {
        const rawHref = link.getAttribute('href');
        if (!rawHref || rawHref.startsWith('javascript:')) return;

        if (
            link.getAttribute('target') === '_blank' ||
            rawHref.startsWith('http://') ||
            rawHref.startsWith('https://') ||
            rawHref.startsWith('mailto:') ||
            rawHref.startsWith('tel:')
        ) {
            link.setAttribute('data-external-href', rawHref);
        } else {
            link.setAttribute('data-href', rawHref);
        }

        link.removeAttribute('href');
        if (!link.hasAttribute('tabindex')) link.setAttribute('tabindex', '0');
        if (!link.hasAttribute('role')) link.setAttribute('role', 'link');
    });
}

/* ==========================================================================
   11. SEAMLESS SPA NAVIGATION & CONTINUOUS BACKGROUND AUDIO PRESERVATION
   ========================================================================== */
const pageCache = new Map();

async function navigateToPage(targetUrl, pushState = true) {
    if (!targetUrl) return;

    const currentUrl = new URL(window.location.href);
    const resolvedUrl = new URL(targetUrl, window.location.href);

    // Cross-origin link: let normal browser navigation take over
    if (resolvedUrl.origin !== currentUrl.origin) {
        window.location.href = resolvedUrl.href;
        return;
    }

    // Hash link on the same path
    if (resolvedUrl.pathname === currentUrl.pathname && !resolvedUrl.search && resolvedUrl.hash) {
        const targetEl = document.querySelector(resolvedUrl.hash);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            if (pushState) history.pushState(null, '', resolvedUrl.hash);
            return;
        }
    }

    // Check if target is project page or index page
    const isTargetProject = resolvedUrl.pathname.endsWith('project.html') || resolvedUrl.search.includes('id=');
    const isCurrentProject = currentUrl.pathname.endsWith('project.html') || currentUrl.search.includes('id=');

    // Case: Switching between projects while already on project.html
    if (isTargetProject && isCurrentProject && document.getElementById('project-detail-container')) {
        if (pushState) {
            history.pushState({ url: resolvedUrl.href }, '', resolvedUrl.href);
        }
        initProjectDetailPage();
        window.scrollTo({ top: 0, behavior: 'instant' });
        updateAudioUI(isAudioPlaying);
        suppressBrowserUrlPreview();
        return;
    }

    try {
        let fetchPath = resolvedUrl.pathname;
        if (fetchPath.endsWith('/') || fetchPath === '') {
            fetchPath += 'index.html';
        }

        let htmlText = pageCache.get(fetchPath);
        if (!htmlText) {
            const resp = await fetch(fetchPath, { cache: 'no-cache' });
            if (!resp.ok) {
                window.location.href = resolvedUrl.href;
                return;
            }
            htmlText = await resp.text();
            pageCache.set(fetchPath, htmlText);
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const currentMain = document.querySelector('main');
        if (currentMain) {
            currentMain.classList.add('page-transitioning');
        }

        await new Promise(resolve => setTimeout(resolve, 50));

        if (pushState) {
            history.pushState({ url: resolvedUrl.href }, '', resolvedUrl.href);
        }

        if (doc.title) {
            document.title = doc.title;
        }

        const newMain = doc.querySelector('main');
        let headerEl = document.querySelector('.site-header');
        let footerEl = document.querySelector('.site-footer');

        if (isTargetProject) {
            if (headerEl) headerEl.style.display = 'none';
            if (footerEl) footerEl.style.display = 'none';

            let lightbox = document.getElementById('lightbox-modal');
            if (!lightbox) {
                const fetchedLightbox = doc.getElementById('lightbox-modal');
                if (fetchedLightbox) {
                    document.body.appendChild(fetchedLightbox.cloneNode(true));
                }
            }
        } else {
            if (!headerEl) {
                const fetchedHeader = doc.querySelector('.site-header');
                if (fetchedHeader) {
                    document.body.insertBefore(fetchedHeader.cloneNode(true), currentMain || document.body.firstChild);
                    headerEl = document.querySelector('.site-header');
                }
            }
            if (headerEl) headerEl.style.display = '';

            if (!footerEl) {
                const fetchedFooter = doc.querySelector('.site-footer');
                if (fetchedFooter) {
                    document.body.appendChild(fetchedFooter.cloneNode(true));
                    footerEl = document.querySelector('.site-footer');
                }
            }
            if (footerEl) footerEl.style.display = '';
        }

        if (newMain && currentMain) {
            currentMain.replaceWith(newMain.cloneNode(true));
        } else if (newMain) {
            document.body.appendChild(newMain.cloneNode(true));
        }

        const swappedMain = document.querySelector('main');
        if (swappedMain) {
            swappedMain.classList.remove('page-transitioning');
        }

        const welcomeLoader = document.getElementById('welcome-loader-backdrop');
        if (welcomeLoader) {
            welcomeLoader.classList.add('is-hidden');
            document.body.classList.remove('welcome-lock');
        }

        if (!isTargetProject) {
            initMobileMenu();
        }

        if (isTargetProject) {
            initProjectDetailPage();
            initLightbox();
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            if (document.getElementById('projects-grid-container')) {
                renderProjectsGrid();
            }
            initNavbarScroll();
            initLanyardCard();
            initContactForm();
            initCommentsSection();
            initScrollAndEntranceAnimations();
            setTimeout(revealHeroAndNavbar, 60);

            if (resolvedUrl.hash) {
                setTimeout(() => {
                    const targetEl = document.querySelector(resolvedUrl.hash);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 60);
            } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }

        updateAudioUI(isAudioPlaying);
        suppressBrowserUrlPreview();

    } catch (err) {
        console.error('Seamless navigation error, using standard fallback:', err);
        window.location.href = resolvedUrl.href;
    }
}

export function initPagePrefetch() {
    setTimeout(async () => {
        try {
            const indexResp = await fetch('index.html', { cache: 'no-cache' });
            if (indexResp.ok) {
                const url = new URL('index.html', window.location.href).pathname;
                pageCache.set(url, await indexResp.text());
            }
            const projResp = await fetch('project.html', { cache: 'no-cache' });
            if (projResp.ok) {
                const url = new URL('project.html', window.location.href).pathname;
                pageCache.set(url, await projResp.text());
            }
        } catch (e) {}
    }, 600);
}

/* ==========================================================================
   12. SCROLL & ENTRANCE REVEAL SYSTEM (NAVBAR, HERO, BIO, TEKNOLOGI PILIHAN)
   ========================================================================== */
let scrollObserverInstance = null;

export function revealHeroAndNavbar() {
    const nav = document.querySelector('.site-header.reveal-nav');
    const heroContent = document.querySelector('.hero-content');
    const heroVisuals = document.querySelector('.hero-visuals');

    if (nav) nav.classList.add('is-revealed');
    if (heroContent) heroContent.classList.add('is-revealed');
    if (heroVisuals) heroVisuals.classList.add('is-revealed');
}

export function initScrollAndEntranceAnimations() {
    // Flag document that JS animation system is active for progressive enhancement
    document.documentElement.classList.add('js-reveal-active');

    const bioText = document.querySelector('.bio-text-block');
    const skillsCol = document.querySelector('.skills-column');
    const projectsHead = document.querySelector('#projects .section-head');
    const projectsGrid = document.getElementById('projects-grid-container');
    const contactCards = document.querySelectorAll('.contact-card');

    if (!bioText && !skillsCol && !projectsHead && !projectsGrid && contactCards.length === 0) return;

    if ('IntersectionObserver' in window) {
        if (scrollObserverInstance) {
            scrollObserverInstance.disconnect();
        }

        scrollObserverInstance = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.12
        });

        if (bioText && !bioText.classList.contains('is-revealed')) {
            scrollObserverInstance.observe(bioText);
        }
        if (skillsCol && !skillsCol.classList.contains('is-revealed')) {
            scrollObserverInstance.observe(skillsCol);
        }
        if (projectsHead && !projectsHead.classList.contains('is-revealed')) {
            scrollObserverInstance.observe(projectsHead);
        }
        if (projectsGrid && !projectsGrid.classList.contains('is-revealed')) {
            scrollObserverInstance.observe(projectsGrid);
        }
        contactCards.forEach(card => {
            if (!card.classList.contains('is-revealed')) {
                scrollObserverInstance.observe(card);
            }
        });
    } else {
        // Fallback for older browsers
        if (bioText) bioText.classList.add('is-revealed');
        if (skillsCol) skillsCol.classList.add('is-revealed');
        if (projectsHead) projectsHead.classList.add('is-revealed');
        if (projectsGrid) projectsGrid.classList.add('is-revealed');
        contactCards.forEach(card => card.classList.add('is-revealed'));
    }

    // Check if welcome loader is active
    const welcomeBackdrop = document.getElementById('welcome-loader-backdrop');
    const isLoaderVisible = welcomeBackdrop && 
                            !welcomeBackdrop.classList.contains('is-hidden') && 
                            sessionStorage.getItem('welcome_seen') !== 'true';

    // If loader is already done/hidden or not present, reveal hero and navbar immediately
    if (!isLoaderVisible) {
        setTimeout(revealHeroAndNavbar, 80);
    }
}

// Start Application Lifecycle
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
