<template>
  <b-row class="my-2" :key="category">
    <b-col cols="12" sm="3" class="d-flex align-items-center">
      <div class="mb-2 mb-sm-0">
        {{ $t(category) }}
      </div>
    </b-col>
    <b-col
      cols="1"
      class="d-none d-sm-flex justify-content-center align-items-center p-0"
      style="cursor: pointer"
      v-if="hint"
    >
      <icon-base
        class="d-inline pointer no-select"
        icon-name="question-mark"
        v-bind:id="`icon-${category}`"
      >
        <question-mark />
      </icon-base>
      <b-popover
        class="d-none d-sm-inline"
        :target="`icon-${category}`"
        placement="top"
        triggers="hover"
      >
        <span class="d-none d-sm-inline">
          {{ hint }}
        </span>
      </b-popover>
    </b-col>
    <b-col cols="11" sm="7">
      <input
        type="text"
        class="form-control"
        v-model="value"
        placeholder="Avantages, valeurs centrales"
      ></input>
    </b-col>
    <b-col
      cols="1"
      class="d-flex justify-content-center align-items-center p-0 hoverable"
      v-on:click="toggleDetail"
      style="cursor: pointer"
      v-if="hint"
    >
      <icon-base
        class="d-inline pointer no-select"
        icon-name="chevron"
      >
        <chevron-up v-if="showDetail"/>
        <chevron-down v-else/>
      </icon-base>
    </b-col>

    <b-col cols="12" v-if="showDetail">
      <template v-for="(item, i) in detail">
        <div v-bind:key="`title-${i}`" class="mt-2">{{ item.title }}</div>
        <template v-for="(content, j) in item.content">
          <div v-bind:key="`content-${i}-${j}`">
            • {{ content }}
          </div>
        </template>
      </template>
    </b-col>
  </b-row>
</template>

<script>
import IconBase from '~/components/IconBase.vue'
import QuestionMark from '~/components/QuestionMark.vue'
import ChevronDown from '~/components/ChevronDown.vue'
import ChevronUp from '~/components/ChevronUp.vue'

export default {
  components: {
    IconBase,
    QuestionMark,
    ChevronDown,
    ChevronUp
  },
  data() {
    return {
      showDetail: false,
      value: ''
    }
  },
  props: ['category', 'advantages', 'hint', 'detail'],
  methods: {
    toggleDetail(){
      this.showDetail = !this.showDetail;
    }
  },
  watch: {
    value(){
      this.$emit('update:advantages', this.value)
    },
  }
}
</script>

<style scoped>
@media (max-width: 575.98px) {
  .b-popover {
    display: none!important;
  }
}
.hoverable:hover {
  background-color: #EAEAEA;
}
</style>
