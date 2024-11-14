
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "Login",
            component: () => import("../pages/Login.vue"),
        },
        {
            path: "/",
            component: () => import("../components/global/Container.vue"),
            redirect: "/",
            children: [
                {
                    path: "/",
                    name: "Home",
                    component: () => import("../pages/Home.vue"),
                },
                {
                    path: "/blogedit",
                    name: "Edit",
                    component: () => import("../pages/BlogAdd.vue"),
                },
                {
                    path: "/blogcate",
                    name: "Cate",
                    component: () => import("../pages/BlogCate.vue"),
                },
                {
                    path: "/workcate",
                    name: "WorkCate",
                    component: () => import("../pages/WorkCate.vue"),
                },
                {
                    path: "/workadd",
                    name: "WorkAdd",
                    component: () => import("../pages/WorkAdd.vue"),
                },
                {
                    path: "/usercate",
                    name: "UserCate",
                    component: () => import("../pages/UserCate.vue"),
                },
                {
                    path: "/botcate",
                    name: "BotCate",
                    component: () => import("../pages/BotCate.vue"),
                }
            ],
        }
    ]
})

export default router;
