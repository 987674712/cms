<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <!--<el-form-item>-->
                <!--<el-input v-model="filters.name" placeholder="姓名"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                <!--<el-button type="primary" v-on:click="getUsers">查询</el-button>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" label="用户姓名" sortable></el-table-column>
            <el-table-column prop="status" label="角色状态" :formatter="formatStatus" sortable></el-table-column>
            <el-table-column prop="registerDate" label="注册时间" sortable></el-table-column>
            <el-table-column prop="email" label="电子邮箱" sortable></el-table-column>
            <el-table-column prop="telephone" label="用户电话" sortable></el-table-column>
            <el-table-column prop="desp" label="备注" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="用户姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户电话" prop="telephone">
                    <el-input v-model="editForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="desp">
                    <el-input v-model="editForm.desp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="用户姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="loginName">
                    <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="addForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户电话" prop="telephone">
                    <el-input v-model="addForm.telephone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="desp">
                    <el-input v-model="addForm.desp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script type="text/ecmascript-6">
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' }
                    ],
                    telephone: [
                        { required: true, message: '请输入用户手机号码', trigger: 'blur' }
                    ],
                    desp: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    "id": '',
                    "name": "",
                    "email": "",
                    "telephone": '',
                    "desp":''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' }
                    ],
                    loginName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' }
                    ],
                    telephone: [
                        { required: true, message: '请输入用户手机号码', trigger: 'blur' }
                    ],
                    desp: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    "name": "",
                    "loginName": "",
                    "password": '',
                    "desp": '',
                    "rolelist": []
                }

            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            // 角色状态转换
            formatStatus: function (row, column) {
                return row.status == 'disabled' ? '无效' : row.status == 'enabled' ? '有效' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    pageNumber: this.page,
                    pageSize: 20
                };
                this.listLoading = true;
                var that = this
                //NProgress.start();
                this.$get('user/list', para, function(res){
                    that.total = res.data.total;
                    that.users = res.data.list;
                    that.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认要操作该用户吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    var that = this;
                    this.$post('user/delete',{},function(data){
                        that.listLoading = false;
                        that.$message({
                            message: data.msg,
                            type: 'success'
                        });
                        that.getUsers();
                    },para)
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    "name": "",
                    "loginName": "",
                    "password": '',
                    "desp": '',
                    "rolelist": []
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
//							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            var that = this;
                            this.$post('user/update',para,function(res){
                                that.editLoading = false;
                                //NProgress.done();
                                that.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                that.$refs['editForm'].resetFields();
                                that.editFormVisible = false;
                                that.getUsers();
                            },{id:para.id})
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
//							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            console.log(para)
                            var that = this;
                            this.$post('user/add',para,function(res){
                                that.addLoading = false;
                                that.$message({
                                    message: res.data,
                                    type: 'success'
                                });
                                that.$refs['addForm'].resetFields();
                                that.addFormVisible = false;
                                that.getUsers();
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>