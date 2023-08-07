<template>
    <div class="content-wrapper">
        <div class="content-section">
            <video controls autoplay loop :src="url" style="width: 100%; border-radius: 10px"></video>
            <h4 class="fontcolor">MV评论</h4>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { mv_url } from '~/composables/netease-cloud-music';

const { mvId } = defineProps<{ mvId: number }>();
const { data: { url } } = await mv_url({ id: mvId }) as unknown as { code: number, data: Record<string, any> }
</script>