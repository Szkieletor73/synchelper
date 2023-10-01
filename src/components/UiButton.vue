<script setup>
const props = defineProps(['pending'])
</script>

<template>
    <button :class="{ pending: props.pending }" class="button">
        <div class="button-icon">
            <slot name="icon"></slot>
        </div>
        <div class="button-label">
            <slot></slot>
        </div>
    </button>
</template>

<style>
    .button {
        color: var(--on-background);
        background: var(--background);
        border: 1px solid var(--border);
        text-transform: unset;

        padding: 8px;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;

        cursor: pointer;
    }

    .button:hover, .button:active {
        background-color: var(--highlight);
    }

    .button-icon {
        font-size: 20px;
    }

    .button.pending {
        background: var(--primary);
    }
</style>