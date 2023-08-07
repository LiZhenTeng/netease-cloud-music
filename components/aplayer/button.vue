<template>
  <button class="button-icon">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  margin: 4px;
  border-radius: 25%;
  transition: 0.2s;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    background: var(--color-secondary-bg-for-transparent);
  }

  &:active {
    transform: scale(0.92);
  }
}
</style>