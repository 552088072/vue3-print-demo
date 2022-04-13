<script setup>
import { ref, reactive } from "vue";
import Print from "@/utils/print.js";

const printListBox = ref(null);
const num = ref('');
const list = reactive([]);
const creatDom = () => {
  list.splice(0);
  if (!num.value) return;
  for (let i = 1; i <= num.value; i++) {
    list.push(i);
  }
};
const printBtn = () => {
  Print(printListBox.value);
};
</script>
<template>
  <div>使用window打印的方法 实现分页打印</div>
  <div>
    <input
      type="number"
      v-model="num"
      @keyup.enter="creatDom"
      placeholder="请输入你想生成的数量"
    />
    <button @click="creatDom">确定</button>
  </div>
  <br />
  <button v-show="list.length > 0" @click="printBtn">打印</button>
  <br />
  <br />

  <div class="list" ref="printListBox">
    <div class="content" v-for="item in list" :key="item">
      <img src="@/assets/logo.png" alt="" />
      <div>我是打印盒子{{ item }}</div>
      <!-- 在你需要分页的位置加上 -->
      <div style="page-break-after: always"></div>
    </div>
  </div>
</template>

<style>
.content {
  background: #e73535;
  color: #fff;
  margin-bottom: 20px;
}
/* 解决背景色打印不出来得问题 */
@media print {
  .content {
    background: #e73535;
    color: #fff;
    margin-bottom: 20px;
    -webkit-print-color-adjust: exact;
  }
}
</style>
