const routes = [
    {
        path: '/signup',
        component: () => import('layouts/SignUp.vue'),
        children: [
            { path: 'first-step', component: () => import('pages/SignUpFirstStep.vue') },
            { path: 'second-step', component: () => import('pages/SignUpSecondStep.vue') },
            { path: 'third-step', component: () => import('pages/SignUpThirdStep.vue') }
        ]
    },
    {
        path: '/',
        component: () => import('layouts/MyLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Index.vue') },
            { path: 'ticket', component: () => import('pages/Ticket.vue') }
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
