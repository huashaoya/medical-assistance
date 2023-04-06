<template>
  <div class="centerRight1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span>
          <i class="iconfont icon-align-left" />
        </span>
        <span class="fs-xl text mx-2">本月看癌人数统计</span>
      </div>
      <div class="d-flex ai-center flex-column body-box">
        <dv-capsule-chart class="dv-cap-chart" :config="config" />
        <chart />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import Chart from './chart/index.tsx'

export default defineComponent({
  components: {
    Chart
  },
  setup() {
    const config = reactive({
      data: [
        {
          name: '未确诊',
          value: 167
        },
        {
          name: '乳腺癌',
          value: 123
        },
        {
          name: '血癌',
          value: 60
        },
        {
          name: '喉癌下咽癌',
          value: 55
        },
        {
          name: '有症状',
          value: 98
        }
      ]
    })

    return { config }
  }
})
</script>

<style lang="scss" scoped>
$box-height: 400px;
$box-width: 340px;

.centerRight1 {
  padding: 5px;
  height: $box-height;
  width: $box-width;
  border-radius: 5px;

  .bg-color-black {
    padding: 5px;
    height: $box-height;
    width: $box-width;
    border-radius: 10px;
  }

  .text {
    color: #c3cbde;
  }

  .body-box {
    border-radius: 10px;
    overflow: hidden;

    .dv-cap-chart {
      width: 100%;
      height: 160px;
    }
  }
}</style>
