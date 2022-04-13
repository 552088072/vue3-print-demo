<script setup>
import router from "@/router";
const toPagesPrint = () => {
  router.push("/pagesPrint");
};
</script>

<template>
  <router-link to="/windowPrint"> 不生成PDF直接打印 </router-link>
  <br />
  <br />
  <br />
  <router-link to="/windowPagesPrint">
    不生成PDF使用windows的方法分页打印
  </router-link>
  <br />
  <br />
  <br />
  <button @click="$router.push('/pdfPrint')">生成PDF单个打印</button>
  <br />
  <br />
  <br />
  <button @click="toPagesPrint">生成PDF多个分页打印</button>
</template>

<style></style>
