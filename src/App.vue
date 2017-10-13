<template>
  <div id="app">
    <header>
      <img src="./assets/nav.png" style="width: 100%;height: 100px" alt="">
    </header>
    <div class="content">
      <div class="tab left">
        <el-row class="tac">
          <el-col :span="8">
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
              <el-submenu index="1">
                <template slot="title"><i class="el-icon-menu"></i>管理</template>
                <el-menu-item-group>
                  <router-link to="/user">
                    <el-menu-item index="1-1">
                      角色管理
                    </el-menu-item>
                  </router-link>
                  <router-link to="/footer">
                    <el-menu-item index="1-2">
                      用户管理
                    </el-menu-item>
                  </router-link>
                  <router-link to="/body">
                    <el-menu-item index="1-3">
                      资源管理
                    </el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <!--<el-menu-item index="2"><i class="el-icon-menu"></i>导航二</el-menu-item>-->
              <!--<el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>-->
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style>
  header {
    height: 100px
  }

  .tab {
    width: 200px;
    float: left
  }

  .el-col-8 {
    width: 100%!important;
  }

  .content {
    width: 1360px;
    margin: auto;
    overflow: hidden;
  }
  .right{float: left}
</style>
