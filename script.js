/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");


menuBtn?.addEventListener("click", () => {

    const isOpen =
        navLinks.classList.toggle("open");

    menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


/* Close mobile menu after clicking a link */

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuBtn?.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });



/* ==========================================
   SCROLL REVEAL ANIMATION
========================================== */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        observer.observe(element);

    });



/* ==========================================
   CURSOR GLOW
========================================== */

const glow =
    document.querySelector(".cursor-glow");


window.addEventListener(
    "pointermove",
    event => {

        if (!glow) return;

        glow.style.left =
            `${event.clientX}px`;

        glow.style.top =
            `${event.clientY}px`;

    }
);



/* ==========================================
   PROJECT / STACK CARD TILT
========================================== */

if (
    window.matchMedia("(pointer:fine)").matches
) {

    document
        .querySelectorAll(
            ".project-card, .stack-card"
        )
        .forEach(card => {

            card.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                            rect.width -
                        0.5;

                    const y =
                        (event.clientY -
                            rect.top) /
                            rect.height -
                        0.5;


                    card.style.transform =
                        `
                        perspective(900px)
                        rotateX(${(-y * 2.2).toFixed(2)}deg)
                        rotateY(${(x * 2.2).toFixed(2)}deg)
                        translateY(-3px)
                        `;

                }
            );


            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

}
/* ==========================================
   PROJECT GALLERY MODAL
========================================== */

const projectModal   = document.getElementById("projectModal");
const modalImg       = document.getElementById("modalImg");
const modalProject   = document.getElementById("modalProject");
const modalCurrent   = document.getElementById("modalCurrent");
const modalTotal     = document.getElementById("modalTotal");
const modalThumbs    = document.getElementById("modalThumbs");
const modalPrev      = projectModal?.querySelector(".modal-nav.prev");
const modalNext      = projectModal?.querySelector(".modal-nav.next");

let galleryImages = [];
let galleryIndex  = 0;


/* ------------------------------------------
   OPEN
------------------------------------------ */

function openGallery(trigger) {

    const raw = trigger.dataset.gallery || "";

    galleryImages = raw
        .split("|")
        .map(src => src.trim())
        .filter(Boolean);

    if (!galleryImages.length) return;

    galleryIndex = 0;

    modalProject.textContent = trigger.dataset.project || "";

    buildThumbs();
    renderSlide();

    projectModal.dataset.count = String(galleryImages.length);
    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


/* ------------------------------------------
   CLOSE
------------------------------------------ */

function closeGallery() {

    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    modalImg.removeAttribute("src");
    modalThumbs.innerHTML = "";
    galleryImages = [];
    galleryIndex = 0;
}


/* ------------------------------------------
   RENDER
------------------------------------------ */

function renderSlide() {

    const src = galleryImages[galleryIndex];
    if (!src) return;

    modalImg.src = src;
    modalImg.alt = `${modalProject.textContent} — image ${galleryIndex + 1}`;

    modalCurrent.textContent = galleryIndex + 1;
    modalTotal.textContent   = galleryImages.length;

    modalThumbs
        .querySelectorAll(".modal-thumb")
        .forEach((btn, i) =>
            btn.classList.toggle("active", i === galleryIndex)
        );
}


function buildThumbs() {

    modalThumbs.innerHTML = galleryImages
        .map((src, i) => `
            <button
                class="modal-thumb"
                data-index="${i}"
                aria-label="Go to image ${i + 1}"
            >
                <img src="${src}" alt="">
            </button>
        `)
        .join("");
}


function stepGallery(delta) {

    if (!galleryImages.length) return;

    galleryIndex =
        (galleryIndex + delta + galleryImages.length)
        % galleryImages.length;

    renderSlide();
}


/* ------------------------------------------
   EVENT WIRING
------------------------------------------ */

/* Attach open handler to every project image */
document
    .querySelectorAll(".project-image[data-gallery]")
    .forEach(el => {

        el.addEventListener("click", () => openGallery(el));

        /* Keyboard accessibility */
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute(
            "aria-label",
            `Open ${el.dataset.project || "project"} gallery`
        );

        el.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGallery(el);
            }

        });

    });


/* Backdrop + close button */
projectModal
    ?.querySelectorAll("[data-close]")
    .forEach(el => el.addEventListener("click", closeGallery));


/* Arrows */
modalPrev?.addEventListener("click", () => stepGallery(-1));
modalNext?.addEventListener("click", () => stepGallery(+1));


/* Thumbnail delegation */
modalThumbs?.addEventListener("click", event => {

    const btn = event.target.closest(".modal-thumb");
    if (!btn) return;

    galleryIndex = Number(btn.dataset.index);
    renderSlide();

});


/* Keyboard: Esc to close, arrows to navigate, thumbnails still clickable */
document.addEventListener("keydown", event => {

    if (!projectModal?.classList.contains("open")) return;

    if (event.key === "Escape")      closeGallery();
    if (event.key === "ArrowLeft")   stepGallery(-1);
    if (event.key === "ArrowRight")  stepGallery(+1);

});


/* Swipe gestures on touch devices */
(function enableSwipe() {

    const stage = projectModal?.querySelector(".modal-stage");
    if (!stage) return;

    let startX = 0;
    let startY = 0;

    stage.addEventListener("touchstart", event => {

        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;

    }, { passive: true });


    stage.addEventListener("touchend", event => {

        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - startY;

        /* Ignore vertical swipes */
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

        stepGallery(dx < 0 ? +1 : -1);

    }, { passive: true });

})();