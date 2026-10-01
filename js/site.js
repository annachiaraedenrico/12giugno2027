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
    const stage = document.getElementById("ceremonyPdfStage");
    const panLayer = document.getElementById("ceremonyPdfPan");
    const canvas = document.getElementById("ceremonyPdfCanvas");
    const loading = document.getElementById("ceremonyPdfLoading");
    const controls = document.getElementById("ceremonyPdfControls");
    const previousButton = document.getElementById("ceremonyPdfPrev");
    const nextButton = document.getElementById("ceremonyPdfNext");
    const pageCount = document.getElementById("ceremonyPdfPageCount");
    const zoomOutButton = document.getElementById("ceremonyPdfZoomOut");
    const zoomInButton = document.getElementById("ceremonyPdfZoomIn");
    const zoomValue = document.getElementById("ceremonyPdfZoomValue");

    if (
        !button || !dialog || !close || !stage || !panLayer || !canvas ||
        !loading || !controls || !previousButton || !nextButton ||
        !pageCount || !zoomOutButton || !zoomInButton || !zoomValue
    ) {
        return;
    }

    const pdfUrl = "documenti/libretto-messa.pdf";
    const minZoom = 1;
    const maxZoom = 2.5;
    const zoomStep = 0.25;

    let previousFocus = null;
    let pdfDocument = null;
    let loadingPromise = null;
    let currentPage = 1;
    let totalPages = 0;
    let zoom = 1;
    let fitScale = 1;
    let renderTask = null;
    let renderToken = 0;

    let panX = 0;
    let panY = 0;
    let panOriginX = 0;
    let panOriginY = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerMoved = false;
    let activePointerId = null;
    let isPanning = false;

    let isPinching = false;
    let pinchStartDistance = 0;
    let pinchStartZoom = 1;

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function touchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }

    function updateControls() {
        pageCount.textContent = totalPages
            ? `${currentPage} / ${totalPages}`
            : "";

        previousButton.disabled = currentPage <= 1;
        nextButton.disabled = !totalPages || currentPage >= totalPages;

        zoomValue.textContent = `${Math.round(zoom * 100)}%`;
        zoomOutButton.disabled = zoom <= minZoom + 0.001;
        zoomInButton.disabled = zoom >= maxZoom - 0.001;
    }

    function clampPan() {
        if (zoom <= 1) {
            panX = 0;
            panY = 0;
            return;
        }

        const maxX = Math.max(
            0,
            (canvas.clientWidth - stage.clientWidth) / 2
        );

        const maxY = Math.max(
            0,
            (canvas.clientHeight - stage.clientHeight) / 2
        );

        panX = clamp(panX, -maxX, maxX);
        panY = clamp(panY, -maxY, maxY);
    }

    function applyPan() {
        clampPan();
        panLayer.style.transform =
            `translate3d(${panX}px, ${panY}px, 0)`;
    }

    async function ensurePdf() {
        if (pdfDocument) return pdfDocument;

        if (!window.pdfjsLib) {
            throw new Error("PDF.js non disponibile.");
        }

        if (!loadingPromise) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

            loadingPromise = window.pdfjsLib
                .getDocument(pdfUrl)
                .promise
                .then(pdf => {
                    pdfDocument = pdf;
                    totalPages = pdf.numPages;
                    updateControls();
                    return pdf;
                });
        }

        return loadingPromise;
    }

    async function renderCurrentPage() {
        const token = ++renderToken;
        const pdf = await ensurePdf();
        const page = await pdf.getPage(currentPage);

        if (renderTask) {
            try {
                renderTask.cancel();
            } catch {
                // Nessuna azione necessaria.
            }
        }

        const baseViewport = page.getViewport({ scale: 1 });

        const availableWidth = Math.max(220, stage.clientWidth - 8);
        const availableHeight = Math.max(320, stage.clientHeight - 8);

        fitScale = Math.min(
            availableWidth / baseViewport.width,
            availableHeight / baseViewport.height
        );

        const cssScale = fitScale * zoom;
        const viewport = page.getViewport({ scale: cssScale });

        const outputScale = Math.min(
            window.devicePixelRatio || 1,
            3
        );

        canvas.width = Math.ceil(viewport.width * outputScale);
        canvas.height = Math.ceil(viewport.height * outputScale);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;

        const context = canvas.getContext("2d", { alpha: false });

        context.setTransform(
            outputScale,
            0,
            0,
            outputScale,
            0,
            0
        );

        renderTask = page.render({
            canvasContext: context,
            viewport
        });

        try {
            await renderTask.promise;
        } catch (error) {
            if (error && error.name === "RenderingCancelledException") {
                return;
            }
            throw error;
        }

        if (token !== renderToken) return;

        loading.hidden = true;
        controls.hidden = false;

        applyPan();
        updateControls();
    }

    function setZoom(nextZoom) {
        zoom = clamp(nextZoom, minZoom, maxZoom);

        if (zoom <= 1) {
            panX = 0;
            panY = 0;
        }

        updateControls();

        window.clearTimeout(setZoom.timer);
        setZoom.timer = window.setTimeout(() => {
            renderCurrentPage().catch(error => {
                console.error("Rendering PDF:", error);
            });
        }, 80);
    }

    function goToPage(pageNumber) {
        if (!totalPages) return;

        currentPage = clamp(pageNumber, 1, totalPages);
        panX = 0;
        panY = 0;

        loading.hidden = false;
        loading.textContent = "Caricamento pagina…";

        renderCurrentPage().catch(error => {
            console.error("Rendering PDF:", error);
            loading.textContent =
                "Non è stato possibile visualizzare il libretto.";
        });
    }

    button.addEventListener("click", () => {
        if (dialog.open) return;

        if (typeof window.fadeWeddingMusic === "function") {
            window.fadeWeddingMusic(2500);
        }

        previousFocus = document.activeElement;
        openDialogAnimated(dialog);

        currentPage = 1;
        zoom = 1;
        panX = 0;
        panY = 0;
        loading.hidden = false;
        controls.hidden = true;
        loading.textContent = "Caricamento del libretto…";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                renderCurrentPage().catch(error => {
                    console.error("Caricamento PDF:", error);
                    loading.textContent =
                        "Non è stato possibile visualizzare il libretto.";
                });
            });
        });
    });

    previousButton.addEventListener("click", () => {
        goToPage(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        goToPage(currentPage + 1);
    });

    zoomOutButton.addEventListener("click", () => {
        setZoom(zoom - zoomStep);
    });

    zoomInButton.addEventListener("click", () => {
        setZoom(zoom + zoomStep);
    });

    stage.addEventListener("pointerdown", event => {
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        pointerMoved = false;

        if (zoom > 1 && !isPinching && activePointerId === null) {
            activePointerId = event.pointerId;
            isPanning = true;
            panOriginX = panX;
            panOriginY = panY;

            try {
                stage.setPointerCapture(event.pointerId);
            } catch {
                // Nessuna azione necessaria.
            }
        }
    }, true);

    stage.addEventListener("pointermove", event => {
        const dx = event.clientX - pointerStartX;
        const dy = event.clientY - pointerStartY;

        if (Math.hypot(dx, dy) > 8) {
            pointerMoved = true;
        }

        if (
            !isPanning ||
            isPinching ||
            zoom <= 1 ||
            event.pointerId !== activePointerId
        ) {
            return;
        }

        panX = panOriginX + dx;
        panY = panOriginY + dy;
        applyPan();

        event.preventDefault();
    }, true);

    stage.addEventListener("pointerup", event => {
        if (event.pointerId === activePointerId) {
            isPanning = false;
            activePointerId = null;
        }

        if (pointerMoved || isPinching || !totalPages) {
            return;
        }

        const rect = stage.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;

        if (ratio <= 0.20) {
            goToPage(currentPage - 1);
        } else if (ratio >= 0.80) {
            goToPage(currentPage + 1);
        }
    }, true);

    stage.addEventListener("pointercancel", event => {
        if (event.pointerId === activePointerId) {
            isPanning = false;
            activePointerId = null;
        }
    }, true);

    stage.addEventListener("touchstart", event => {
        if (event.touches.length !== 2) return;

        isPinching = true;
        isPanning = false;
        activePointerId = null;

        pinchStartDistance = touchDistance(event.touches);
        pinchStartZoom = zoom;

        event.preventDefault();
    }, { passive: false, capture: true });

    stage.addEventListener("touchmove", event => {
        if (!isPinching || event.touches.length !== 2) {
            return;
        }

        const distance = touchDistance(event.touches);

        if (pinchStartDistance > 0) {
            const nextZoom = clamp(
                pinchStartZoom * (distance / pinchStartDistance),
                minZoom,
                maxZoom
            );

            zoomValue.textContent = `${Math.round(nextZoom * 100)}%`;

            const previewScale = nextZoom / zoom;
            panLayer.style.transform =
                `translate3d(${panX}px, ${panY}px, 0) scale(${previewScale})`;
        }

        event.preventDefault();
    }, { passive: false, capture: true });

    stage.addEventListener("touchend", event => {
        if (!isPinching) return;

        if (event.touches.length < 2) {
            isPinching = false;

            const changed = event.changedTouches;
            if (changed.length) {
                const remaining = event.touches[0];
                const ended = changed[0];

                if (remaining) {
                    const distance = Math.hypot(
                        remaining.clientX - ended.clientX,
                        remaining.clientY - ended.clientY
                    );

                    if (pinchStartDistance > 0) {
                        zoom = clamp(
                            pinchStartZoom * (distance / pinchStartDistance),
                            minZoom,
                            maxZoom
                        );
                    }
                }
            }

            panLayer.style.transform =
                `translate3d(${panX}px, ${panY}px, 0)`;

            updateControls();

            renderCurrentPage().catch(error => {
                console.error("Rendering PDF:", error);
            });
        }
    }, { passive: true, capture: true });

    stage.addEventListener("touchcancel", () => {
        if (!isPinching) return;

        isPinching = false;
        panLayer.style.transform =
            `translate3d(${panX}px, ${panY}px, 0)`;
    }, { passive: true, capture: true });

    close.addEventListener(
        "click",
        () => closeDialogAnimated(dialog)
    );

    dialog.addEventListener("close", () => {
        if (renderTask) {
            try {
                renderTask.cancel();
            } catch {
                // Nessuna azione necessaria.
            }
        }

        if (previousFocus && previousFocus.isConnected) {
            previousFocus.focus({ preventScroll: true });
        }
    });

    window.addEventListener("resize", () => {
        if (!dialog.open || !pdfDocument) return;

        window.clearTimeout(renderCurrentPage.resizeTimer);
        renderCurrentPage.resizeTimer = window.setTimeout(() => {
            renderCurrentPage().catch(error => {
                console.error("Rendering PDF:", error);
            });
        }, 120);
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

    let audioContext = null;
    let mediaSource = null;
    let gainNode = null;
    let fadeTimer = null;

    function ensureAudioGraph() {
        if (gainNode) {
            return {
                context: audioContext,
                gain: gainNode
            };
        }

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        try {
            audioContext =
                new AudioContextClass();

            mediaSource =
                audioContext.createMediaElementSource(
                    audio
                );

            gainNode =
                audioContext.createGain();

            gainNode.gain.value = 1;

            mediaSource
                .connect(gainNode)
                .connect(
                    audioContext.destination
                );

            return {
                context: audioContext,
                gain: gainNode
            };
        } catch (error) {
            console.warn(
                "Web Audio non disponibile per la musica:",
                error
            );

            return null;
        }
    }

    async function restoreGain() {
        window.clearTimeout(
            fadeTimer
        );

        // Il volume viene ripristinato solo quando la musica
        // viene esplicitamente riattivata.
        audio.volume = 1;

        const graph =
            ensureAudioGraph();

        if (!graph) {
            audio.volume = 1;
            return;
        }

        try {
            if (
                graph.context.state ===
                "suspended"
            ) {
                await graph.context.resume();
            }
        } catch {
            // Se il browser non consente resume qui,
            // il play() proverà comunque normalmente.
        }

        const now =
            graph.context.currentTime;

        graph.gain.gain
            .cancelScheduledValues(now);

        graph.gain.gain
            .setValueAtTime(
                1,
                now
            );
    }

    function stopImmediately() {
        window.clearTimeout(
            fadeTimer
        );

        if (
            gainNode &&
            audioContext
        ) {
            const now =
                audioContext.currentTime;

            gainNode.gain
                .cancelScheduledValues(now);

            gainNode.gain
                .setValueAtTime(
                    1,
                    now
                );
        }

        audio.pause();
        audio.muted = false;

        update();
    }


    window.fadeWeddingMusic =
        async function fadeWeddingMusic(
            duration = 2500
        ) {
            if (
                audio.paused ||
                audio.ended
            ) {
                audio.pause();
                return;
            }

            const graph =
                ensureAudioGraph();

            if (graph) {
                try {
                    if (
                        graph.context.state ===
                        "suspended"
                    ) {
                        await graph.context.resume();
                    }

                    const now =
                        graph.context.currentTime;

                    const currentGain =
                        Math.max(
                            0.0001,
                            graph.gain.gain.value
                        );

                    graph.gain.gain
                        .cancelScheduledValues(now);

                    graph.gain.gain
                        .setValueAtTime(
                            currentGain,
                            now
                        );

                    graph.gain.gain
                        .linearRampToValueAtTime(
                            0.0001,
                            now +
                            duration / 1000
                        );

                    window.clearTimeout(
                        fadeTimer
                    );

                    fadeTimer =
                        window.setTimeout(
                            () => {
                                const stopTime =
                                    graph.context.currentTime;

                                graph.gain.gain
                                    .cancelScheduledValues(
                                        stopTime
                                    );

                                graph.gain.gain
                                    .setValueAtTime(
                                        0,
                                        stopTime
                                    );

                                audio.pause();

                                // Il gain resta a zero finché l'utente
                                // non riattiva la musica. In questo modo
                                // non c'è alcun ritorno istantaneo al
                                // volume pieno alla fine del fade.
                            },
                            duration + 40
                        );

                    return;
                } catch (error) {
                    console.warn(
                        "Fade Web Audio non riuscito:",
                        error
                    );
                }
            }

            // Fallback per browser senza Web Audio.
            const startVolume =
                audio.volume;

            const fadeStart =
                performance.now();

            function fallbackFade(
                timestamp
            ) {
                const progress =
                    Math.min(
                        1,
                        (
                            timestamp -
                            fadeStart
                        ) /
                        duration
                    );

                audio.volume =
                    startVolume *
                    (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(
                        fallbackFade
                    );
                    return;
                }

                audio.volume = 0;
                audio.pause();
            }

            requestAnimationFrame(
                fallbackFade
            );
        };

    function update() {
        const silent =
            mutedByUser ||
            (
                envelopeStarted &&
                (
                    audio.paused ||
                    audio.ended
                )
            );

        button.classList.toggle(
            "is-muted",
            silent
        );

        const label =
            silent
                ? "Attiva la musica"
                : "Disattiva la musica";

        button.setAttribute(
            "aria-label",
            envelopeStarted
                ? label
                : label +
                  " prima di aprire l’invito"
        );

        button.title =
            button.getAttribute(
                "aria-label"
            );
    }

    async function play() {
        if (mutedByUser) return;

        audio.muted = false;

        await restoreGain();

        try {
            await audio.play();

            if (status) {
                status.textContent = "";
            }
        } catch {
            if (status) {
                status.textContent =
                    "Musica non disponibile: tocca la nota per riprovare.";
            }
        }

        update();
    }

    window.addEventListener(
        "envelopeopening",
        () => {
            envelopeStarted = true;

            // Crea il grafo audio durante un gesto utente,
            // così Safari/iOS può usarlo poi per il fade reale.
            ensureAudioGraph();

            if (!mutedByUser) {
                play();
            }

            update();
        },
        { once: true }
    );

    button.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            if (!envelopeStarted) {
                mutedByUser =
                    !mutedByUser;

                audio.muted =
                    mutedByUser;

                update();
                return;
            }

            if (
                mutedByUser ||
                audio.paused ||
                audio.ended
            ) {
                mutedByUser = false;
                play();
            } else {
                // Il pulsante musica interrompe sempre subito:
                // il fade resta riservato all'apertura del libretto.
                mutedByUser = true;
                stopImmediately();
            }
        }
    );

    function pauseWhenAway() {
        audio.pause();
        update();
    }

    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                pauseWhenAway();
            }
        }
    );

    window.addEventListener(
        "pagehide",
        pauseWhenAway
    );

    audio.addEventListener(
        "play",
        () => {
            if (document.hidden) {
                pauseWhenAway();
            }
        }
    );

    [
        "play",
        "pause",
        "ended",
        "volumechange",
        "error"
    ].forEach(
        event =>
            audio.addEventListener(
                event,
                update
            )
    );

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
