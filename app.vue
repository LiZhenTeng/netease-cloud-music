<template>
  <ClientOnly>
    <ElContainer>
      <Background />
      <div class="app">
        <ElHeader>
          <Header></Header>
        </ElHeader>
        <div class="wrapper">
          <el-aside width="200px">
            <Left />
          </el-aside>
          <ElMain>
            <div class="main-container">
              <NuxtPage />
            </div>
          </ElMain>
        </div>

        <aplayer />
      </div>
    </ElContainer>
  </ClientOnly>
</template>