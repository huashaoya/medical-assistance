import { defineComponent, onUnmounted, reactive } from 'vue'
import Draw from './draw'

export default defineComponent({
  components: {
    Draw
  },
  setup() {
    let intervalInstance = null
    const cdata = reactive({
      xData: ['乳腺癌（早）', '乳腺癌（中）', '血癌（早）', '血癌（中）', '喉下咽癌（早）', '喉下咽癌（中）'],
      seriesData: [
        { value: 4234, name: '乳腺癌（早）' },
        { value: 4042, name: '血癌（早）' },
        { value: 3250, name: '乳腺癌（中）' },
        { value: 3846, name: '喉下咽癌（早）' },
        { value: 3135, name: '血癌（中）' },
        { value: 3465, name: '喉下咽癌（中）' }
      ]
    })
    intervalInstance = setInterval(() => {
      const data = cdata.seriesData
      cdata.seriesData = data.map((e) => {
        return { value: e.value + 10, name: e.name }
      })
    }, 1000)

    onUnmounted(() => {
      clearInterval(intervalInstance)
    })
    return () => {
      return (
        <div>
          <Draw cdata={cdata} />
        </div>
      )
    }
  }
})
