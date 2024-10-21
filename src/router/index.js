import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/pages/auth/Login.vue'; // Assurez-vous que le chemin est correct

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true }, // Protéger la route avec requiresAuth
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/pages/addUser',
                    name: 'AddUser',
                    component: () => import('@/views/pages/addUser.vue')
                },
                {
                    path: '/pages/listTransaction',
                    name: 'listTransaction',
                    component: () => import('@/views/pages/listTransaction.vue')
                },
                {
                    path: '/pages/addTransaction',
                    name: 'addTransaction',
                    component: () => import('@/views/pages/addTransaction.vue')
                },
                {
                    path: '/pages/listTaux',
                    name: 'listTaux',
                    component: () => import('@/views/pages/listTaux.vue')
                },
                {
                    path: '/pages/actualite',
                    name: ' addActualite',
                    component: () => import('@/views/pages/addActualite.vue')
                },
                {
                    path: '/pages/devise',
                    name: ' addDevise',
                    component: () => import('@/views/pages/AddDevise.vue')
                },
                {
                    path: '/pages/avis',
                    name: ' AddAvis',
                    component: () => import('@/views/pages/AddAvis.vue')
                },
                {
                    path: '/pages/updateUser/:id',
                    name: 'updateUser',
                    component: () => import('@/views/pages/updateUser.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/listUser',
            name: 'listUser',
            component: () => import('@/views/pages/auth/listUser.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
// Guard de navigation pour vérifier l'authentification
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Vérifier si le token existe dans localStorage
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
            next('/login');
        } else {
            next(); // Sinon, permettre l'accès à la page
        }
    } else {
        next(); // Permettre l'accès aux pages publiques
    }
});
export default router;
