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
        24045,
        17654,
        15748,
      ],
      barData2: [
        10546,
        5642,
        4865,
      ],
      barData3: [
        2845,
        1258,
        1228,
      ],
      barData4: [
        15082,
        8647,
        7682,
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
