const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("sproutAPI", {
  loadProgress: () => ipcRenderer.invoke("load-progress"),
  saveProgress: (data) => ipcRenderer.invoke("save-progress", data),
  saveStats: (payload) => ipcRenderer.invoke("save-stats", payload),
  syncGithub: () => ipcRenderer.invoke("sync-github"),
  onHotkey: (cb) => ipcRenderer.on("hotkey", (_e, action) => cb(action)),
  quit: () => ipcRenderer.invoke("quit-app"),
  showContextMenu: () => ipcRenderer.invoke("show-context-menu"),
  dragStart: (pos) => ipcRenderer.send("drag-start", pos),
  dragMove: (pos) => ipcRenderer.send("drag-move", pos),
  dragEnd: () => ipcRenderer.send("drag-end"),
});
