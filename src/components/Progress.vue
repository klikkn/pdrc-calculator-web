<template>
  <div v-if="loading" class="progress-line"></div>
</template>

<style>
.progress-line,
.progress-line:before {
  height: 3px;
  width: 100%;
  margin: 0;
}
.progress-line {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--BASIC_WHITE);
  display: flex;
  z-index: 100;
}
.progress-line:before {
  background-color: var(--BRAND_COLOR);
  content: "";
  animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@-webkit-keyframes running-progress {
  0% {
    margin-left: 0px;
    margin-right: 100%;
  }
  50% {
    margin-left: 25%;
    margin-right: 0%;
  }
  100% {
    margin-left: 100%;
    margin-right: 0;
  }
}
@keyframes running-progress {
  0% {
    margin-left: 0px;
    margin-right: 100%;
  }
  50% {
    margin-left: 25%;
    margin-right: 0%;
  }
  100% {
    margin-left: 100%;
    margin-right: 0;
  }
}
</style>

<script>
export default {
  props: ["loading"]
};
</script>
