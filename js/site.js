const scrollIndicator =
    document.getElementById("scrollIndicator");

const copyWedshootsCode =
    document.getElementById("copyWedshootsCode");

const wedshootsCode =
    document.getElementById("wedshootsCode");

const giftToggle =
    document.getElementById("giftToggle");

const giftDetails =
    document.getElementById("giftDetails");

const copyIban =
    document.getElementById("copyIban");

const ibanCode =
    document.getElementById("ibanCode");

let scrollFramePending = false;
let scrollIndicatorEnabled = false;

async function copyText(
    text,
    button,
    successLabel
) {
    const originalLabel =
        button.innerHTML;

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );
        } else {
            const textarea =
                document.createElement("textarea");

            textarea.value =
                text;

            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";

            textarea.style.pointerEvents =
                "none";

            (button.closest("dialog") || document.body).appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();
        }

        button.textContent =
            successLabel;

    } catch {
        button.textContent =
            "Seleziona e copia";
    }

    window.setTimeout(
        () => {
            button.innerHTML =
                originalLabel;
        },
        1600
    );
}

function updateScrollIndicator() {
    if (
        !scrollIndicator ||
        !scrollIndicatorEnabled
    ) {
        return;
    }

    const documentHeight =
        document.documentElement.scrollHeight;

    const viewportBottom =
        window.scrollY +
        window.innerHeight;

    const distanceFromBottom =
        documentHeight -
        viewportBottom;

    const canScroll =
        documentHeight >
        window.innerHeight + 40;

    if (
        window.scrollY > 25
    ) {
        scrollIndicator.classList.add(
            "compact"
        );
    } else {
        scrollIndicator.classList.remove(
            "compact"
        );
    }

    const indicatorVisible = canScroll && distanceFromBottom > 100;
    const canActivate = indicatorVisible && !document.documentElement.classList.contains("envelope-closed");
    scrollIndicator.tabIndex = canActivate ? 0 : -1;
    scrollIndicator.setAttribute("aria-hidden", String(!canActivate));

    if (indicatorVisible) {
        scrollIndicator.classList.add(
            "visible"
        );
    } else {
        scrollIndicator.classList.remove(
            "visible"
        );
    }
}

function enableScrollIndicator() {
    scrollIndicatorEnabled = true;

    updateScrollIndicator();
}

window.addEventListener(
    "envelopeopening",
    () => {
        window.setTimeout(
            enableScrollIndicator,
            700
        );
    }
);

window.addEventListener(
    "envelopeopened",
    () => {
        scrollIndicatorEnabled = true;

        updateScrollIndicator();
    }
);

