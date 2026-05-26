const buttons = document.querySelectorAll(".js-add-contact");

const ua = navigator.userAgent || "";
const isIOS = /iphone|ipad|ipod/i.test(ua);
const isAndroid = /android/i.test(ua);

const buildVCard = ({ name, phone, note }) => {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `N:${name};;;;`,
    `TEL;TYPE=CELL:${phone}`,
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
    const phone = button.dataset.phone || "";
    const note = button.dataset.note || "";
    const vCard = buildVCard({ name, phone, note });
    const fileName = `${fileSafe(name)}.vcf`;
    triggerDownload(fileName, vCard);
  });
});
