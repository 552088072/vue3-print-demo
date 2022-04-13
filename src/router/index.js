import { createRouter, createWebHistory } from "vue-router";
import windowPrint from "@/view/windowPrint.vue";
import windowPagesPrint from "@/view/windowPagesPrint.vue";
import pdfPrint from "@/view/pdfPrint.vue";
import pagesPrint from "@/view/pagesPrint.vue";
import index from "@/view/index.vue";

const routes = [
  {
    name: "",
    path: "/",
    component: index,
  },
  {
    name: "pdfPrint",
    path: "/pdfPrint",
    component: pdfPrint,
  },
  {
    name: "windowPrint",
    path: "/windowPrint",
    component: windowPrint,
  },
  {
    name: "windowPagesPrint",
    path: "/windowPagesPrint",
    component: windowPagesPrint,
  },
  {
    name: "pagesPrint",
    path: "/pagesPrint",
    component: pagesPrint,
  }
];

const router = createRouter({
  history: createWebHistory(), //createWebHashHistory() hash模式
  routes: routes,
});

export default router;