window.addEventListener(
    "scroll",
    () => {
        if (
            scrollFramePending
        ) {
            return;
        }

        scrollFramePending =
            true;

        requestAnimationFrame(
            () => {
                updateScrollIndicator();

                scrollFramePending =
                    false;
            }
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    "resize",
    updateScrollIndicator
);

if (
    copyWedshootsCode &&
    wedshootsCode
) {
    copyWedshootsCode.addEventListener(
        "click",
        () => {
            copyText(
                wedshootsCode.textContent.trim(),
                copyWedshootsCode,
                "Copiato!"
            );
        }
    );
}

if (
    copyIban &&
    ibanCode
) {
    copyIban.addEventListener(
        "click",
        () => {
            copyText(
                ibanCode.textContent
                    .replace(/\s/g, "")
                    .trim(),
                copyIban,
                "Copiato!"
            );
        }
    );
}

(() => {
    const dialog = document.getElementById("giftDialog");
    const closeButton = document.getElementById("giftClose");

    if (!giftToggle || !dialog || !closeButton) return;

    let previousFocus = null;

    giftToggle.addEventListener("click", () => {
        if (dialog.open) return;

        previousFocus = document.activeElement;
        openDialogAnimated(dialog);
    });

    closeButton.addEventListener(
        "click",
        () => closeDialogAnimated(dialog)
    );

    dialog.addEventListener("close", () => {
        if (
            previousFocus &&
            previousFocus.isConnected
        ) {
            previousFocus.focus({
                preventScroll: true
            });
        }
    });
})();

/* =======================================================
   CALENDARIO
======================================================= */

(() => {
    const openButton = document.getElementById("calendarOpen");
    const dialog = document.getElementById("calendarDialog");
    const closeButton = document.getElementById("calendarClose");
    const googleButton = document.getElementById("calendarGoogle");
    const appleButton = document.getElementById("calendarApple");
    const outlookButton = document.getElementById("calendarOutlook");

    if (!openButton || !dialog || !closeButton ||
        !googleButton || !appleButton || !outlookButton) {
        return;
    }

    const title = "Matrimonio Enrico & Annachiara ❤️";
    const description =
        "Matrimonio Enrico & Annachiara ❤️\n\n" +
        "12 giugno 2027 — evento per l'intera giornata\n\n" +
        "Cerimonia: ore 11:00\n" +
        "Chiesa di San Martino Vescovo, Lancusi\n\n" +
        "Ricevimento: Masseria La Morella, Battipaglia";
    const location =
        "Chiesa di San Martino Vescovo, Lancusi; " +
        "Masseria La Morella, Battipaglia";

    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.search = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: "20270612/20270613",
        details: description,
        location: location
    }).toString();
    googleButton.href = googleUrl.href;

    const outlookUrl = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
    outlookUrl.search = new URLSearchParams({
        path: "/calendar/action/compose",
        rru: "addevent",
        subject: title,
        startdt: "2027-06-12T00:00:00",
        enddt: "2027-06-13T00:00:00",
        allday: "true",
        body: description,
        location: location
    }).toString();
    outlookButton.href = outlookUrl.href;

    let previousFocus = null;

    openButton.addEventListener("click", () => {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        openDialogAnimated(dialog);
    });

    closeButton.addEventListener("click", () => closeDialogAnimated(dialog));
    // Escape e contenimento del focus sono gestiti dal dialog nativo.
    dialog.addEventListener("close", () => {
        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });

    function escapeIcs(value) {
        return value.replace(/\\/g, "\\\\")
            .replace(/\r\n|\r|\n/g, "\\n")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,");
    }

    // RFC 5545: righe di massimo 75 byte, senza spezzare caratteri UTF-8.
    function foldIcsLine(line) {
        const encoder = new TextEncoder();
        let folded = "";
        let bytes = 0;
        for (const character of line) {
            const size = encoder.encode(character).length;
            if (bytes + size > 75) {
                folded += "\r\n ";
                bytes = 1;
            }
            folded += character;
            bytes += size;
        }
        return folded;
    }

    appleButton.addEventListener("click", () => {
        const timestamp = new Date().toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}Z$/, "Z");
        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Enrico e Annachiara//Matrimonio//IT",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            "UID:enrico-annachiara-20270612@matrimonio.local",
            "DTSTAMP:" + timestamp,
            "DTSTART;VALUE=DATE:20270612",
            "DTEND;VALUE=DATE:20270613",
            "SUMMARY:" + escapeIcs(title),
            "DESCRIPTION:" + escapeIcs(description),
            "LOCATION:" + escapeIcs(location),
            "TRANSP:TRANSPARENT",
            "END:VEVENT",
            "END:VCALENDAR"
        ];
        const content = lines.map(foldIcsLine).join("\r\n") + "\r\n";
        const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "matrimonio-enrico-annachiara-12-giugno-2027.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
})();

