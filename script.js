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