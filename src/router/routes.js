const routes = [
    {
        path: '/signup',
        component: () => import('layouts/SignUp.vue'),
        children: [
            { path: 'first-step', component: () => import('pages/SignUpFirstStep.vue') },
            { path: 'second-step', component: () => import('pages/SignUpSecondStep.vue') },
            { path: 'third-step', component: () => import('pages/SignUpThirdStep.vue') },
            { path: 'fourth-step', component: () => import('pages/SignUpFourthStep.vue') }
        ]
    },
    {
        path: '/',
        component: () => import('layouts/MyLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Index.vue') },
            { path: 'coupons', component: () => import('pages/Coupons.vue') },
            { path: 'cards', component: () => import('pages/Cards.vue') },
            { path: 'enter-code', component: () => import('pages/EnterCode.vue') },
            { path: 'settings', component: () => import('pages/Settings.vue') },
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
