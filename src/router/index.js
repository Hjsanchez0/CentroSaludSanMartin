import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue'
import Registrar from '../pages/Registrar.vue';
import Inicio from '../pages/Inicio.vue';
import DashboardPaciente from '../pages/paciente/Dashboard.vue';
import DashboardAdministrador from '../pages/administrador/Dashboard.vue';
import DashboardAdmision from '../pages/admision/Dashboard.vue';
import DashboardEspecialista from '../pages/especialista/Dashboard.vue'

export const base = "/cs-san-martin";

const routes = [
  { path: `${base}`, component: Home },
  { path: `${base}/inicio`, component: Inicio },
  { path: `${base}/login`, component: Login },
  { path: `${base}/register`, component: Registrar },
  { path: `${base}/dashboard-paciente`, component: DashboardPaciente, meta: { requiresAuth: true } },
  { path: `${base}/dashboard-administrador`, component: DashboardAdministrador, meta: { requiresAuth: true } },
  { path: `${base}/dashboard-admision`, component: DashboardAdmision, meta: { requiresAuth: true } },
  { path: `${base}/dashboard-especialista`, component: DashboardEspecialista, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next(`${base}`);
  } else if (to.meta.requiresAuth && isAuthenticated) {
    if (to.path === `${base}/dashboard-administrador` && role === "Administrador") {
      next();
    } else if (to.path === `${base}/dashboard-paciente` && role === "paciente") {
      next();
    } else if (to.path === `${base}/dashboard-admision` && role === "Admision") {
      next();
    } else if (to.path === `${base}/dashboard-especialista` && (role === "Medicina General" || 
      role === "Enfermeria" || role === "Nutricion" || role === "Obstetricia" || 
      role === "Odontologia" || role === "Psicologia")) {
      next();
    }
    else {
      next();
    }
  } else {
    next();
  }
});

export default router;
