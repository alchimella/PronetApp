const routes = [
    {
        path: '/',
        component: () => import('layouts/MyLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Index.vue') },
            { path: 'ticket', component: () => import('pages/Ticket.vue') },
            { path: 'default', component: () => import('pages/Default.vue') },
            { path: 'login', component: () => import('pages/Login.vue') },
        ]
    }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue')
    })
}

export default routes
