<template>
    <div>
        <ElRow>
            <ElCol :span="4">
                <ElAvatar :size="50">
                    <ElImage :src="avatarUrl" />
                </ElAvatar>
            </ElCol>
            <ElCol :span="4" :offset="16">
                <IconHot v-if="hot" />
            </ElCol>
        </ElRow>
        <div style="margin-top: 5px;">
            <span>{{ nickname }}</span>
            <div class="app-card__subtext app-mv-text app-card-sub-text-change">
                {{ content }}
            </div>
            <div class="app-card__subtext app-mv-text app-card-sub-text-change">
                <span style="float: left">{{ likedCount }} 赞</span>
                <span style="float: right">{{ timeStr }}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
    avatarUrl: string,
    nickname: string,
    content: string,
    likedCount: number,
    timeStr: string,
    hot?: boolean
}>(), {
    hot: false
})
</script>