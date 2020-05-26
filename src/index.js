import dva from 'dva';
import './index.less';

// 1. Initialize
const app = dva({
  onStateChange: (val) => {
    console.log(val)
  },
});

// 3. Model
// app.model(require('./models/products').default);

// 3. Model
// 自动扫包models  ,不用每次手动添加
require('./models').default.map(item => app.model(item.default))

// 4. Router
app.router(require('../src/routes/router').default);

// 5. Start
app.start('#root');