/* LIBRETTO CERIMONIA */
(() => {
    const button = document.getElementById("ceremonyOpen");
    const dialog = document.getElementById("ceremonyDialog");
    const close = document.getElementById("ceremonyClose");
    const book = document.getElementById("ceremonyBook");
    const loading = document.getElementById("ceremonyLoading");
    const controls = document.getElementById("ceremonyBookControls");
    const previousButton = document.getElementById("ceremonyPrev");
    const nextButton = document.getElementById("ceremonyNext");
    const pageCount = document.getElementById("ceremonyPageCount");

    if (
        !button ||
        !dialog ||
        !close ||
        !book ||
        !loading ||
        !controls ||
        !previousButton ||
        !nextButton ||
        !pageCount
    ) {
        return;
    }

    let previousFocus = null;
    let pageFlip = null;
    let bookPromise = null;
    let totalPages = 0;

    function updatePageCounter() {
        if (!pageFlip || totalPages === 0) return;

        const currentPage = pageFlip.getCurrentPageIndex() + 1;

        pageCount.textContent =
            `${currentPage} / ${totalPages}`;

        previousButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages;
    }

    async function buildBook() {
        if (pageFlip) return;

        if (!window.pdfjsLib || !window.St || !window.St.PageFlip) {
            throw new Error("Librerie del libretto non disponibili.");
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

        const pdf = await window.pdfjsLib
            .getDocument("documenti/libretto-messa.pdf")
            .promise;

        totalPages = pdf.numPages;

        const images = [];

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
            loading.textContent =
                `Caricamento del libretto… ${pageNumber} / ${totalPages}`;

            const page = await pdf.getPage(pageNumber);
            const initialViewport = page.getViewport({ scale: 1 });

            // Qualità sufficiente per leggere il testo senza generare
            // immagini enormi sui telefoni.
            const targetWidth =
                Math.min(
                    Math.max(window.innerWidth * 1.5, 900),
                    1400
                );

            const scale = targetWidth / initialViewport.width;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d", {
                alpha: false
            });

            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);

            await page.render({
                canvasContext: context,
                viewport
            }).promise;

            images.push(
                canvas.toDataURL("image/jpeg", 0.92)
            );
        }

        const firstPage = await pdf.getPage(1);
        const firstViewport = firstPage.getViewport({ scale: 1 });
        const pageRatio = firstViewport.height / firstViewport.width;

        const availableHeight =
            Math.min(
                window.innerHeight * 0.68,
                820
            );

        const pageHeight =
            Math.max(
                360,
                Math.round(availableHeight)
            );

        const pageWidth =
            Math.max(
                250,
                Math.round(pageHeight / pageRatio)
            );

        pageFlip = new window.St.PageFlip(
            book,
            {
                width: pageWidth,
                height: pageHeight,
                size: "stretch",
                minWidth: 250,
                maxWidth: 620,
                minHeight: 350,
                maxHeight: 900,
                maxShadowOpacity: 0.35,
                showCover: false,
                mobileScrollSupport: false,
                usePortrait: true,
                autoSize: true,
                drawShadow: true,
                flippingTime: 800,
                startPage: 0
            }
        );

        pageFlip.loadFromImages(images);

        pageFlip.on("flip", updatePageCounter);

        loading.hidden = true;
        controls.hidden = false;

        updatePageCounter();
    }

    button.addEventListener("click", () => {
        if (dialog.open) return;

        previousFocus = document.activeElement;
        openDialogAnimated(dialog);

        if (!bookPromise) {
            bookPromise = buildBook().catch(error => {
                console.error(error);

                loading.textContent =
                    "Non è stato possibile caricare il libretto. Usa il link qui sotto per aprire il PDF.";

                controls.hidden = true;

                // Consente un nuovo tentativo alla prossima apertura.
                bookPromise = null;
            });
        }
    });

    previousButton.addEventListener("click", () => {
        if (pageFlip) pageFlip.flipPrev();
    });

    nextButton.addEventListener("click", () => {
        if (pageFlip) pageFlip.flipNext();
    });

    close.addEventListener(
        "click",
        () => closeDialogAnimated(dialog)
    );

    dialog.addEventListener("close", () => {
        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });
})();

/* CONFERMA PRESENZA */
(() => {
    const button = document.getElementById("rsvpOpen");
    const dialog = document.getElementById("rsvpDialog");
    const close = document.getElementById("rsvpClose");
    const frame = document.getElementById("rsvpFrame");
    if (!button || !dialog || !close || !frame) return;
    let previousFocus = null;
    button.addEventListener("click", () => {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        if (!frame.hasAttribute("src")) frame.src = frame.dataset.src;
        openDialogAnimated(dialog);
    });
    close.addEventListener("click", () => closeDialogAnimated(dialog));
    dialog.addEventListener("close", () => {
        if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    });
})();

