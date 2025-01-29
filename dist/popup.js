document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("extensions");

  // Button handlers
  document.getElementById("open-extensions").addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/" });
  });

  document
    .getElementById("open-serviceworkers")
    .addEventListener("click", () => {
      chrome.tabs.create({ url: "chrome://serviceworker-internals/" });
    });

  const extensions = await chrome.management.getAll();
  extensions.forEach((ext) => {
    const item = document.createElement("li");
    item.className =
      "flex items-center justify-between bg-white p-2 rounded-lg shadow-sm";

    // Extension icon
    const icon = document.createElement("img");
    icon.src = ext.icons
      ? ext.icons[ext.icons.length - 1].url
      : "default_icon.png";
    icon.className = "w-6 h-6 rounded mr-2";

    // Toggle switch for enabling/disabling
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = ext.enabled;
    toggle.className = "mr-2 h-5 w-5 cursor-pointer accent-green-500";
    toggle.addEventListener("change", () => {
      chrome.management.setEnabled(ext.id, toggle.checked);
    });

    // Extension name
    const label = document.createElement("span");
    label.textContent = ext.name;
    label.className = "text-sm text-gray-700 flex-1";

    // Reload button
    const reloadBtn = document.createElement("button");
    reloadBtn.textContent = "↻";
    reloadBtn.className =
      "text-gray-600 hover:text-blue-600 text-lg px-2 py-1 rounded-md";
    reloadBtn.addEventListener("click", () => {
      chrome.management.setEnabled(ext.id, false, () => {
        chrome.management.setEnabled(ext.id, true);
      });
    });

    item.appendChild(icon);
    item.appendChild(toggle);
    item.appendChild(label);
    item.appendChild(reloadBtn);
    list.appendChild(item);
  });
});
