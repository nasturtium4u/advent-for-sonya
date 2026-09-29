(() => {
  "use strict";

  const START_TIME_UTC = "2026-08-30T05:00:00.000Z"; // 12:00 UTC+7
  const INTERVAL_MS = 60 * 60 * 1000;
  const TOTAL_DAYS = 10;
  const STORAGE_KEY = "advent-calendar-opened-v1";

  const calendar = document.getElementById("calendar");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("close-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDay = document.getElementById("modal-day");
  const modalMedia = document.getElementById("modal-media");
  const modalContent = document.getElementById("modal-content");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const nextLabel = document.getElementById("next-label");
  const headerTime = document.getElementById("header-time");
  const toast = document.getElementById("toast");

  let openedDays = loadOpenedDays();
  let countdownTimer = null;
  let toastTimer = null;

  function loadOpenedDays() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(Array.isArray(value) ? value.filter(Number.isInteger) : []);
    } catch {
      return new Set();
    }
  }

  function saveOpenedDays() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...openedDays]));
  }

  function unlockTimestamp(day) {
    return new Date(START_TIME_UTC).getTime() + (day - 1) * INTERVAL_MS;
  }

  function isAvailable(day, now = Date.now()) {
    return now >= unlockTimestamp(day);
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(value => String(value).padStart(2, "0"))
      .join(":");
  }

  function formatTimeUTC7(timestamp) {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date(timestamp));
  }

  function formatDateUTC7(timestamp) {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date(timestamp));
  }

  function renderCalendar() {
    const now = Date.now();
    calendar.innerHTML = "";

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const available = isAvailable(day, now);
      const opened = openedDays.has(day);
      const content = getDayContent(day);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-card";
      button.dataset.day = String(day);

      if (!available) {
        button.classList.add("locked");
        button.disabled = true;
        button.setAttribute("aria-label", `Окошко ${day} закрыто`);
      } else if (opened) {
        button.classList.add("opened");
        button.setAttribute("aria-label", `Открыть окошко ${day} повторно`);
      } else {
        button.classList.add("available");
        button.setAttribute("aria-label", `Открыть окошко ${day}`);
      }

      const icon = !available
        ? "lock"
        : opened
          ? "check_circle"
          : "redeem";

      const title = !available
        ? "Пока закрыто"
        : content.title;

      const subtitle = !available
        ? `Откроется ${formatDateUTC7(unlockTimestamp(day))}`
        : opened
          ? "Нажмите, чтобы посмотреть снова"
          : "Можно открыть";

      button.innerHTML = `
        <div class="day-number">
          <strong>${String(day).padStart(2, "0")}</strong>
          <span class="day-state-icon material-symbols-outlined" aria-hidden="true">${icon}</span>
        </div>
        <div class="day-title">${escapeHtml(title)}</div>
        <div class="day-subtitle">${escapeHtml(subtitle)}</div>
        ${!available && day === getNextLockedDay(now) ? '<div class="countdown" data-countdown></div>' : ""}
      `;

      if (available) {
        button.addEventListener("click", () => openDay(day));
      }

      calendar.appendChild(button);
    }

    updateProgress(now);
  }

  function getNextLockedDay(now) {
    for (let day = 1; day <= TOTAL_DAYS; day++) {
      if (!isAvailable(day, now)) return day;
    }
    return null;
  }

  function updateProgress(now = Date.now()) {
    const openedCount = [...openedDays].filter(day => day >= 1 && day <= TOTAL_DAYS && isAvailable(day, now)).length;
    progressText.textContent = `${openedCount} из ${TOTAL_DAYS}`;
    progressBar.style.width = `${(openedCount / TOTAL_DAYS) * 100}%`;

    const nextDay = getNextLockedDay(now);
    if (nextDay) {
      const remaining = unlockTimestamp(nextDay) - now;
      nextLabel.textContent = `№${nextDay} через ${formatDuration(remaining)}`;
    } else {
      nextLabel.textContent = "Все окошки доступны";
    }
  }

  function updateCountdowns() {
    const now = Date.now();
    const nextDay = getNextLockedDay(now);

    document.querySelectorAll("[data-countdown]").forEach(element => {
      if (nextDay) {
        element.textContent = formatDuration(unlockTimestamp(nextDay) - now);
      }
    });

    updateProgress(now);
    headerTime.textContent = formatTimeUTC7(now);

    if (nextDay && isAvailable(nextDay, now)) {
      renderCalendar();
    }
  }

  function openDay(day) {
    if (!isAvailable(day)) {
      showToast("Это окошко ещё не открылось.");
      return;
    }

    const content = getDayContent(day);
    openedDays.add(day);
    saveOpenedDays();

    modalDay.textContent = `Окошко ${String(day).padStart(2, "0")}`;
    modalTitle.textContent = content.title;
    modalMedia.innerHTML = "";
    modalContent.innerHTML = "";

    if (content.image) {
      const image = document.createElement("img");
      image.src = content.image;
      image.alt = content.imageAlt || content.title;
      image.loading = "eager";
      modalMedia.appendChild(image);
    }

    if (content.video) {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      const source = document.createElement("source");
      source.src = content.video;
      source.type = "video/mp4";
      video.appendChild(source);
      modalMedia.appendChild(video);
    }

    if (content.text) {
      const paragraphs = Array.isArray(content.text) ? content.text : [content.text];
      paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.className = "modal-text";
        p.textContent = text;
        modalContent.appendChild(p);
      });
    }

    if (content.link && content.link.url) {
      const link = document.createElement("a");
      link.className = "modal-link";
      link.href = content.link.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = content.link.label || "Открыть ссылку";
      modalContent.appendChild(link);
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModalButton.focus();

    renderCalendar();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalMedia.innerHTML = "";
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function getDayContent(day) {
    const content = window.ADVENT_DAYS?.find(item => item.day === day);
    return content || {
      day,
      title: `Окошко ${day}`,
      text: "Добавьте содержимое в content/days.js."
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  closeModalButton.addEventListener("click", closeModal);
  document.querySelector("[data-close-modal]").addEventListener("click", closeModal);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  renderCalendar();
  headerTime.textContent = formatTimeUTC7(Date.now());

  countdownTimer = setInterval(updateCountdowns, 1000);

  window.addEventListener("beforeunload", () => {
    clearInterval(countdownTimer);
  });
})();