/* LUOGHI DELLA GIORNATA */
(() => {
    const dialog = document.getElementById("placeDialog");
    const close = document.getElementById("placeClose");
    const parkingOpen = document.getElementById("parkingOpen");
    const parkingDialog = document.getElementById("parkingDialog");
    const parkingClose = document.getElementById("parkingClose");
    const parkingBack = document.getElementById("parkingBack");
    const parkingGoogle = document.getElementById("parkingGoogle");
    const parkingWaze = document.getElementById("parkingWaze");
    const parkingApple = document.getElementById("parkingApple");

    if (!dialog || !close) return;

    let previousFocus = null;
    let parkingCoordinates = null;
    let switchingToParking = false;
    let switchingBackToPlace = false;

    document.querySelectorAll(".place-open").forEach(button => {
        button.addEventListener("click", () => {
            if (dialog.open) return;

            previousFocus = button;
            parkingCoordinates = button.dataset.parkingCoordinates || null;

            document.getElementById("placeTitle").textContent = button.dataset.placeTitle;
            document.getElementById("placeGoogle").href = button.dataset.google;
            document.getElementById("placeWaze").href = button.dataset.waze;

            const apple = new URL("https://maps.apple.com/");
            apple.searchParams.set("daddr", button.dataset.coordinates);
            apple.searchParams.set("dirflg", "d");
            document.getElementById("placeApple").href = apple.href;

            if (parkingOpen) {
                parkingOpen.hidden = !parkingCoordinates;
            }

            openDialogAnimated(dialog);
        });
    });

    close.addEventListener("click", () => closeDialogAnimated(dialog));

    dialog.addEventListener("close", () => {
        if (switchingToParking) {
            switchingToParking = false;
            return;
        }

        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });

    if (
        parkingOpen &&
        parkingDialog &&
        parkingClose &&
        parkingBack &&
        parkingGoogle &&
        parkingWaze &&
        parkingApple
    ) {
        parkingOpen.addEventListener("click", () => {
            if (!parkingCoordinates || parkingDialog.open) return;

            const [lat, lng] = parkingCoordinates.split(",").map(value => value.trim());

            const google = new URL("https://www.google.com/maps/dir/");
            google.searchParams.set("api", "1");
            google.searchParams.set("destination", `${lat},${lng}`);
            parkingGoogle.href = google.href;

            parkingWaze.href =
                `https://waze.com/ul?ll=${encodeURIComponent(`${lat},${lng}`)}&navigate=yes`;

            const apple = new URL("https://maps.apple.com/");
            apple.searchParams.set("daddr", `${lat},${lng}`);
            apple.searchParams.set("dirflg", "d");
            parkingApple.href = apple.href;

            switchingToParking = true;

            dialog.close();
            dialog.removeAttribute("aria-modal");

            activeDialog = parkingDialog;
            parkingDialog.show();
            parkingDialog.setAttribute("aria-modal", "true");

            requestAnimationFrame(() => {
                parkingClose.focus({ preventScroll: true });
            });
        });

        parkingBack.addEventListener("click", () => {
            if (!parkingDialog.open || dialog.open) return;

            switchingBackToPlace = true;

            parkingDialog.close();
            parkingDialog.removeAttribute("aria-modal");

            activeDialog = dialog;
            dialog.show();
            dialog.setAttribute("aria-modal", "true");

            requestAnimationFrame(() => {
                parkingOpen.focus({ preventScroll: true });
            });
        });

        parkingClose.addEventListener(
            "click",
            () => closeDialogAnimated(parkingDialog)
        );

        parkingDialog.addEventListener("close", () => {
            if (switchingBackToPlace) {
                switchingBackToPlace = false;
                return;
            }

            if (previousFocus && previousFocus.isConnected) {
                previousFocus.focus({ preventScroll: true });
            }
        });
    }
})();

/* GESTIONE FINESTRE E SFONDO */
const dialogBackdrop = document.createElement("div");
dialogBackdrop.className = "dialog-backdrop";
dialogBackdrop.hidden = true;
dialogBackdrop.setAttribute("aria-hidden", "true");
document.body.appendChild(dialogBackdrop);

let activeDialog = null;

function openDialogAnimated(dialog) {
    if (!dialog || dialog.open) return;

    activeDialog = dialog;

    dialogBackdrop.hidden = false;
    dialogBackdrop.classList.remove("is-closing");

    // Forza un nuovo frame così il fade parte sempre da zero.
    requestAnimationFrame(() => {
        dialogBackdrop.classList.add("is-visible");
    });

    dialog.show();
    dialog.setAttribute("aria-modal", "true");
}

