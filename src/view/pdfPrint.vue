<script setup>
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import { ref } from "vue";
const box = ref(null);

const createPdf = () => {
  /**
   * JsPDF参数
   * 第一个参数： l：横向  p：纵向
   * 第二个参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"） 需要啥用啥
   * 第三个参数：可以是下面格式，默认为“a4” 如果您想使用自己的格式，只需将大小作为数字数组传递，例如[595.28, 841.89];
   */
  // 定义一个pdf
  const pdf = new JsPDF("", "px");
  // 设置生成的PDF文档
  pdf.setProperties({
    title: "title",
    subject: "打印sn标签",
    author: "J",
    keywords: "javascript, web, pdf, print",
    creator: "creator",
  });
  // 使用 html2Canvas 画个canvas
  html2Canvas(box.value).then((canvas) => {
    const pageData = canvas.toDataURL("image/jpeg", 1);
    pdf.addImage(pageData, "JPEG", 0, 0);
    const blob = pdf.output("blob");
    var blob_url = URL.createObjectURL(blob);
    document.getElementById("iframeBox").src = blob_url;
  });
};
</script>

<template>
  <div>JS生成PDF</div>
  <br />
  <div>我们先来画一个盒子</div>
  <br />
  <div ref="box">
    <div class="content">
      <img src="@/assets/logo.png" alt="" />
      <div>我是打印盒子</div>
    </div>
  </div>
  <br />
  <div>
    <button @click="createPdf">点击打印试试</button>
  </div>
  <iframe id="iframeBox" src="" frameborder="0" ></iframe>
</template>

<style scoped>
.content {
  width: 841px;
  background: #e73535;
  color: #fff;
}
#iframeBox {
  width: 90vw;
  height: 985px;
}
</style>
