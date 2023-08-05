<template>
    <div class="content-wrapper-header-padding">
        <div class="content-wrapper-context">
            <h3 class="img-content">境界的彼方</h3>
            <div class="content-text">
                《境界的彼方》是由鸟居奈古梦著作、鸭居知世插画的轻小说，于2012年6月9日，由KAESUMA文库文库（京都动画）发行。小说曾获得第2回京都动画大赏（小说部门）奖励赏。
            </div>
            <button class="content-button">
                <NuxtLink class="content-button" :to="{
                    path: '/search-song',
                    query: { keyworks: '境界的彼方' },
                }">试听专辑
                </NuxtLink>
            </button>
        </div>
    </div>
    <img class="content-wrapper-img" src="../../../../assets/lishan-future.png" alt="" />
</template>
<style scoped>
.content-button {
    text-decoration: none;
}
</style>