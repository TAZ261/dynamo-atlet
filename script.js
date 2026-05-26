const platformNoteEl = document.getElementById("platform-note");
const buttons = document.querySelectorAll(".js-add-contact");

const ua = navigator.userAgent || "";
const isIOS = /iphone|ipad|ipod/i.test(ua);
const isAndroid = /android/i.test(ua);

if (platformNoteEl) {
  if (isIOS) {
    platformNoteEl.textContent =
      "На iPhone відкриється картка контакту. Натисни «Додати», щоб зберегти.";
  } else if (isAndroid) {
    platformNoteEl.textContent =
      "На Android завантажиться файл контакту. Відкрий його і підтверди додавання.";
  } else {
    platformNoteEl.textContent =
      "Збережи файл і відкрий його на телефоні, щоб додати контакт.";
  }
}

const buildVCard = ({ name, phones, note }) => {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `N:${name};;;;`,
    ...phones.map((phone) => `TEL;TYPE=CELL:${phone}`),
    `NOTE:${note}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
};

const fileSafe = (value) => {
  const trimmed = value.trim().toLowerCase();
  const safe = trimmed
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
  return safe || "contact";
};

const triggerDownload = (fileName, content) => {
  const blob = new Blob([content], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);

  if (isIOS) {
    window.location.href = url;
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name || "Динамо";
    const phoneRaw = button.dataset.phone || "";
    const phones = phoneRaw
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean);
    const note = button.dataset.note || "";
    const vCard = buildVCard({ name, phones, note });
    const fileName = `${fileSafe(name)}.vcf`;
    triggerDownload(fileName, vCard);
  });
});
