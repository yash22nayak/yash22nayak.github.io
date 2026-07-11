(function () {
    'use strict';

    document.documentElement.classList.add('js');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;
    var hasGsap = typeof gsap !== 'undefined';

    if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    /* ---------- Smooth scroll (Lenis) ---------- */
    var lenis = null;
    if (!reduceMotion && typeof Lenis !== 'undefined' && hasGsap) {
        lenis = new Lenis({ lerp: 0.1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    /* ---------- Anchor links through Lenis ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            closeMenu();
            if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
            else target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ---------- Split [data-words] into word spans ---------- */
    document.querySelectorAll('[data-words]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    });

    /* ---------- Preloader ---------- */
    var preloader = document.querySelector('.preloader');
    function revealPage() {
        if (!hasGsap) { preloader.classList.add('is-done'); return; }
        gsap.timeline({ onComplete: function () { preloader.classList.add('is-done'); } })
            .to(preloader, { yPercent: -118, duration: 0.8, ease: 'power3.inOut' })
            .add(heroIntro, '-=0.45');
    }
    if (reduceMotion || !hasGsap || !preloader) {
        if (preloader) preloader.classList.add('is-done');
        heroIntro();
    } else {
        var word = preloader.querySelector('.preloader__text');
        var greetings = ['Hello', 'नमस्ते', 'Bonjour', 'Ciao', 'こんにちは', 'Hola'];
        var i = 0;
        gsap.to('.preloader__word', { opacity: 1, duration: 0.4 });
        var cycle = setInterval(function () {
            i++;
            if (i >= greetings.length) { clearInterval(cycle); revealPage(); return; }
            word.textContent = greetings[i];
        }, i === 0 ? 260 : 200);
    }

    /* ---------- Hero intro + reveals ---------- */
    function heroIntro() {
        if (!hasGsap || reduceMotion) return;
        gsap.to('.hero [data-reveal]', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 });
        gsap.from('.hero__marquee-track', { yPercent: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.15 });
    }

    if (hasGsap && !reduceMotion) {
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            if (el.closest('.hero')) return; // hero handled in intro
            gsap.to(el, {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });
        document.querySelectorAll('[data-words]').forEach(function (el) {
            gsap.to(el.querySelectorAll('.w'), {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.025,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true }
            });
        });
    } else {
        // No JS animation support: make everything visible
        document.querySelectorAll('[data-reveal], [data-words] .w').forEach(function (el) {
            el.style.opacity = 1; el.style.transform = 'none';
        });
    }

    /* ---------- Hero name marquee (direction follows scroll) ---------- */
    var track = document.querySelector('.hero__marquee-track');
    if (track && hasGsap && !reduceMotion) {
        var x = 0, dir = -1, speed = 0.05, lastScroll = 0;
        gsap.ticker.add(function () {
            var sc = window.scrollY;
            if (sc !== lastScroll) { dir = sc > lastScroll ? -1 : 1; lastScroll = sc; }
            x += speed * dir;
            if (x <= -25) x += 25;
            if (x > 0) x -= 25;
            track.style.transform = 'translateX(' + x + '%)';
        });
    }

    /* ---------- Floating menu button ---------- */
    var menuBtn = document.querySelector('.menu-btn');
    var overlay = document.querySelector('.nav-overlay');
    var menuOpen = false;

    if (hasGsap && !reduceMotion) gsap.set(overlay, { x: 0, xPercent: 105 });

    var alwaysShowBtn = window.innerWidth <= 900;
    if (hasGsap && !reduceMotion && !alwaysShowBtn) {
        ScrollTrigger.create({
            start: function () { return window.innerHeight * 0.9 + ' top'; },
            onEnter: function () { gsap.to(menuBtn, { scale: 1, duration: 0.35, ease: 'power3.out' }); },
            onLeaveBack: function () { if (!menuOpen) gsap.to(menuBtn, { scale: 0, duration: 0.35, ease: 'power3.in' }); }
        });
    } else {
        menuBtn.style.transform = 'scale(1)';
    }

    function openMenu() {
        menuOpen = true;
        menuBtn.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.style.visibility = 'visible';
        if (hasGsap && !reduceMotion) {
            gsap.to(menuBtn, { scale: 1, duration: 0.3 });
            gsap.timeline()
                .to(overlay, { xPercent: 0, duration: 0.7, ease: 'power3.inOut' }, 0)
                .from('.nav-overlay__links a', { x: 80, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, '-=0.3');
        } else {
            overlay.style.transform = 'translateX(0)';
        }
    }

    function closeMenu() {
        if (!menuOpen) return;
        menuOpen = false;
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        if (hasGsap && !reduceMotion) {
            gsap.to(overlay, {
                xPercent: 105, duration: 0.6, ease: 'power3.inOut',
                onComplete: function () { overlay.style.visibility = 'hidden'; }
            });
        } else {
            overlay.style.transform = 'translateX(105%)';
            overlay.style.visibility = 'hidden';
        }
    }

    menuBtn.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', function (e) {
        if (menuOpen && !overlay.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });

    /* ---------- Magnetic elements ---------- */
    if (finePointer && hasGsap && !reduceMotion) {
        document.querySelectorAll('.magnetic').forEach(function (el) {
            var strength = 0.35;
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var relX = e.clientX - r.left - r.width / 2;
                var relY = e.clientY - r.top - r.height / 2;
                gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.4, ease: 'power3.out' });
            });
            el.addEventListener('mouseleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* ---------- Work list: cursor-following preview ---------- */
    var preview = document.querySelector('.work__preview');
    var previewImg = preview ? preview.querySelector('img') : null;
    if (preview && finePointer && hasGsap && !reduceMotion && window.innerWidth > 900) {
        var px = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
        var py = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
        var workList = document.querySelector('.work__list');

        window.addEventListener('mousemove', function (e) {
            px(e.clientX - preview.offsetWidth / 2);
            py(e.clientY - preview.offsetHeight / 2);
        });
        workList.addEventListener('mouseenter', function () {
            gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
        });
        workList.addEventListener('mouseleave', function () {
            gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power3.in' });
        });
        document.querySelectorAll('.work__item').forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                previewImg.src = item.getAttribute('data-cover');
            });
        });
    }

    /* ---------- Local time (IST) ---------- */
    var timeEl = document.getElementById('local-time');
    if (timeEl) {
        var fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
        var tick = function () { timeEl.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 30000);
    }
})();
