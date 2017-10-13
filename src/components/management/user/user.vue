<template>
  <div style='padding: 0 10px'>
    <el-button style='margin:10px 0' @click="layer('add')" type='primary'>添加</el-button>
    <el-table :data='list' border style='width: 100%'>
      <el-table-column label='序号' type="index" width='100'>
      </el-table-column>
      <el-table-column prop='name' label='角色姓名' width='150'>
      </el-table-column>
      <el-table-column prop='status' label='角色状态' width='120'>
      </el-table-column>
      <el-table-column prop='nameDesc' label='角色描述' width='120'>
      </el-table-column>
      <el-table-column fixed='right' label='操作' width='100'>
        <template scope='scope'>
          <el-button @click='handleClick(scope.row.statue,scope.row.id)' type='text' size='small'>{{scope.row.statue == '启用'?'停用':'启用'}}</el-button>
          <el-button @click='layer(scope.row)' type='text' size='small'>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="user">
        <el-form-item label="角色姓名" :label-width="formLabelWidth">
          <el-input v-model="user.name" style="width: 217px"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="user.nameDesc" style="width: 217px"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        user: {},
        formLabelWidth: '120px'
      }
    },
    methods: {
      add () {
        this.dialogFormVisible = false
        this.fetch('POST', this.BaseUrl + 'role/add', function (data) {
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
        }, this.user)
      },
      handleClick (row, id) {
        if (row === '启用') {
          this.fetch('POST', this.BaseUrl + 'role/delete', function (data) {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
          }, {}, {id})
        } else {
          this.fetch('POST', this.BaseUrl + 'role/awaken', function (data) {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
          }, {}, {id})
        }
      },
      layer (data) {
        if (data === 'add') {
          this.user = {}
          this.dialogFormVisible = true
        } else {
          this.user = {
            name: data.name,
            nameDesc: data.nameDesc,
            id: data.id
          }
          this.dialogFormVisible = true
        }
      }
    },
    created () {
      var that = this
      this.fetch('GET', this.BaseUrl + 'role/list', function (data) {
        var list = data.data.list
        for (var i in list) {
          list[i].status === 0 ? list[i].status = '停用' : list[i].status = '启用'
        }
        that.list = list
      })
    }
  }
</script>
<style>
  .el-dialog--small{width: 500px!important;}
</style>
