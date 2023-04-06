import { defineComponent, reactive } from 'vue'
import Draw from './draw'

export default defineComponent({
  components: {
    Draw
  },
  setup() {
    const cdata = reactive([
      {
        // 名字需要与 “common/map/fujian.js” 地图数据文件里面定义的一一对应，不能是 “福州” 或者 “闽” 之类的缩写
        name: '福州市',
        value: 1010,
        elseData: {
          // 这里放置地图 tooltip 里想显示的数据
        }
      },
      {
        name: '湛江',
        value: 35842
      },
      {
        name: '茂名',
        value: 8001
      },
      {
        name: '阳江',
        value: 7101
      },
      {
        name: '云浮',
        value: 6101
      },
      {
        name: '江门',
        value: 12846
      },
      {
        name: '中山',
        value: 4010
      },
      {
        name: '珠海',
        value: 30101
      },
      {
        name: '佛山',
        value: 28857
      },
      {
        name: '肇庆',
        value: 22467
      },
      {
        name: '清远',
        value: 6453
      },
      {
        name: '广州',
        value: 51482
      },
      {
        name: '深圳',
        value: 48957
      },
      {
        name: '东莞',
        value: 35482
      },
      {
        name: '惠州',
        value: 7687
      },
      {
        name: '韶关',
        value: 14355
      },
      {
        name: '河源',
        value: 6851
      },
      {
        name: '梅州',
        value: 3967
      },
      {
        name: '潮州',
        value: 4387
      },
      {
        name: '揭阳',
        value: 5896
      },
      {
        name: '汕尾',
        value: 1587
      },
      {
        name: '汕头',
        value: 24851
      }

    ])

    return () => {
      return <div>
        <Draw cdata={cdata} />
      </div>
    }
  }
})
