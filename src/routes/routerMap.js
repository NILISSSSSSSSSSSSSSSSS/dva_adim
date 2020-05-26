
import main from '../pages/main/index';
import vipList from '../pages/vipList/index';
import products from '../pages/products/index';
import company from '../pages/company/index';
export const routes = [
  { path: "/main", name: "main", component: main },
  { path: "/vipList", name: "vipList", component: vipList },
  { path: "/company", name: "company", component: company },
  { path: "/products", name: "products", component: products },
]