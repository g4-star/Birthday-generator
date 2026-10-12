/* Birthday Page Generator — shareable links edition */
const themes = [
  {key:"party",label:"Party Vibes",icon:"🎉",bg:"#fff9f0",accent:"#ff6b6b",text:"#30243b"},
  {key:"elegant",label:"Elegant",icon:"🌹",bg:"#fdf8f4",accent:"#c9a96e",text:"#2c1810"},
  {key:"hacker",label:"Hacker",icon:"💻",bg:"#050a0e",accent:"#00ff88",text:"#e8f4f0"},
  {key:"pastel",label:"Pastel Dream",icon:"🌸",bg:"#fef6fb",accent:"#d889dc",text:"#4a3550"},
  {key:"galaxy",label:"Galaxy",icon:"🌌",bg:"#0d0d2b",accent:"#818cf8",text:"#e0e7ff"},
  {key:"royal",label:"Royal",icon:"👑",bg:"#21113f",accent:"#f2c66d",text:"#fff4d6"},
  {key:"neon",label:"Neon Lights",icon:"💡",bg:"#130b24",accent:"#ff39d4",text:"#fff0ff"},
  {key:"floral",label:"Floral Garden",icon:"🌷",bg:"#fff5f4",accent:"#d96b8a",text:"#52303b"},
  {key:"ocean",label:"Ocean Blue",icon:"🌊",bg:"#eafaff",accent:"#168aad",text:"#12354a"},
  {key:"sunset",label:"Sunset",icon:"🌅",bg:"#fff0e5",accent:"#f15b42",text:"#592d45"},
  {key:"midnight",label:"Midnight",icon:"🌙",bg:"#101827",accent:"#91a7ff",text:"#f1f5ff"},
  {key:"candy",label:"Candy Pop",icon:"🍭",bg:"#fff0f8",accent:"#ff58a6",text:"#56234a"},
  {key:"minimal",label:"Minimal",icon:"🤍",bg:"#f7f7f7",accent:"#52525b",text:"#27272a"},
  {key:"retro",label:"Retro",icon:"🪩",bg:"#fff1d6",accent:"#c84b31",text:"#432818"},
  {key:"luxury",label:"Luxury Gold",icon:"✨",bg:"#171512",accent:"#d7b56d",text:"#fff3d1"},
  {key:"tropical",label:"Tropical",icon:"🌴",bg:"#efffe9",accent:"#299b68",text:"#163d30"},
  {key:"dreamy",label:"Dreamy",icon:"☁️",bg:"#f0edff",accent:"#9b8afb",text:"#383052"},
  {key:"gold",label:"Golden Hour",icon:"🌞",bg:"#fff8d9",accent:"#d49b16",text:"#513c12"},
  {key:"anime",label:"Anime Magic",icon:"⭐",bg:"#f1f0ff",accent:"#7969ef",text:"#292452"},
  {key:"romantic",label:"Romantic",icon:"💖",bg:"#fff0f3",accent:"#e75480",text:"#592238"},
  {key:"cyberpunk",label:"Cyberpunk",icon:"🤖",bg:"#110f24",accent:"#ff3e7f",text:"#f8f0ff"},
  {key:"confetti",label:"Confetti",icon:"🎊",bg:"#fff8ee",accent:"#ff7a3d",text:"#392d40"},
  {key:"lavender",label:"Lavender",icon:"🪻",bg:"#f5efff",accent:"#9878d4",text:"#382750"},
  {key:"emerald",label:"Emerald",icon:"💚",bg:"#eafff5",accent:"#168b65",text:"#153b30"},
  {key:"cosmic",label:"Cosmic",icon:"🪐",bg:"#16132f",accent:"#bd83ff",text:"#f4edff"}
];

const $ = id => document.getElementById(id);
let selectedTheme = "party";
let photoObjectUrl = "";
let publishedUrl = "";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}

function safeHttpsUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" ? u.href : "";
  } catch {
    return "";
  }
}

function currentTheme() {
  return themes.find(t => t.key === selectedTheme) || themes[0];
}

function getFormData() {
  const name = $("name").value.trim();
  const age = $("age").value.trim();
  const sender = $("sender").value.trim();
  const message = $("message").value.trim() ||
    "Wishing you a beautiful birthday filled with love, laughter, and unforgettable memories. Happy Birthday! 🎂";
  return {name, age, sender, message};
}

