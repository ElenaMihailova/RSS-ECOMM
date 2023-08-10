import Router from 'vanilla-router';

const router = new Router({
  mode: 'history',
  page404: (path): void => {
    console.log(`'"/'${path}'" Page not found'`);
  },
});

router.addUriListener();

export default router;
