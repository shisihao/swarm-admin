<template>
  <div class="bottom-container">
    <el-row>
      <el-col :span="16">
        <div class="affiche">
            <marquee scrollamount="4">
              消息提醒: 根据缴费记录,服务将于3日后到期,到期后服务将自动终止,请及时缴费 
            </marquee>
        </div>
      </el-col>
      <el-col :span="4">
        最大节点数：3000
      </el-col>
      <el-col :span="4">
        有效期至：2021-07-31
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.hideSidebar .bottom-container {
  width: calc(100% - 54px);
}
.bottom-container {
  width: calc(100% - 210px);
  height: 30px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 9;    
  border-top: 1px solid #d8dce5;
  box-shadow: 0 -1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  line-height: 30px;
  transition: width 0.28s;
  .affiche {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    color: #F56C6C;
  }
}
</style>
