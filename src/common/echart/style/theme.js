const theme = {
  color: ['#2d8cf0', '#19be6b', '#ff9900', '#E46CBB', '#9A66E4', '#ed3f14'],
  backgroundColor: 'rgba(0,0,0,0)',

  title: {

    color: '#516b91',

    subtextStyle: {
      color: '#93b7e3'
    }
  },
  line: {
    itemStyle: {

      borderWidth: '2'

    },
    lineStyle: {

      width: '2'

    },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true
  },
  radar: {
    itemStyle: {

      borderWidth: '2'

    },
    lineStyle: {

      width: '2'

    },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true
  },
  bar: {
    itemStyle: {

      barBorderWidth: 0,
      barBorderColor: '#ccc',

      emphasis: {
        barBorderWidth: 0,
        barBorderColor: '#ccc'
      }
    }
  },
  pie: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  scatter: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  boxplot: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  parallel: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  sankey: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  funnel: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  gauge: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc',

      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc'
      }
    }
  },
  candlestick: {
    itemStyle: {

      color: '#edafda',
      color0: 'transparent',
      borderColor: '#d680bc',
      borderColor0: '#8fd3e8',
      borderWidth: '2'

    }
  },
  graph: {
    itemStyle: {

      borderWidth: 0,
      borderColor: '#ccc'

    },
    lineStyle: {

      width: 1,
      color: '#aaa'

    },
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true,
    color: ['#2d8cf0', '#19be6b', '#f5ae4a', '#9189d5', '#56cae2', '#cbb0e3'],
    label: {

      color: '#eee'

    }
  },
  map: {
    itemStyle: {

      areaColor: '#f3f3f3',
      borderColor: '#516b91',
      borderWidth: 0.5,

      emphasis: {
        areaColor: 'rgba(165,231,240,1)',
        borderColor: '#516b91',
        borderWidth: 1
      }
    },
    label: {

      color: '#000',

      emphasis: {
        color: 'rgb(81,107,145)'
      }
    }
  },
  geo: {
    itemStyle: {

      areaColor: '#f3f3f3',
      borderColor: '#516b91',
      borderWidth: 0.5,

      emphasis: {
        areaColor: 'rgba(165,231,240,1)',
        borderColor: '#516b91',
        borderWidth: 1
      }
    },
    label: {

      color: '#000',

      emphasis: {
        color: 'rgb(81,107,145)'
      }
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#fff'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      color: '#fff'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#eeeeee']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,

      color: '#999999'

    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333'
      }
    },
    axisLabel: {
      show: true,

      color: '#999999'

    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  },
  toolbox: {
    iconStyle: {

      borderColor: '#999',

      emphasis: {
        borderColor: '#666'
      }
    }
  },
  legend: {

    color: '#fff'

  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: '#ccc',
        width: 1
      },
      crossStyle: {
        color: '#ccc',
        width: 1
      }
    }
  },
  timeline: {
    lineStyle: {
      color: '#8fd3e8',
      width: 1
    },
    itemStyle: {

      color: '#8fd3e8',
      borderWidth: 1,

      emphasis: {
        color: '#8fd3e8'
      }
    },
    controlStyle: {

      color: '#8fd3e8',
      borderColor: '#8fd3e8',
      borderWidth: 0.5,

      emphasis: {
        color: '#8fd3e8',
        borderColor: '#8fd3e8',
        borderWidth: 0.5
      }
    },
    checkpointStyle: {
      color: '#8fd3e8',
      borderColor: 'rgba(138,124,168,0.37)'
    },
    label: {

      color: '#8fd3e8',

      emphasis: {

        color: '#8fd3e8'

      }
    }
  },
  visualMap: {
    color: ['#516b91', '#59c4e6', '#a5e7f0']
  },
  dataZoom: {
    backgroundColor: 'rgba(0,0,0,0)',
    dataBackgroundColor: 'rgba(255,255,255,0.3)',
    fillerColor: 'rgba(167,183,204,0.4)',
    handleColor: '#a7b7cc',
    handleSize: '100%',

    color: '#333'

  },
  markPoint: {
    label: {

      color: '#eee',

      emphasis: {

        color: '#eee'

      }
    }
  }
}
export default theme
