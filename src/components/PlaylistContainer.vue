<script setup>
import { homeDir, sep } from '@tauri-apps/api/path';
import { ref, computed } from 'vue';
import { open } from '@tauri-apps/api/shell';

import PlaylistEntry from './PlaylistEntry.vue';
import * as playlistDB from './PlaylistDB.js';
import UiButton from './UiButton.vue';

import { Sortable } from 'sortablejs-vue3';

const sortableOptions = computed(() => {
    return {
        handle: ".handle",
        draggable: ".draggable",
        animation: 150,
        ghostClass: "ghost",
        scroll: true,
        forceFallback: true,
        scrollSensitivity: 50,
        scrollSpeed: 10,
        bubbleScroll: true,
    }
})

const videos = ref([])

const syncSep = "/"
const pending = ref(false)


async function refresh() {
    const dbPath = await homeDir() + `SYNCPLAYER${sep}syncplayer.db`;
    
    videos.value = await playlistDB.loadVideos(dbPath)
    videos.value.reverse()

    pending.value = false
}

function sortByName(order = 'asc') {
    if (order === 'asc') {
        videos.value.sort((a, b) => {
            const aName = a.fullPath.split(syncSep).pop()
            const bName = b.fullPath.split(syncSep).pop()

            return aName.localeCompare(bName, 'en', { numeric: true })
        })
    } else {
        videos.value.sort((a, b) => {
            const aName = a.fullPath.split(syncSep).pop()
            const bName = b.fullPath.split(syncSep).pop()

            return bName.localeCompare(aName, 'en', { numeric: true })
        })
    }

    pending.value = true
}

function sortByDuration(order = 'asc') {
    if (order === 'asc') {
        videos.value.sort(
            (a, b) => {
                if (a.duration < b.duration) {
                    return -1;
                }
                if (a.duration > b.duration) {
                    return 1;
                }
                return 0;
            }
        )
    } else {
        videos.value.sort(
            (a, b) => {
                if (a.duration < b.duration) {
                    return 1;
                }
                if (a.duration > b.duration) {
                    return -1;
                }
                return 0;
            }
        )
    }

    pending.value = true
}

async function save() {
    const dbPath = await homeDir() + `SYNCPLAYER${sep}syncplayer.db`;

    playlistDB.savePlaylist(dbPath, videos.value.toReversed())

    pending.value = false
}

async function openDirTrace() {
    const path = await homeDir() + `SYNCPLAYER${sep}trace`

    open(path)
}

function dragUpdateList(event) {
    var element = videos.value[event.oldIndex];
    videos.value.splice(event.oldIndex, 1);
    videos.value.splice(event.newIndex, 0, element);

    pending.value = true
}

refresh()
</script>

<template>
    <div class="playlist-container">
        <div class="playlist-controls">
            <div class="playlist-controls-top">
                <ui-button @click="refresh()">
                    <template v-slot:icon>
                        <span class="mdi mdi-refresh"></span>
                    </template>
                    Refresh
                </ui-button>
    
                <ui-button :pending="pending" @click="save()">
                    <template v-slot:icon>
                        <span class="mdi mdi-content-save"></span>
                    </template>
                    Save
                </ui-button>
    
                <ui-button @click="openDirTrace()">
                    <template v-slot:icon>
                        <span class="mdi mdi-folder"></span>
                    </template>
                    Open script directory
                </ui-button>
            </div>

            <div class="playlist-controls-bottom">
                <ui-button @click="sortByName('asc')">
                    <template v-slot:icon>
                        <span class="mdi mdi-sort-alphabetical-ascending"></span>
                    </template>
                    Sort by name ascending
                </ui-button>
    
                <ui-button @click="sortByName('desc')">
                    <template v-slot:icon>
                        <span class="mdi mdi-sort-alphabetical-descending"></span>
                    </template>
                    Sort by name descending
                </ui-button>
    
                <ui-button @click="sortByDuration('asc')">
                    <template v-slot:icon>
                        <span class="mdi mdi-sort-clock-ascending"></span>
                    </template>
                    Sort by duration ascending
                </ui-button>
    
                <ui-button @click="sortByDuration('desc')">
                    <template v-slot:icon>
                        <span class="mdi mdi-sort-clock-descending"></span>
                    </template>
                    Sort by duration descending
                </ui-button>
            </div>
        </div>
        <!-- <playlist-entry v-for="(video, index) in videos" :key="video.md5" :index="videos.length - index" :video="video"></playlist-entry> -->

        <Sortable :list="videos" item-key="md5" :options="sortableOptions" class="playlist-list" @end="dragUpdateList">
            <template #item="{element, index}">
                <playlist-entry class="draggable" :key="element.md5" :index="ref(index + 1)" :video="element"></playlist-entry>
            </template>
        </Sortable>

        <!-- <Sortable ref="sortable" :list="elements" item-key="id" :options="options">
            <template #item="{element, index}">
                <div class="draggable" :key="element.id">
                    {{ element.text }}
                </div>
            </template>
        </Sortable> -->
    </div>
</template>

<style scoped>
    .playlist-container {
        padding: 0px 14px 24px 24px;

        min-width: 1000px;
    }

    .playlist-list {
        display: flex;
        flex-direction: column;

        gap: var(--gap-l);
    }

    .playlist-controls {
        background: var(--background);

        padding: 12px 0px 12px 0px;

        position: sticky;
        top: 0px;

        z-index: 100;
    }

    .playlist-controls-top {
        margin-bottom: 12px;
    }

    .playlist-controls-top, .playlist-controls-bottom {
        gap: 0px 32px;
        display: flex;
        flex-wrap: wrap;
    }

    .ghost {
        visibility: hidden;
    }
</style>