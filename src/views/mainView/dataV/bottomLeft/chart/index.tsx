import { defineComponent, reactive, onMounted } from 'vue'
import Draw from './draw'

export default defineComponent({
  components: {
    Draw
  },
  setup() {
    const cdata = reactive({
      category: [
        '乳腺癌',
        '血癌',
        '喉癌下咽癌',
      ],
      barData1: [
        2404,
        1765,
        1574,
      ],
      barData2: [
        1054,
        564,
        486,
      ],
      barData3: [
        284,
        125,
        122,
      ],
      barData4: [
        1508,
        864,
        768,
      ],
      rateData: []
    })

    // methods
    const setData = () => {
      for (let i = 0; i < cdata.barData1.length; i++) {
        const rate = cdata.barData3[i] / cdata.barData2[i]
        cdata.rateData.push(rate.toFixed(2))
      }
    }

    // 生命周期
    onMounted(() => {
      setData()
    })

    return () => {
      return <div>
        <Draw cdata={cdata} />
      </div>
    }
  }
})
