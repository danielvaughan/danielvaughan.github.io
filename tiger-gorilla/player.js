'use strict';

const host = document.getElementById('emulator');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const fullscreen = document.getElementById('fullscreen');
const restart = document.getElementById('restart');
const status = document.getElementById('status');
let api;
let emulator;
let loading = false;
const held = new Map();

function releaseKeys() {
  for (const event of held.values()) emulator?.keyboardHandler.keyupHandler(event);
  held.clear();
}

function pauseGame() {
  if (!emulator?.isRunning) return;
  releaseKeys();
  emulator.pause();
  pause.textContent = 'Resume';
  status.textContent = 'Paused. Click Resume to continue.';
}

async function loadGame() {
  if (loading) return;
  loading = true;
  play.disabled = true;
  pause.disabled = fullscreen.disabled = restart.disabled = true;
  status.textContent = 'Loading Tiger Gorilla…';
  try {
    releaseKeys();
    api?.exit();
    emulator = null;
    host.replaceChildren();
    const response = await fetch('tiger-gorilla.tap');
    if (!response.ok) throw new Error('The game tape could not be loaded.');
    api = JSSpeccy(host, {machine: 128, zoom: 1, autoLoadTapes: true,
      autoStart: false, uiEnabled: false, sandbox: true});
    // This vendored JSSpeccy exposes its emulator; see jsspeccy/PATCH.md.
    emulator = window.__zxEmu;
    await Promise.race([
      new Promise(resolve => api.onReady(resolve)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('The emulator took too long to load.')), 20000))
    ]);
    await emulator.openUrl('tiger-gorilla.tap');
    emulator.setKeyboardEventRoot(host);
    cover.hidden = true;
    emulator.start();
    host.focus();
    pause.textContent = 'Pause';
    pause.disabled = fullscreen.disabled = restart.disabled = false;
    status.textContent = 'At the title screen, press 2 for keyboard, then Space to start. Click the game to focus the keyboard.';
  } catch (error) {
    api?.exit();
    api = emulator = null;
    cover.hidden = false;
    play.textContent = 'Try again';
    status.textContent = 'Unable to start the game. ' + error.message;
  } finally {
    loading = false;
    play.disabled = false;
  }
}

play.addEventListener('click', loadGame);
restart.addEventListener('click', loadGame);
pause.addEventListener('click', () => {
  if (emulator.isRunning) pauseGame();
  else {
    emulator.start();
    pause.textContent = 'Pause';
    status.textContent = 'Playing. Click the game to focus the keyboard.';
    host.focus();
  }
});
fullscreen.addEventListener('click', () => { api.toggleFullscreen(); host.focus(); });
host.addEventListener('pointerdown', () => host.focus());
host.addEventListener('keydown', event => { if (!event.repeat) held.set(event.code, event); });
host.addEventListener('keyup', event => held.delete(event.code));
host.addEventListener('blur', releaseKeys);
window.addEventListener('blur', pauseGame);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
