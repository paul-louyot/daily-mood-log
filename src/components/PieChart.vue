<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  data(){
    return {
    }
  },
  props: {
    data: {
      type: Object,
    },
    options: {
      type: Object,
    }
  },
  mounted () {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data: function(){
      //this.renderChart(this.data, this.options);
    }
  }
}
</script>
