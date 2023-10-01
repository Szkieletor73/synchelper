<script setup>
    import { ref } from 'vue';
    import { homeDir, sep } from '@tauri-apps/api/path';
    import { convertFileSrc } from '@tauri-apps/api/tauri';
    import { exists } from '@tauri-apps/api/fs';
    import { writeText } from '@tauri-apps/api/clipboard';
    import { open } from '@tauri-apps/api/shell';

    const props = defineProps(['video', 'index'])
    const syncSep = "/"

    const fileParts = props.video.fullPath.split(syncSep)
    const filename = ref(fileParts[fileParts.length - 1].split(".")[0])

    const duration = ref(new Date(props.video.duration * 1000).toISOString().slice(11, 19))

    const thumb = ref(null)
    const thumbExists = ref(false)

    loadThumb()

    async function loadThumb() {
        let path = await homeDir() + `SYNCPLAYER${sep}cache${sep}thumb${sep}${props.video.md5}.png`;

        thumbExists.value = await exists(path)

        if (thumbExists.value) {
            thumb.value = convertFileSrc(path)
        }
    }

    function copyHash() {
        writeText(props.video.md5)
    }

    function openLocation() {
        let location = fileParts.slice(0, fileParts.length - 1).join(syncSep)
        open(location)
    }
</script>

<template>
    <div class="playlist-entry surface">
        <div class="playlist-entry-content">
            <div class="video-order handle">
                <div class="video-order-index">
                    {{ props.index }}
                </div>
                <div class="video-order-drag">
                    <span class="mdi mdi-drag-horizontal"></span>
                </div>
            </div>

            <div class="video-thumb">
                <div class="video-thumb-notfound" v-if="!thumbExists"><span class="mdi mdi-image-off"></span></div>
                <img v-if="thumbExists" :src="thumb" />
            </div>

            <div class="video-data">
                <div class="video-title">{{ filename }}</div>
                <div class="video-extra">
                    <div class="video-extra-chip interactive" v-tooltip="'Click to copy hash to clipboard'" @click="copyHash()">Hash: {{ props.video.md5 }}</div>
                    <div class="video-extra-chip">Duration: {{ duration }}</div>
                    <div class="video-extra-chip">Resolution: {{ props.video.width }}x{{ props.video.height }}</div>
                    <div class="video-extra-chip">Framerate: {{ props.video.frameRate }}</div>
                    <div class="video-extra-chip">Codec: {{ props.video.codec }}</div>
                    <div class="video-extra-chip interactive" v-tooltip="'Click to open file location'" @click="openLocation()">Full path: {{ props.video.fullPath }}</div>
                </div>
            </div>
        </div>
        <div class="playlist-entry-footer">

        </div>
    </div>
</template>

<style scoped>
.playlist-entry {
    flex: 1 0;

    padding: 16px 0px;
}

.playlist-entry-content {
    display: flex;
    flex-direction: row;

    gap: 24px;
}

.video-data {
    display: flex;
    flex-direction: column;

    justify-content: space-between;
}

.video-title {
    font-size: 18px;
}

.video-extra {
    display: flex;
    gap: 0px 16px;
    opacity: 0.7;

    flex-wrap: wrap;
}

.video-thumb {
    background-color: #000;

    flex-shrink: 0;

    position: relative;

    width: 228px;
    height: 128px;
}

.video-thumb > img {
    max-width: 100%;
    max-height: 100%;

    display: block;

    margin-left: auto;
    margin-right: auto;

    user-select: none;
}

.video-thumb-notfound {
    font-size: 80px;

    width: fit-content;
    
    margin-left: auto;
    margin-right: auto;
}

.video-order {
    flex-shrink: 0;

    width: 48px;

    margin-right: -24px;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    cursor: grab;
}

.video-order-index {
    font-size: 24px;
    opacity: 0.7;

    user-select: none;
}

.video-order-drag {
    font-size: 24px;
    opacity: 0.3;
}

.interactive {
    cursor: pointer;
    transition: 0.1s color;
}

.interactive:hover {
    color: var(--primary);
}

.interactive:active {
    color: #19AB81;
}
</style>