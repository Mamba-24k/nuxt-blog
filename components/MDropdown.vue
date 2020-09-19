<template>
  <div class="m-drop" @blur="blurHandle" tabindex="0">
    <header class="m-drop-header d-flex ai-center fs-2xl" @click="showDrop = !showDrop">
      <slot name="icon"></slot>
    </header>
    <nav v-show="showDrop" class="nav fs-2xl" :style="posObj">
      <div v-for="(item, index) in list" :key="index" :class="{'link-text':true, 'disabled': item.disabled}" @click="changeDrop(item)">
        {{item.name}}
      </div>
      <div class="triangle" :style="styleObj"></div>
    </nav>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      },
      posObj: Object,
      styleObj: Object
    },
    data() {
      return {
        showDrop: false
      }
    },
    created() {

    },
    methods: {
      changeDrop(item) {
        this.$emit('toDrop',item)
      },
      blurHandle() {
        this.showDrop= false
        this.$emit('hideDrop',false)
      }
      
    }  
  }
</script>

<style lang="scss">
.m-drop{
  position: relative;
  transform-origin: center top;
}
.nav{
  position: absolute;
  right: 0;
  top: 28px;
  width: 80px;
  background-color: #fff;
  padding: 10px 0;
  margin: 5px 0;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .triangle{
    content: '';   
    position: absolute;
    top: -6px;
    left: 57px;
    margin-right: 3px;
    border-width: 6px;
    border-color: transparent;
    border-style: solid;
    border-top-width: 0;
    border-bottom-color: #fff;
  }
}
.link-text{
  color: #606266;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  &:hover{
    background-color: #fff8ea;
    color: #ffc754;
  }
}
.disabled{
  cursor: not-allowed;
  color: #bbb;
  pointer-events: none;
}
.m-drop-header{
  cursor: pointer;
}
</style>