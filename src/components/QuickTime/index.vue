<template>
  <div>
    <el-button v-for="(button,index) in timebuttons" :key="index" class="filter-item" type="default" @click="timeclick(button)">
      {{ timeName[button] }}
    </el-button>
  </div>
</template>

<script>
import { dateVal } from '@/utils/index'
export default {
  name: 'QuickTime',
  /** 今天：day  昨天：preday1 前天 preday2
   *  本周 week  上周 preweek1
   *  本月 month 上月 premonth1
   */
  props: {
    buttons: {
      type: String,
      default: 'day,preday1,preday2,week,preweek1,month,premonth1'
    }
  },
  data() {
    return {
      timebuttons: [],
      timeName: {
        day: '今天',
        preday1: '昨天',
        preday2: '前天',
        week: '本周',
        preweek1: '上周',
        month: '本月',
        premonth1: '上月'
      },
      timeArea: {
        begin: '',
        end: ''
      }
    }
  },
  created() {
    this.timebuttons = this.buttons.split(',')
  },
  methods: {
    timeclick(button) {
      if (button === 'day') {
        this.timeArea.begin = dateVal().day_start
        this.timeArea.end = dateVal().day_end
      } else if (button === 'preday1') {
        this.timeArea.begin = dateVal().preday_start
        this.timeArea.end = dateVal().preday_end
      } else if (button === 'preday2') {
        this.timeArea.begin = dateVal().pre2day_start
        this.timeArea.end = dateVal().pre2day_end
      } else if (button === 'week') {
        this.timeArea.begin = dateVal().week_start
        this.timeArea.end = dateVal().week_end
      } else if (button === 'preweek1') {
        this.timeArea.begin = dateVal().preweek_start
        this.timeArea.end = dateVal().preweek_end
      } else if (button === 'month') {
        this.timeArea.begin = dateVal().month_start
        this.timeArea.end = dateVal().month_end
      } else if (button === 'premonth1') {
        this.timeArea.begin = dateVal().premonth_start
        this.timeArea.end = dateVal().premonth_end
      }
      this.$emit('queryByButtonTime', this.timeArea)
    }
  }
}
</script>
