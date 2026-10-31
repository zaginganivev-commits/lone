/**
 * ==========================================================================
 * ROMANTIC LOVE LETTER ANIMATION (10s Masterpiece)
 * Senior Frontend & Backend Engineer Quality
 * Features:
 *   - 10-Second precision choreographed sequence
 *   - Virtual laptop mouse cursor pathing and authentic click
 *   - 3D envelope fold and sliding letter mechanics
 *   - High-performance HTML5 Canvas 2D/3D physics particle engine
 *   - Rich pink (#ff2a85) & red (#ff0844) heart explosions
 *   - Web Audio API procedural sound effects (zero external assets needed)
 *   - Interactive touch/click heart bursts & replay system
 * ==========================================================================
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // DOM ELEMENTS
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    const envelope = document.getElementById('envelope');
    const heartSeal = document.getElementById('heart-seal');
    const letterCard = document.getElementById('letter-card');
    const laptopCursor = document.getElementById('laptop-cursor');
    const timelineFill = document.getElementById('timeline-fill');
    const timelineTimer = document.getElementById('timeline-timer');
    const timelineLabel = document.getElementById('timeline-label');
    const replayBtn = document.getElementById('replay-btn');
    const audioToggle = document.getElementById('audio-toggle');
    const soundOnIcon = document.getElementById('sound-on-icon');
    const soundOffIcon = document.getElementById('sound-off-icon');
    const soundText = document.getElementById('sound-text');

    // -------------------------------------------------------------------------
    // WEB AUDIO API SOUND GENERATOR
    // Procedural sound synth (no external mp3 files required)
    // -------------------------------------------------------------------------
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.enabled = true;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playClick() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.09);
        }

        playChimeArpeggio() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            // Romantic pentatonic chord sequence: C5, E5, G5, B5, C6, E6
            const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
            const startTime = this.ctx.currentTime;

            notes.forEach((freq, idx) => {
                const noteTime = startTime + idx * 0.11;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.001, noteTime);
                gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.85);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.9);
            });
        }

        playSwoosh() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(580, now + 0.45);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.52);
        }

        playSparkle() {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const freqs = [1200, 1500, 1800, 2100];
            const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];

            osc.type = 'sine';
            osc.frequency.setValueAtTime(chosenFreq, now);

            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        }

        toggle() {
            this.enabled = !this.enabled;
            if (this.enabled) {
                this.init();
                soundOnIcon.classList.remove('hidden');
                soundOffIcon.classList.add('hidden');
                soundText.textContent = 'Ovoz: Yoqilgan';
            } else {
                soundOnIcon.classList.add('hidden');
                soundOffIcon.classList.remove('hidden');
                soundText.textContent = "Ovoz: O'chirilgan";
            }
        }
    }

    const sound = new SoundEngine();
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.toggle();
    });

    // -------------------------------------------------------------------------
    // CANVAS RESIZE & PARTICLE ENGINE
    // -------------------------------------------------------------------------
    let canvasWidth = (canvas.width = window.innerWidth);
    let canvasHeight = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
    });

    // Vibrant Red and Hot Pink Color Palette
    const HEART_COLORS = [
        '#ff0844', // Radiant Ruby Red
        '#e60039', // Crimson Passion Red
        '#ff1744', // Electric Red
        '#ff2a85', // Neon Pink
        '#ff4081', // Vivid Hot Pink
        '#ff65a5', // Soft Candy Pink
        '#ff85b3', // Pastel Rose Pink
        '#ff0055', // Magenta Red
        '#ffccd9', // Blush Pearl Pink
        '#ffffff'  // Sparkling Diamond White
    ];

    // Mathematical Bezier Heart Drawing
    function drawHeart(c, x, y, size, color, alpha, rotation, flipX) {
        c.save();
        c.translate(x, y);
        c.rotate(rotation);
        c.scale(flipX, 1);
        c.globalAlpha = Math.max(0, Math.min(1, alpha));
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 10;

        c.beginPath();
        const topY = size * 0.28;
        c.moveTo(0, topY);
        // Left lobe
        c.bezierCurveTo(
            -size * 0.55, -size * 0.45,
            -size * 0.95, size * 0.35,
            0, size
        );
        // Right lobe
        c.bezierCurveTo(
            size * 0.95, size * 0.35,
            size * 0.55, -size * 0.45,
            0, topY
        );
        c.closePath();
        c.fill();
        c.restore();
    }

    // Sparkle Particle
    class StarSparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.size = Math.random() * 2.5 + 1;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.speed = Math.random() * 0.03 + 0.01;
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            this.angle += this.speed;
            this.currentAlpha = this.alpha * (0.5 + 0.5 * Math.sin(this.angle));
        }

        draw(c) {
            c.save();
            c.fillStyle = 'rgba(255, 200, 220, ' + this.currentAlpha + ')';
            c.shadowColor = '#ff65a5';
            c.shadowBlur = 6;
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fill();
            c.restore();
        }
    }

    // Heart Particle with 3D physics flutter & velocity
    class HeartParticle {
        constructor(x, y, options = {}) {
            this.x = x;
            this.y = y;
            const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
            const speed = options.speed !== undefined ? options.speed : Math.random() * 12 + 3;

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (options.upwardBoost || 4);

            this.size = options.size || (Math.random() * 18 + 12);
            this.color = options.color || HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
            this.alpha = 1;
            this.decay = options.decay || (Math.random() * 0.007 + 0.004);

            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.12;

            this.flip = 1;
            this.flipSpeed = (Math.random() - 0.5) * 0.14;

            this.gravity = options.gravity !== undefined ? options.gravity : 0.08;
            this.drag = options.drag || 0.975;
            this.isAlive = true;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= this.drag;
            this.vy *= this.drag;

            this.rotation += this.rotSpeed;
            this.flip = Math.cos(this.rotation * 1.5);

            this.alpha -= this.decay;
            if (this.alpha <= 0) {
                this.isAlive = false;
            }
        }

        draw(c) {
            if (!this.isAlive) return;
            drawHeart(c, this.x, this.y, this.size, this.color, this.alpha, this.rotation, this.flip);
        }
    }

    const sparkles = Array.from({ length: 45 }, () => new StarSparkle());
    let heartParticles = [];

    // Trigger explosive burst of hearts
    function triggerHeartExplosion(originX, originY, count = 180) {
        sound.playChimeArpeggio();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 14 + 3;
            const size = Math.random() * 22 + 10;
            const upwardBoost = Math.random() * 7 + 2;

            heartParticles.push(
                new HeartParticle(originX, originY, {
                    angle: angle,
                    speed: speed,
                    size: size,
                    upwardBoost: upwardBoost,
                    gravity: 0.09,
                    decay: Math.random() * 0.005 + 0.003
                })
            );
        }
    }

    // Continuous floating hearts fountain
    function spawnFountainHeart(originX, originY) {
        const spreadX = (Math.random() - 0.5) * 140;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
        const speed = Math.random() * 5 + 3;

        heartParticles.push(
            new HeartParticle(originX + spreadX, originY, {
                angle: angle,
                speed: speed,
                size: Math.random() * 16 + 10,
                upwardBoost: 5,
                gravity: -0.04, // Float upward like helium
                decay: Math.random() * 0.006 + 0.003,
                drag: 0.99
            })
        );
    }

    // Interactive heart burst on screen click / touch
    window.addEventListener('pointerdown', (e) => {
        // Prevent clicking controls from spawning unwanted heavy bursts
        if (e.target.closest('.timeline-container') || e.target.closest('.top-bar')) {
            return;
        }
        sound.init();
        sound.playSparkle();

        const count = 22;
        for (let i = 0; i < count; i++) {
            heartParticles.push(
                new HeartParticle(e.clientX, e.clientY, {
                    speed: Math.random() * 8 + 2,
                    size: Math.random() * 18 + 8,
                    upwardBoost: Math.random() * 4 + 1,
                    decay: 0.015
                })
            );
        }
    });

    // -------------------------------------------------------------------------
    // 10-SECOND CHOREOGRAPHED TIMELINE
    // -------------------------------------------------------------------------
    const TOTAL_DURATION_MS = 10000; // Exact 10 seconds
    let startTime = null;
    let isRunning = false;
    let hasClicked = false;
    let hasBurstHearts = false;
    let fountainActive = false;

    // Timeline phases definition
    const PHASES = [
        { time: 0.0, label: "💌 Maxsus maktub tayyorlanmoqda..." },
        { time: 1.2, label: "🖱️ Sichqoncha harakatlanmoqda..." },
        { time: 3.4, label: "✨ Muhr ustida bosish amalga oshmoqda..." },
        { time: 4.0, label: "💖 Xat sekin ochilmoqda..." },
        { time: 5.2, label: "🌹 I LOVE YOU — Yurakchalar yog'dusi! 🎉" },
        { time: 7.5, label: "✨ Cheksiz mehr va muhabbat yog'dusi..." },
        { time: 10.0, label: "❤️ 10s Tugadi! Xohlagancha qayta tomosha qiling." }
    ];

    function updateStatusLabel(currentSec) {
        for (let i = PHASES.length - 1; i >= 0; i--) {
            if (currentSec >= PHASES[i].time) {
                timelineLabel.textContent = PHASES[i].label;
                break;
            }
        }
    }

    // Helper for smooth easing (Cubic In/Out)
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    // Get current target coordinates for the heart seal
    function getSealCoordinates() {
        const rect = heartSeal.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // Update Virtual Laptop Cursor Position
    function updateCursor(elapsedMs) {
        const sealPos = getSealCoordinates();
        const startX = window.innerWidth * 0.82;
        const startY = window.innerHeight * 0.85;

        // Mouse enters at 1.2s and glides towards seal until 3.4s
        if (elapsedMs < 1200) {
            laptopCursor.style.opacity = '0';
            laptopCursor.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
            return;
        }

        if (elapsedMs >= 1200 && elapsedMs < 3400) {
            const progress = (elapsedMs - 1200) / 2200;
            const eased = easeInOutCubic(progress);

            // Curve path with intermediate control offset
            const midX = (startX + sealPos.x) / 2 - 30;
            const midY = (startY + sealPos.y) / 2 + 50;

            // Quadratic bezier interpolation
            const inv = 1 - eased;
            const curX = inv * inv * startX + 2 * inv * eased * midX + eased * eased * sealPos.x;
            const curY = inv * inv * startY + 2 * inv * eased * midY + eased * eased * sealPos.y;

            laptopCursor.style.opacity = '1';
            laptopCursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        } else if (elapsedMs >= 3400 && elapsedMs < 4200) {
            // Hovered directly on seal
            laptopCursor.style.opacity = '1';
            laptopCursor.style.transform = `translate3d(${sealPos.x}px, ${sealPos.y}px, 0)`;

            // Click down at 3.5s
            if (elapsedMs >= 3500 && !hasClicked) {
                hasClicked = true;
                laptopCursor.classList.add('clicking');
                sound.playClick();
            }

            // Release click at 3.9s
            if (elapsedMs >= 3900 && laptopCursor.classList.contains('clicking')) {
                laptopCursor.classList.remove('clicking');
            }
        } else if (elapsedMs >= 4200 && elapsedMs < 5000) {
            // Mouse drifts away and fades out so letter is 100% center of focus
            const exitProgress = (elapsedMs - 4200) / 800;
            const curX = sealPos.x + exitProgress * 100;
            const curY = sealPos.y + exitProgress * 80;
            const opacity = 1 - exitProgress;

            laptopCursor.style.opacity = opacity.toString();
            laptopCursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        } else {
            laptopCursor.style.opacity = '0';
        }
    }

    // Main Animation Frame Step
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const clampedElapsed = Math.min(elapsed, TOTAL_DURATION_MS);
        const currentSeconds = clampedElapsed / 1000;

        // 1. Update Timeline Bar & Timer HUD
        const progressPercent = (clampedElapsed / TOTAL_DURATION_MS) * 100;
        timelineFill.style.width = progressPercent.toFixed(1) + '%';

        const displaySec = currentSeconds.toFixed(1);
        timelineTimer.textContent = `00:${displaySec.padStart(4, '0')} / 00:10.0`;
        updateStatusLabel(currentSeconds);

        // 2. Virtual Cursor Navigation
        updateCursor(clampedElapsed);

        // 3. Envelope Flap Opens at 3.9s
        if (clampedElapsed >= 3900 && !envelope.classList.contains('is-open')) {
            envelope.classList.add('is-open');
            sound.playSwoosh();
        }

        // 4. Massive Heart Burst Launches at 5.2s (when letter rises)
        if (clampedElapsed >= 5200 && !hasBurstHearts) {
            hasBurstHearts = true;
            fountainActive = true;
            const sealPos = getSealCoordinates();
            triggerHeartExplosion(sealPos.x, sealPos.y - 40, 220);
        }

        // 5. Continuous Romantic Fountain Stream (from 5.5s to 10.0s)
        if (fountainActive && clampedElapsed < TOTAL_DURATION_MS) {
            if (Math.random() < 0.45) {
                const sealPos = getSealCoordinates();
                spawnFountainHeart(sealPos.x, sealPos.y - 30);
            }
        }

        // 6. Draw Canvas Particles & Background Stars
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Update & Draw Background Stars
        for (let i = 0; i < sparkles.length; i++) {
            sparkles[i].update();
            sparkles[i].draw(ctx);
        }

        // Update & Draw Heart Particles
        for (let i = heartParticles.length - 1; i >= 0; i--) {
            const p = heartParticles[i];
            p.update();
            p.draw(ctx);
            if (!p.isAlive) {
                heartParticles.splice(i, 1);
            }
        }

        // 7. Completion Check (10.0 seconds reached)
        if (clampedElapsed >= TOTAL_DURATION_MS) {
            replayBtn.classList.add('active');
            // Keep the canvas animation alive for lingering hearts & interactive clicks
            requestAnimationFrame(renderLoopIdle);
            return;
        }

        requestAnimationFrame(animate);
    }

    // Ongoing Idle Render Loop (after 10s, handles user clicks and ambient particles)
    function renderLoopIdle() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < sparkles.length; i++) {
            sparkles[i].update();
            sparkles[i].draw(ctx);
        }

        for (let i = heartParticles.length - 1; i >= 0; i--) {
            const p = heartParticles[i];
            p.update();
            p.draw(ctx);
            if (!p.isAlive) {
                heartParticles.splice(i, 1);
            }
        }

        if (isRunning) return; // Prevent double loops if replaying
        requestAnimationFrame(renderLoopIdle);
    }

    // -------------------------------------------------------------------------
    // START / REPLAY FUNCTIONALITY
    // -------------------------------------------------------------------------
    function startAnimation() {
        // Reset states
        isRunning = true;
        startTime = null;
        hasClicked = false;
        hasBurstHearts = false;
        fountainActive = false;
        heartParticles = [];

        envelope.classList.remove('is-open');
        laptopCursor.classList.remove('clicking');
        laptopCursor.style.opacity = '0';
        replayBtn.classList.remove('active');
        timelineFill.style.width = '0%';
        timelineTimer.textContent = '00:00.0 / 00:10.0';

        // Brief delay for CSS transition reset before running timeline
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const manualT = urlParams.get('t');
            if (manualT !== null) {
                // If manual debug time is passed in URL (?t=6000), set fixed timestamp
                const fixedMs = parseFloat(manualT);
                startTime = performance.now() - fixedMs;
            }
            requestAnimationFrame(animate);
        }, 150);
    }

    replayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.init();
        startAnimation();
    });

    // Also allow clicking envelope seal directly to trigger/advance if user wants immediate action
    heartSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.init();
        if (!envelope.classList.contains('is-open')) {
            envelope.classList.add('is-open');
            sound.playClick();
            sound.playSwoosh();
            const pos = getSealCoordinates();
            triggerHeartExplosion(pos.x, pos.y, 160);
        }
    });

    // Auto-start on load
    window.addEventListener('DOMContentLoaded', () => {
        startAnimation();
    });

})();
