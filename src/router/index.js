import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // index page
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Online Education', icon: 'dashboard' }
    }]
  },


  // Lecturer Management Router
  {
    path: '/edu/lecturer',
    component: Layout,
    redirect: '/edu/lecturer/list',
    name: 'Lecturer',
    meta: { title: 'Lecturer', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'EduLecturerList',
        component: () => import('@/views/edu/lecturer/list'),
        meta: { title: 'List', icon: 'table' }
      },
      {
        path: 'add',
        name: 'EduLecturerAdd',
        component: () => import('@/views/edu/lecturer/form'),
        meta: { title: 'Add',icon: 'form' }
      },
      {
        path: 'update/:id',
        name: 'EduLecturerUpdate',
        component: () => import('@/views/edu/lecturer/form'),
        meta: { title: 'Update Lecturer', noCache: true },
        hidden: true
      }
    ]
  },

  //course subject route
  {
    path: '/edu/subject',
    component: Layout,
    redirect: '/edu/subject/list',
    name: 'Subject',
    meta: { title: 'Subject', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: 'EduSubjectList',
        component: () => import('@/views/edu/subject/list'),
        meta: { title: 'List',icon: 'tree'}
      },
      {
        path: 'import',
        name: 'EduSubjectImport',
        component: () => import('@/views/edu/subject/import'),
        meta: { title: 'Import',icon: 'form'}
      }
    ]
  },

  //Course Management
  {
    path: '/edu/course',
    component: Layout,
    redirect: '/edu/course/list',
    name: 'Course',
    meta: { title: 'Course', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'EduCourseList',
        component: () => import('@/views/edu/course/list'),
        meta: { title: 'List', icon: 'table'}
      },
      {
        path: 'info',
        name: 'EduCourseInfo',
        component: () => import('@/views/edu/course/info'),
        meta: { title: 'Publish', icon:'form'}
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: 'Update Course', noCache: true },
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'EduCourseChapterEdit',
        component: () => import('@/views/edu/course/chapter'),
        meta: { title: 'Edit Course Chapter', noCache: true },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: 'Publish Course', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/haveacupofcoffee',
        meta: { title: 'Git Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
