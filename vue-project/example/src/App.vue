<template>
  <div class="box">
    <h2>明亮</h2>
    <JsonViewer
      :value="jsonData"
      copyable
      boxed
      sort
      theme="light"
      :allowImageShow="true"
    />
    <h2>暗黑</h2>
    <JsonViewer :value="jsonData" copyable boxed sort theme="dark" />
  </div>
</template>

<script setup>
// import component
import { JsonViewer } from "../../../src";

// mock data from document array
import docArrayJson from "./mock/data.json";

import { reactive, ref } from "vue";

const jsonData = reactive(docArrayJson);
</script>

<style>
.box {
  height: 100%;
}
</style>
