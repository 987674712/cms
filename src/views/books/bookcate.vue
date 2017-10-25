<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item label="分类位置">
                    <el-select v-model="locType" placeholder="请选择分类所在位置">
                        <el-option @click.native="changeLoc" v-for="item in location" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="name" label="分类名称" sortable></el-table-column>
            <el-table-column prop="location" :formatter="bookLocation" label="分类位置" sortable></el-table-column>
            <el-table-column prop="bookQuantity" label="分类下书籍数量" sortable></el-table-column>
            <el-table-column prop="showCount" label="分类下显示数量" sortable></el-table-column>
            <el-table-column prop="style" :formatter="bootStyle" label="分类样式（前端）" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="addBook(scope.$index, scope.row)">书籍管理</el-button>
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="显示数量" prop="showCount">
                    <el-input v-model="editForm.showCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类样式">
                    <el-select v-model="editForm.style" placeholder="请选择分类样式">
                        <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类位置">
                    <el-radio-group v-model="editForm.location">
                        <el-radio class="radio" :label="1">书库</el-radio>
                        <el-radio class="radio" :label="2">首页</el-radio>
                    </el-radio-group>
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="显示数量" prop="showCount">
                    <el-input v-model="addForm.showCount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类样式">
                    <el-select v-model="addForm.style" placeholder="请选择分类样式">
                        <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类位置">
                    <el-radio-group v-model="addForm.location">
                        <el-radio class="radio" :label="1">书库</el-radio>
                        <el-radio class="radio" :label="2">首页</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
                </el-pagination>
            </el-col>
        </el-dialog>

        <!--书籍管理界面-->
        <el-dialog size="full" title="书籍分类管理" v-model="bookVisible" :close-on-click-modal="false">
            <div style="width: 48%;float: left;padding:0 10px 0">
                <!--添加-->
                <el-table :data="addBookList" highlight-current-row v-loading="addlistLoading" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection"></el-table-column>11
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="bookName" label="书籍名称" sortable></el-table-column>
                    <el-table-column prop="bookName" label="书籍作者" sortable></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" @click="addBooks(scope.$index, scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="addAllBooks" :disabled="this.sels.length===0">批量添加</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="addBookChangePage" :page-size="20" :total="addBookTotal" style="float:right;">
                    </el-pagination>
                </el-col>
            </div>
            <div style="width: 48%;float: left;padding: 0 10px 0">
                <!--删除-->
                <el-table :data="removeBookList" highlight-current-row v-loading="removelistLoading" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection"></el-table-column>11
                    <el-table-column type="index" width="60"></el-table-column>
                    <el-table-column prop="bookName" label="书籍名称" sortable></el-table-column>
                    <el-table-column prop="bookName" label="书籍作者" sortable></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" @click="removeBooks(scope.$index, scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="addAllBooks" :disabled="this.sels.length===0">批量添加</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="addBookChangePage" :page-size="20" :total="removeBookTotal" style="float:right;">
                    </el-pagination>
                </el-col>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="bookVisible = false">取消</el-button>
                <el-button type="primary" @click.native="bookSubmit" :loading="addLoading">添加书籍</el-button>
                <el-button type="danger" @click.native="" :loading="addLoading">删除书籍</el-button>
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
                addlistLoading: false,
                removelistLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {

                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name:'',
                    location:'',
                    style:'',
                    showCount:''
                },
                bookVisible:false,
                locType:2,
                location: [{
                    value: 1,
                    label: '书库'
                }, {
                    value: 2,
                    label: '首页'
                }],
                options: [{
                    value: 0,
                    label: '无样式'
                },{
                    value: 1,
                    label: '横向多图列表'
                },{
                    value: 2,
                    label: '首行图文列表'
                },{
                    value: 3,
                    label: '图文列表'
                }],
                categoryId:'',
                addBookTotal:'',
                addBookList:[],
                addBookChangePageNum: 1,
                removeBookTotal:'',
                removeBookList:[],
                removeBookChangePageNum: 1
            }
        },
        methods: {
            bootStyle: function (row, column) {
                return row.style == 1 ? '横向多图列表' : row.style == 2 ? '首行图文列表': row.style == 3 ? '图文列表' : '无样式';
            },
            // 书籍连载装填
            bookLocation: function (row, column) {
                return row.location == 1 ? '书库' : row.location == 2 ? '首页': '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //显示书籍列表
            addBook: function (index, row) {
                this.bookVisible = true;
                this.categoryId = row.id;
                this.selected();
                this.unselected();
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
                    name:'',
                    location:1,
                    style:0,
                    showCount:''
                }
            },
            //切换分类位置
            changeLoc: function () {
                this.getUsers();
            },
            // 增加书籍分页
            addBookChangePage(val){
                this.addBookChangePageNum = val
                this.selected();
            },
            // 增加书籍分页
            addBookChangePage(val){
                this.reoveBookChangePageNum = val
                this.selected();
            },
            //获取分类列表
            getUsers() {
                let para = {
                    pageNumber: this.page,
                    pageSize: 20
                };
                this.listLoading = true;
                var that = this
//                'category/page?loc=' + this.locType
                this.$get('category/page?loc=' + this.locType, para, function(res){
                    that.total = res.data.total;
                    that.users = res.data.list;
                    that.listLoading = false;
                })
            },
            //获取未选中书籍列表
            unselected() {
                let para = {
                    pageNumber: this.removeBookChangePageNum,
                    pageSize: 20,
                    categoryId:this.categoryId
                };
                this.removelistLoading = true;
                var that = this
//                'category/page?loc=' + this.locType
                this.$post('book/query/unselected', para, function(res){
                    that.removeBookTotal = res.data.total;
                    that.removeBookList = res.data.list;
                    that.removelistLoading = false;
                })
            },
            //获取选中书籍列表
            selected() {
                var para = {
                    pageNumber: this.addBookChangePageNum,
                    pageSize: 20,
                    categoryId:this.categoryId
                };
                this.addlistLoading = true;
                var that = this
//                'category/page?loc=' + this.locType
                this.$post('book/query/selected', para, function(res){
                    that.addBookTotal = res.data.total;
                    that.addBookList = res.data.list;
                    that.addlistLoading = false;
                })
            },
            // 添加书籍
            addBooks(index,row){
                console.log('添加成功',row.id)
            },
//            添加所有书籍
            addAllBooks(val){

            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认要删除该分类吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {};
                    var that = this;
                    this.$post('category/delete/' + row.id,para,function(data){
                        that.listLoading = false;
                        that.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        that.getUsers();
                    })
                }).catch(() => {

                });
            },
            // 书籍管理
            bookSubmit: function () {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    var that = this;
                    this.$post('category/create',para,function(res){
                        that.editLoading = false;
                        //NProgress.done();
                        that.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        that.editFormVisible = false;
                        that.getUsers();
                    })
                });
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            var that = this;
                            this.$post('category/create',para,function(res){
                                that.editLoading = false;
                                //NProgress.done();
                                that.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                that.$refs['editForm'].resetFields();
                                that.editFormVisible = false;
                                that.getUsers();
                            })
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
                            let para = Object.assign({}, this.addForm);
                            var that = this;
                            this.$post('category/create',para,function(res){
                                that.addLoading = false;
                                that.$message({
                                    message: '操作成功',
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