function closeDialogAnimated(dialog) {
    if (
        !dialog ||
        !dialog.open ||
        dialog.classList.contains("is-closing")
    ) {
        return;
    }

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) {
        dialog.close();
        dialog.removeAttribute("aria-modal");

        dialogBackdrop.classList.remove(
            "is-visible",
            "is-closing"
        );
        dialogBackdrop.hidden = true;

        if (activeDialog === dialog) {
            activeDialog = null;
        }

        return;
    }

    const style = getComputedStyle(dialog);

    dialog.style.setProperty(
        "--dialog-close-transform",
        style.transform
    );

    dialog.style.setProperty(
        "--dialog-close-opacity",
        style.opacity
    );

    dialog.classList.add("is-closing");

    dialogBackdrop.classList.remove(
        "is-visible"
    );

    dialogBackdrop.classList.add(
        "is-closing"
    );

    let finished = false;

    function finishDialog() {
        if (finished) return;

        finished = true;

        dialog.close();
        dialog.removeAttribute("aria-modal");
        dialog.classList.remove("is-closing");

        dialog.style.removeProperty(
            "--dialog-close-transform"
        );

        dialog.style.removeProperty(
            "--dialog-close-opacity"
        );

        if (activeDialog === dialog) {
            activeDialog = null;
        }
    }

    function onDialogEnd(event) {
        if (
            event.target === dialog &&
            event.animationName ===
                "dialog-disappear"
        ) {
            dialog.removeEventListener(
                "animationend",
                onDialogEnd
            );

            finishDialog();
        }
    }

    dialog.addEventListener(
        "animationend",
        onDialogEnd
    );

    window.setTimeout(
        finishDialog,
        600
    );

    window.setTimeout(
        () => {
            dialogBackdrop.classList.remove(
                "is-closing"
            );

            dialogBackdrop.hidden = true;
        },
        650
    );
}

dialogBackdrop.addEventListener(
    "click",
    () => {
        if (activeDialog) {
            closeDialogAnimated(
                activeDialog
            );
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            activeDialog
        ) {
            event.preventDefault();

            closeDialogAnimated(
                activeDialog
            );
        }
    }
);

/* MUSICA: SCELTA DISPONIBILE ANCHE A BUSTA CHIUSA */
(() => {
    const audio = document.getElementById("weddingMusic");
    const button = document.getElementById("musicToggle");
    const status = document.getElementById("musicStatus");
    if (!audio || !button) return;
    let envelopeStarted = false;
    let mutedByUser = false;
    function update() {
        const silent = mutedByUser || (envelopeStarted && (audio.paused || audio.ended));
        button.classList.toggle("is-muted", silent);
        const label = silent ? "Attiva la musica" : "Disattiva la musica";
        button.setAttribute("aria-label", envelopeStarted ? label : label + " prima di aprire l’invito");
        button.title = button.getAttribute("aria-label");
    }
    async function play() {
        if (mutedByUser) return;
        audio.muted = false;
        try {
            await audio.play();
            if (status) status.textContent = "";
        } catch {
            if (status) status.textContent = "Musica non disponibile: tocca la nota per riprovare.";
        }
        update();
    }
    window.addEventListener("envelopeopening", () => {
        envelopeStarted = true;
        if (!mutedByUser) play();
        update();
    }, { once: true });
    button.addEventListener("click", event => {
        event.stopPropagation();
        if (!envelopeStarted) {
            mutedByUser = !mutedByUser;
            audio.muted = mutedByUser;
            update();
            return;
        }
        if (mutedByUser || audio.paused || audio.ended) {
            mutedByUser = false;
            play();
        } else {
            mutedByUser = true;
            audio.muted = true;
            update();
        }
    });
    function pauseWhenAway() {
        audio.pause();
        update();
    }
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) pauseWhenAway();
    });
    window.addEventListener("pagehide", pauseWhenAway);
    audio.addEventListener("play", () => {
        if (document.hidden) pauseWhenAway();
    });
    ["play", "pause", "ended", "volumechange", "error"].forEach(event => audio.addEventListener(event, update));
    update();
})();

/* UN PASSO DI SCORRIMENTO A OGNI TOCCO */
if (scrollIndicator) {
    function scrollOneStep() {
        if (document.documentElement.classList.contains("envelope-closed")) return;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const remaining = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
        window.scrollBy({
            top: Math.min(Math.round(viewportHeight * 0.65), remaining),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
        });
    }
    scrollIndicator.addEventListener("click", scrollOneStep);
    scrollIndicator.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollOneStep();
        }
    });
}
