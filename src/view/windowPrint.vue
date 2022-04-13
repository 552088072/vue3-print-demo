<script setup>
import Print from "@/utils/print.js";

const printBtn = () => {
  const printBox = document.getElementById("printBox");
  Print(printBox);
};
</script>

<template>
  <div>使用window的方法直接调起打印</div>
  <br />
  <div>我们先来画一个盒子</div>
  <br />
  <br />
  <br />
  <div id="printBox">
    <div class="content">
      <img src="@/assets/logo.png" alt="" />
      <div>我是打印盒子</div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <button @click="printBtn">打印</button>
  <br />
  <br />
  <br />
  <div>点下打印就行了 ， 没错就这么简单</div>
  <div>但是当前方法是基于dom 完成的 所以打印需要渲染dom </div>
</template>

<style>
.content {
  background: #e73535;
}
/* 解决背景色打印不出来得问题 */
@media print {
  .content {
    background: #e73535;
    -webkit-print-color-adjust: exact;
  }
}
</style>
