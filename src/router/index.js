import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "../store/modules/user"

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
                    path: "/botcate",
                    name: "BotCate",
                    component: () => import("../pages/BotCate.vue"),
                },
                {
                    path: "/user",
                    name: "User",
                    component: () => import("../pages/UserCenter.vue")
                }
            ],
        }
    ]
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.path === "/login") {
        next();
    } else {
        if (userStore.isLogin) {
            console.log("已经登录");
            next();
        } else {
            console.log("没有登录");
            next("/login");
        }
    }
})

export default router;
