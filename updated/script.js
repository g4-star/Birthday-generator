let imageBase64 = "";

const inputs = {
  name: document.getElementById("name"),
  age: document.getElementById("age"),
  message: document.getElementById("message"),
  sender: document.getElementById("sender"),
  theme: document.getElementById("theme"),
  image: document.getElementById("image")
};

const preview = document.getElementById("preview");

// Convert image → base64
inputs.image.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    imageBase64 = reader.result;
    updatePreview();
  };

  if (file) reader.readAsDataURL(file);
});

// Generate preview HTML
function buildHTML(data) {
  return `
  <html>
  <body style="font-family:sans-serif;background:#111;color:white;text-align:center;padding:20px">

    <h1>${data.name || ""} 🎉</h1>
    <h3>Age: ${data.age || ""}</h3>

    ${data.image ? `<img src="${data.image}" style="width:200px;border-radius:15px"/>` : ""}

    <p>${data.message || ""}</p>
    <h4>— ${data.sender || ""}</h4>

    <style>
      body { background: ${getThemeColor(data.theme)}; }
    </style>

  </body>
  </html>
  `;
}

// Theme colors
function getThemeColor(theme) {
  const map = {
    party:"#ff4081",
    elegant:"#2c2c2c",
    hacker:"#000",
    galaxy:"#1a1a40",
    neon:"#00ffcc",
    retro:"#ffcc00",
    ocean:"#0066cc",
    sunset:"#ff6600",
    midnight:"#0d0d0d",
    cyberpunk:"#ff00ff",
    nature:"#228B22",
    royal:"#4b0082",
    minimal:"#f5f5f5",
    rainbow:"linear-gradient(90deg, red, orange, yellow, green, blue)",
    dark:"#111",
    love:"#ff4d6d",
    anime:"#ff99cc",
    vaporwave:"#ff77ff",
    beach:"#66ccff"
  };
  return map[theme] || "#111";
}

// Update preview
function updatePreview() {
  const data = {
    name: inputs.name.value,
    age: inputs.age.value,
    message: inputs.message.value,
    sender: inputs.sender.value,
    theme: inputs.theme.value,
    image: imageBase64
  };

  preview.srcdoc = buildHTML(data);
}

// Listen changes
Object.values(inputs).forEach(input => {
  input.addEventListener("input", updatePreview);
});

document.getElementById("theme").addEventListener("change", updatePreview);

// Generate share link (SAAS CORE)
document.getElementById("share").onclick = function () {
  const data = {
    name: inputs.name.value,
    age: inputs.age.value,
    message: inputs.message.value,
    sender: inputs.sender.value,
    theme: inputs.theme.value,
    image: imageBase64
  };

  const encoded = btoa(JSON.stringify(data));
  const link = `${location.origin}${location.pathname}?data=${encoded}`;

  document.getElementById("shareBox").innerHTML = `
    <p>🔗 Share Link:</p>
    <input value="${link}" style="width:100%" onclick="this.select()"/>
  `;
};

// Load from shared link
window.onload = function () {
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  if (data) {
    const decoded = JSON.parse(atob(data));

    inputs.name.value = decoded.name || "";
    inputs.age.value = decoded.age || "";
    inputs.message.value = decoded.message || "";
    inputs.sender.value = decoded.sender || "";
    inputs.theme.value = decoded.theme || "";
    imageBase64 = decoded.image || "";

    updatePreview();
  }
};