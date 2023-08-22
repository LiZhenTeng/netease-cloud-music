<template>
    <Search :keywords="$route.query.keywords?.toString() || ''"></Search>
</template>