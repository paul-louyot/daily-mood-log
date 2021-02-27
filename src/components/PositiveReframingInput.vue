<template>
  <b-row class="my-2" :key="category">
    <b-col sm="3" class="d-flex align-items-center">
      <div>{{ $t(category) }}</div>
    </b-col>
    <b-col sm="8">
      <b-form-input
        v-model="value"
        placeholder="Avantages, valeurs centrales"
        ></b-form-input>
    </b-col>
    <b-col
      class="d-flex justify-content-center align-items-center"
      v-on:click="toggleDetail"
      style="cursor: pointer"
      sm="1"
      >
      <icon-base
        class="d-none d-sm-inline pointer no-select"
        icon-name="question-mark"
        v-b-popover.hover.right="hint"
      >
        <question-mark />
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

export default {
  components: {
    IconBase,
    QuestionMark
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