function makePreviewHtml(photoUrl = "") {
  const t = currentTheme();
  const d = getFormData();
  const name = d.name || "Someone Special";
  const ageText = d.age ? ` — ${escapeHtml(d.age)} years of awesome` : "";
  const image = safeHttpsUrl(photoUrl) ||
    (photoUrl.startsWith("blob:") ? photoUrl : "");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
  *{box-sizing:border-box}body{margin:0;padding:28px 16px;background:${t.bg};color:${t.text};
  font-family:Nunito,Arial,sans-serif;text-align:center;min-height:100vh}
  .card{max-width:560px;margin:0 auto;background:${t.bg};border:2px solid ${t.accent};
  border-radius:24px;padding:28px 22px;box-shadow:0 12px 40px #0001}
  .emoji{font-size:32px;letter-spacing:8px}.banner{height:7px;background:${t.accent};
  border-radius:20px;margin:16px 0}.photo{max-width:100%;max-height:260px;object-fit:cover;
  border-radius:18px;margin:12px auto;display:block}.title{font-size:clamp(27px,6vw,42px);
  overflow-wrap:anywhere}.message{white-space:pre-wrap;line-height:1.8;text-align:left;
  overflow-wrap:anywhere}.from{margin-top:24px;font-weight:bold;color:${t.accent}}
  </style></head><body><main class="card"><div class="emoji">${t.icon} 🎂 ${t.icon}</div>
  <div class="banner"></div><h1 class="title">Happy Birthday, ${escapeHtml(name)}!</h1>
  <p>${ageText}</p>${image ? `<img class="photo" src="${escapeHtml(image)}" alt="Birthday memory">` : ""}
  <p class="message">${escapeHtml(d.message)}</p>
  <div class="from">With love, ${escapeHtml(d.sender || "Your person")} 💝</div>
  </main></body></html>`;
}

function refreshPreview() {
  $("preview-frame").srcdoc = makePreviewHtml(photoObjectUrl || $("photo-url").value.trim());
}

function setStatus(message, kind = "") {
  const el = $("creation-status");
  el.textContent = message;
  el.className = "creation-status" + (kind ? " " + kind : "");
}

function renderThemes() {
  const grid = $("theme-grid");
  grid.innerHTML = "";
  themes.forEach(t => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-btn" + (t.key === selectedTheme ? " active" : "");
    btn.dataset.theme = t.key;
    btn.innerHTML = `<span class="theme-icon">${t.icon}</span><span class="theme-name">${t.label}</span>`;
    btn.addEventListener("click", () => {
      selectedTheme = t.key;
      grid.querySelectorAll(".theme-btn").forEach(b => b.classList.toggle("active", b.dataset.theme === selectedTheme));
      refreshPreview();
    });
    grid.appendChild(btn);
  });
}

async function uploadMedia(file, kind) {
  const sessionId = crypto.randomUUID();
  const chunkSize = 2 * 1024 * 1024;
  const chunkCount = Math.ceil(file.size / chunkSize);
  const chunkUrls = [];

  for (let index = 0; index < chunkCount; index++) {
    const chunk = file.slice(
      index * chunkSize,
      Math.min((index + 1) * chunkSize, file.size)
    );

    const bytes = new Uint8Array(await chunk.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chunk",
        sessionId,
        chunkIndex: index,
        chunkCount,
        data: btoa(binary),
        contentType: file.type,
        kind
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) {
      throw new Error(result.error || "Upload failed. Please try again.");
    }

    chunkUrls.push(result.url);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "finalize",
      sessionId,
      chunkUrls,
      contentType: file.type,
      kind
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) {
    throw new Error(result.error || "Upload failed. Please try again.");
  }

  return result.url;
}

async function createShareablePage() {
  const d = getFormData();
  if (!d.name) {
    setStatus("Please enter the birthday person's name.", "error");
    $("name").focus();
    return;
  }

  const ageNumber = d.age ? Number(d.age) : null;
  if (d.age && (!Number.isInteger(ageNumber) || ageNumber < 0 || ageNumber > 150)) {
    setStatus("Please enter a valid age between 0 and 150.", "error");
    return;
  }

  const photoFile = $("photo-file").files[0];
  const photoInputUrl = $("photo-url").value.trim();
  const musicInput = $("music-url").value.trim();
  const musicFile = $("music-file").files[0];

  if (photoFile && photoInputUrl) {
    setStatus("Choose a photo file or enter a photo URL, not both.", "error");
    return;
  }
  if (photoFile && photoFile.size > 3 * 1024 * 1024) {
    setStatus("That photo is larger than 3 MB. Please choose a smaller image.", "error");
    return;
  }
  if (photoInputUrl && !safeHttpsUrl(photoInputUrl)) {
    setStatus("Photo URL must start with https://.", "error");
    return;
  }
  if (musicInput && !safeHttpsUrl(musicInput)) {
    setStatus("Music URL must start with https://.", "error");
    return;
  }

  if (musicFile && musicInput) {
    setStatus("Choose a song file or enter a music URL, not both.", "error");
    return;
  }
  if (musicFile && !["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "audio/webm"].includes(musicFile.type)) {
    setStatus("Please choose a supported audio file.", "error");
    return;
  }
  if (musicFile && musicFile.size > 10 * 1024 * 1024) {
    setStatus("That song is larger than 10 MB. Please choose a smaller file.", "error");
    return;
  }

  const btn = $("gen-btn");
  btn.disabled = true;
  $("actions").classList.remove("visible");
  publishedUrl = "";

  try {
    let photoUrl = photoInputUrl;
    if (photoFile) {
      setStatus("Uploading your birthday photo…");
      photoUrl = await uploadMedia(photoFile, "photo");
    }

    let musicUrl = musicInput || null;
    if (musicFile) {
      setStatus("Uploading your birthday song…");
      musicUrl = await uploadMedia(musicFile, "music");
    }

    setStatus("Creating your shareable birthday page…");
    const payload = {
      recipient_name: d.name,
      age: ageNumber,
      message: d.message,
      sender_name: d.sender || "Your person",
      theme: selectedTheme,
      photo_url: photoUrl || null,
      music_url: musicUrl
    };

    const response = await fetch("/api/birthdays", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) {
      throw new Error(result.error || "Could not create the page. Check the API and database configuration.");
    }

    publishedUrl = new URL(result.url, window.location.origin).href;
    $("share-link").value = publishedUrl;
    $("actions").classList.add("visible");
    setStatus("🎉 Your birthday page is published and ready to share!", "success");
    $("actions").scrollIntoView({behavior:"smooth", block:"nearest"});
  } catch (error) {
    setStatus(error.message || "Something went wrong while creating your page.", "error");
  } finally {
    btn.disabled = false;
  }
}

$("gen-btn").addEventListener("click", createShareablePage);

$("copy-link-btn").addEventListener("click", async () => {
  if (!publishedUrl) return;
  try {
    await navigator.clipboard.writeText(publishedUrl);
    setStatus("Shareable link copied! Send it to the birthday person 🎉", "success");
  } catch {
    $("share-link").focus();
    $("share-link").select();
    setStatus("Select and copy the link shown above.", "error");
  }
});

$("whatsapp-btn").addEventListener("click", () => {
  if (!publishedUrl) return;
  const d = getFormData();
  const text = `🎂 A birthday surprise for ${d.name}! Open your special page here: ${publishedUrl}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
});

$("photo-file").addEventListener("change", () => {
  const file = $("photo-file").files[0];
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = "";

  if (file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      $("photo-file").value = "";
      setStatus("Please choose a JPG, PNG, or WebP image.", "error");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      $("photo-file").value = "";
      setStatus("That photo is larger than 3 MB.", "error");
      return;
    }
    photoObjectUrl = URL.createObjectURL(file);
    $("photo-preview").src = photoObjectUrl;
    $("photo-preview").style.display = "block";
    $("photo-url").value = "";
  } else {
    $("photo-preview").style.display = "none";
  }
  refreshPreview();
});

$("photo-url").addEventListener("input", () => {
  if ($("photo-url").value.trim()) {
    $("photo-file").value = "";
    if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    photoObjectUrl = "";
    $("photo-preview").style.display = "none";
  }
  refreshPreview();
});

["name", "age", "message", "sender"].forEach(id => $(id).addEventListener("input", refreshPreview));
$("music-url").addEventListener("input", () => {
  if ($("music-url").value.trim()) $("music-file").value = "";
});

$("music-file").addEventListener("change", () => {
  if ($("music-file").files[0]) $("music-url").value = "";
});

renderThemes();
refreshPreview();
