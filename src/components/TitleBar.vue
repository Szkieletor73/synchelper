<script setup>
import { appWindow } from "@tauri-apps/api/window"

function minimize() {
    appWindow.minimize()
}
function maximize() {
    appWindow.toggleMaximize()
}
function close() {
    appWindow.close()
}
</script>

<template>
    <header data-tauri-drag-region class="title-bar">
        <div class="title-logo">SyncHelper</div>

        <div class="title-controls">
            <div class="window-button" @click="minimize()">
                <div class="mdi mdi-window-minimize"></div>
            </div>
            <div class="window-button" @click="maximize()">
                <div class="mdi mdi-window-maximize"></div>
            </div>
            <div class="window-button" @click="close()">
                <div class="mdi mdi-close"></div>
            </div>
        </div>
    </header>
</template>

<style>
    :root {
        --title-bar-height: 36px;
    }

    .title-bar {
        background-color: #292930;
        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 1px solid var(--border);

        position: relative;

        height: var(--title-bar-height);
    }

    .title-logo {
        font: var(--overline-font);
        pointer-events: none;
        user-select: none;
        opacity: 0.7;

        padding-left: 24px;

        z-index: 20;
    }

    .title-controls {
        display: flex;
    }

    .title-controls > .window-button {
        position: relative;
        height: var(--title-bar-height);
        width: var(--title-bar-height);

        opacity: 0.6;

        cursor: pointer;

        transition: 0.3s background-color;
    }

    .window-button > div {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
    }

    .title-controls > div:hover {
        background-color: var(--highlight);
    }
</style>