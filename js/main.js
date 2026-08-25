(() => {
    'use strict';

    const root = document.documentElement;
    const body = document.body;
    const header = document.querySelector('.site-header');
    const progressBar = document.querySelector('.scroll-progress span');
    const menu = document.querySelector('.main-nav');
    const menuButton = document.querySelector('.menu-toggle');
    const themeButton = document.querySelector('.theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setTheme = (theme, persist = true) => {
        root.dataset.theme = theme;
        themeButton?.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
        );
        themeColor?.setAttribute('content', theme === 'dark' ? '#07111f' : '#f4f7f7');

        if (persist) {
            try {
                localStorage.setItem('portfolio-theme', theme);
            } catch (error) {
                // The theme still works when storage is unavailable.
            }
        }
    };

    setTheme(root.dataset.theme || 'dark', false);

    themeButton?.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    const closeMenu = () => {
        if (!menu || !menuButton) return;
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
        body.classList.remove('menu-open');
    };

    menuButton?.addEventListener('click', () => {
        const shouldOpen = menuButton.getAttribute('aria-expanded') !== 'true';
        menu?.classList.toggle('is-open', shouldOpen);
        menuButton.setAttribute('aria-expanded', String(shouldOpen));
        menuButton.setAttribute('aria-label', shouldOpen ? 'Cerrar menú' : 'Abrir menú');
        body.classList.toggle('menu-open', shouldOpen);
    });

    menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
    });

    let scrollFramePending = false;
    let scrollableDistance = 0;
    const measureScrollRange = () => {
        scrollableDistance = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    };

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const progress = scrollableDistance > 0 ? Math.min(scrollTop / scrollableDistance, 1) : 0;

        header?.classList.toggle('is-scrolled', scrollTop > 16);
        if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
        scrollFramePending = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollFramePending) {
            window.requestAnimationFrame(updateScrollUI);
            scrollFramePending = true;
        }
    }, { passive: true });
    measureScrollRange();
    updateScrollUI();
    window.addEventListener('load', measureScrollRange, { once: true });
    window.addEventListener('resize', measureScrollRange);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
        const delay = Number(element.dataset.delay || 0);
        element.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    document.querySelectorAll('.career-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const panelId = trigger.getAttribute('aria-controls');
            const panel = panelId ? document.getElementById(panelId) : null;
            const item = trigger.closest('.career-item');
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            trigger.setAttribute('aria-expanded', String(!isOpen));
            item?.classList.toggle('is-open', !isOpen);
            if (panel) panel.hidden = isOpen;
            window.requestAnimationFrame(measureScrollRange);
        });
    });

    const projectCases = {
        aseragro: {
            tag: 'ERP · Automatización',
            number: 'Caso / 01',
            client: 'ASERAGRO',
            title: 'Sistema integral de gestión comercial y contable',
            summary: 'Sincronización de la operación comercial con ContaPyme y automatización de la atención mediante un chatbot.',
            challenge: 'Conectar procesos como cotizaciones, pedidos, remisiones y órdenes de compra con el flujo contable, manteniendo la información disponible para su posterior facturación.',
            solution: 'Se implementó una sincronización diaria y en línea con ContaPyme, acompañada de un chatbot para agilizar la comunicación y la atención comercial.',
            features: ['Sincronización de cotizaciones y pedidos', 'Gestión de remisiones', 'Órdenes de compra nacionales e internacionales', 'Chatbot para atención comercial'],
            value: 'Una operación comercial y contable más conectada, con menos pasos manuales y un flujo de información más ordenado.',
            technologies: ['PHP', 'ContaPyme', 'WhatsApp API', 'Sincronización de datos']
        },
        synthesis: {
            tag: 'InsurTech · Chatbot',
            number: 'Caso / 02',
            client: 'SYNTHESIS',
            title: 'Gestión de tránsito para aseguradoras',
            summary: 'Plataforma para administrar servicios y automatizar la comunicación con asegurados durante sus procesos.',
            challenge: 'Mantener una comunicación oportuna con los asegurados, solicitar documentación y hacer seguimiento a procesos pendientes de forma organizada.',
            solution: 'Se incorporó un chatbot a la plataforma de gestión para enviar notificaciones masivas y recibir documentos asociados a cada proceso.',
            features: ['Administración de servicios para aseguradoras', 'Mensajes automatizados sobre procesos pendientes', 'Recepción de documentos', 'Seguimiento de asegurados'],
            value: 'Comunicación más ágil y una gestión centralizada de la información necesaria para atender cada servicio.',
            technologies: ['Automatización', 'WhatsApp Business', 'Gestión documental']
        },
        bikehouse: {
            tag: 'CX · Operaciones',
            number: 'Caso / 03',
            client: 'BIKEHOUSE',
            title: 'Plataforma de servicio al cliente',
            summary: 'Solución centralizada para gestionar formularios, garantías, seguros, PQR y la relación con distribuidores.',
            challenge: 'Organizar distintos tipos de solicitudes y sus documentos de soporte, ofreciendo al mismo tiempo un espacio exclusivo para distribuidores autorizados.',
            solution: 'Se construyó una plataforma de servicio al cliente con gestión de registros y una zona privada para distribuidores.',
            features: ['Registro de garantías y seguros', 'Gestión de PQR', 'Control de documentos de soporte', 'Zona privada para distribuidores'],
            value: 'Mayor control de las solicitudes y un acceso organizado a la información relevante para clientes y distribuidores.',
            technologies: ['CRM', 'Formularios', 'Gestión documental', 'Zona privada']
        },
        feisa: {
            tag: 'Seguridad · OTP',
            number: 'Caso / 04',
            client: 'FEISA',
            title: 'Sistema de votación segura',
            summary: 'Proceso electoral digital con autenticación OTP, trazabilidad y generación automatizada de certificados.',
            challenge: 'Proteger el acceso al proceso de votación y mantener evidencia clara de su desarrollo para fortalecer la confianza de los participantes.',
            solution: 'Se implementó autenticación mediante contraseñas de un solo uso y generación automática de certificados dentro del sistema de votación.',
            features: ['Autenticación OTP', 'Control de acceso', 'Trazabilidad del proceso', 'Certificados automatizados'],
            value: 'Un proceso electoral más seguro, transparente y fácil de verificar.',
            technologies: ['OTP', 'Autenticación', 'Seguridad', 'Certificados digitales']
        },
        proquifar: {
            tag: 'HealthTech · API',
            number: 'Caso / 05',
            client: 'PROQUIFAR',
            title: 'Consulta de resultados médicos',
            summary: 'Acceso protegido a resultados de laboratorio mediante integración API y validación de pacientes autorizados.',
            challenge: 'Permitir que los pacientes consultaran información sensible de manera ágil sin comprometer la privacidad ni el control de acceso.',
            solution: 'Se desarrolló una solución de consulta conectada mediante API, con validación de usuarios antes de presentar los resultados médicos.',
            features: ['Integración para consulta de resultados', 'Validación de pacientes', 'Acceso protegido', 'Presentación digital de información médica'],
            value: 'Consulta más rápida para los pacientes y manejo controlado de información sensible.',
            technologies: ['API REST', 'Validación de usuarios', 'Privacidad', 'Control de acceso']
        },
        sia: {
            tag: 'EdTech · Certificación',
            number: 'Caso / 06',
            client: 'SIA COLOMBIA',
            title: 'Gestión de cursos especializados',
            summary: 'Sistema para administrar capacitaciones de trabajo seguro en alturas y automatizar sus certificados.',
            challenge: 'Controlar inscripciones, requisitos y registros de capacitación asociados a cursos especializados en seguridad laboral.',
            solution: 'Se creó una plataforma que centraliza el proceso formativo y genera certificados digitales al completar los requisitos establecidos.',
            features: ['Gestión de inscripciones', 'Control de requisitos', 'Registro de capacitaciones', 'Certificados digitales automatizados'],
            value: 'Una operación formativa más organizada y un proceso de certificación consistente con los requisitos de prevención de riesgos.',
            technologies: ['Automatización', 'Gestión de cursos', 'Certificados digitales', 'EdTech']
        },
        belive: {
            tag: 'eCommerce · Dermocosmética',
            number: 'Caso / 07',
            client: 'BELIVE CORP',
            title: 'Tienda especializada en productos dermocosméticos',
            summary: 'Comercio digital orientado a presentar productos especializados y gestionar el ciclo completo de compra.',
            challenge: 'Organizar un catálogo dermocosmético con información detallada, disponibilidad actualizada y un proceso confiable para pedidos y envíos.',
            solution: 'Se desarrolló una tienda con gestión de catálogo e inventario, procesamiento de pedidos y seguimiento de despachos.',
            features: ['Catálogo de productos', 'Información de ingredientes', 'Actualización de inventario', 'Pedidos y seguimiento de envíos'],
            value: 'Una experiencia de compra más clara y una operación comercial centralizada para la marca.',
            technologies: ['eCommerce', 'Gestión de catálogo', 'Inventario', 'Pedidos', 'Logística']
        },
        botanicare: {
            tag: 'eCommerce · Cuidado capilar',
            number: 'Caso / 08',
            client: 'BOTANICARE',
            title: 'Tienda especializada en productos capilares',
            summary: 'Comercio digital para productos botánicos de cuidado capilar con una experiencia de compra personalizada.',
            challenge: 'Facilitar la búsqueda de productos según el tipo de cabello y coordinar catálogo, disponibilidad, pedidos y atención al cliente.',
            solution: 'Se construyó una tienda con clasificación de productos, control de stock y gestión del proceso de compra y envío.',
            features: ['Catálogo por tipo de cabello', 'Actualización de stock', 'Gestión automatizada de pedidos', 'Seguimiento de envíos y atención'],
            value: 'Una compra más personalizada para el cliente y una administración más ordenada del catálogo y los pedidos.',
            technologies: ['eCommerce', 'Catálogo', 'Inventario', 'Pedidos', 'Logística']
        }
    };

    const projectDialog = document.getElementById('project-dialog');
    let lastProjectTrigger = null;

    if (projectDialog) {
        const dialogFields = {
            tag: document.getElementById('project-dialog-tag'),
            number: document.getElementById('project-dialog-number'),
            client: document.getElementById('project-dialog-client'),
            title: document.getElementById('project-dialog-title'),
            summary: document.getElementById('project-dialog-summary'),
            challenge: document.getElementById('project-dialog-challenge'),
            solution: document.getElementById('project-dialog-solution'),
            features: document.getElementById('project-dialog-features'),
            value: document.getElementById('project-dialog-value'),
            technologies: document.getElementById('project-dialog-technologies')
        };

        const populateList = (container, items, elementName) => {
            const elements = items.map((item) => {
                const element = document.createElement(elementName);
                element.textContent = item;
                return element;
            });
            container.replaceChildren(...elements);
        };

        const openProjectCase = (projectId, trigger) => {
            const project = projectCases[projectId];
            if (!project) return;

            Object.entries(dialogFields).forEach(([key, field]) => {
                if (['features', 'technologies'].includes(key)) return;
                field.textContent = project[key];
            });
            populateList(dialogFields.features, project.features, 'li');
            populateList(dialogFields.technologies, project.technologies, 'span');

            lastProjectTrigger = trigger;
            body.classList.add('dialog-open');
            if (typeof projectDialog.showModal === 'function') {
                projectDialog.showModal();
            } else {
                projectDialog.setAttribute('open', '');
            }
        };

        const closeProjectCase = () => {
            if (typeof projectDialog.close === 'function') {
                projectDialog.close();
            } else {
                projectDialog.removeAttribute('open');
                body.classList.remove('dialog-open');
                lastProjectTrigger?.focus();
            }
        };

        document.querySelectorAll('[data-project-case]').forEach((trigger) => {
            trigger.addEventListener('click', () => openProjectCase(trigger.dataset.projectCase, trigger));
        });

        projectDialog.querySelector('.project-dialog-close')?.addEventListener('click', closeProjectCase);
        projectDialog.addEventListener('click', (event) => {
            if (event.target === projectDialog) closeProjectCase();
        });
        projectDialog.addEventListener('close', () => {
            body.classList.remove('dialog-open');
            lastProjectTrigger?.focus();
        });
    }

    const navLinks = [...document.querySelectorAll('.main-nav a')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const currentYear = document.getElementById('current-year');
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
