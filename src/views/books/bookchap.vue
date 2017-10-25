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
                <el-form-item style="float: right">
                    <el-button type="primary" @click="moveToBooks">返回</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="chapterName" label="章节名称" sortable></el-table-column>
            <el-table-column prop="orderIndex" label="排序编号" sortable></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="getTime" sortable></el-table-column>
            <el-table-column prop="wordCount" label="内容字数" sortable></el-table-column>
            <el-table-column prop="isVip" label="收费/免费" :formatter="isVip" sortable></el-table-column>
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
                <el-form-item label="章节名称" prop="chapterName">
                    <el-input v-model="editForm.chapterName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序编号" prop="orderIndex">
                    <el-input v-model.number="editForm.orderIndex" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否收费">
                    <el-radio-group v-model="editForm.isVip">
                        <el-radio class="radio" :label="1">收费章节</el-radio>
                        <el-radio class="radio" :label="0">免费章节</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="章节内容" prop="chapterContent">
                    <el-input :rows="10" type="textarea" v-model="editForm.chapterContent" auto-complete="off"></el-input>
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
                <el-form-item label="章节名称" prop="chapterName">
                    <el-input v-model="addForm.chapterName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序编号" prop="orderIndex">
                    <el-input v-model.number="addForm.orderIndex" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否收费">
                    <el-radio-group v-model="addForm.isVip">
                        <el-radio class="radio" :label="1">收费章节</el-radio>
                        <el-radio class="radio" :label="0">免费章节</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="章节内容" prop="chapterContent">
                    <el-input :rows="10" type="textarea" v-model="addForm.chapterContent" auto-complete="off"></el-input>
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
                    chapterName: [
                        { required: true, message: '请输入章节名称', trigger: 'blur' }
                    ],
                    chapterContent: [
                        { required: true, message: '请输入章节内容', trigger: 'blur' }
                    ],
                    orderIndex: [
                        { required: true, message: '请输入排序编号' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    chapterName: '',
                    orderIndex: '',
                    chapterContent: '',
                    isVip: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    chapterName: [
                        { required: true, message: '请输入章节名称', trigger: 'blur' }
                    ],
                    chapterContent: [
                        { required: true, message: '请输入章节内容', trigger: 'blur' }
                    ],
                    orderIndex: [
                        { required: true, message: '请输入排序编号'},{ type: 'number', message: '排序编号必须为数字值'}
                    ]
                },
                //新增界面数据
                addForm: {
                    chapterName:'',
                    orderIndex:'',
                    chapterContent:'',
                    isVip:'',
                    bookId:localStorage.getItem('bookId')
                }
            }
        },
        methods: {
            //书籍封面图片是否存在
            isVip: function (row, column) {
                return row.isVip == 0 ? '免费章节' : row.isVip == 1 ? '收费章节' : '';
            },
            // 书籍连载装填
            bookStatus: function (row, column) {
                return row.bookStatus == 1 ? '完本' : row.bookStatus == 2 ? '连载' : '连载';
            },
            // 书籍审核状态
            auditStatus: function (row, column) {
                return row.auditStatus == 0 ? '未审核' : row.auditStatus == 1 ? '审核通过' : '暂无状态';
            },
            // 格式化时间
            getTime: function (row, column) {
                return this.$moment(row.updateTime)
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers () {
                let para = {
                    pageNumber: this.page,
                    pageSize: 20
                };
                this.listLoading = true;
                var that = this
                var id = localStorage.getItem('bookId')
//                'chapter/page?bookId=' + id
                this.$get('chapter/page?bookId=' + id, para, function(res){
                    that.total = res.data.total;
                    that.users = res.data.list;
                    that.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认要删除该章节吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id,enable: row.bookStatus == 0?1:0};
                    var that = this;
                    this.$post('chapter/delete/' + row.id,{},function(data){
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
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                var that = this
                this.$get('chapter/getChapterById',{},function(data){
                    that.editForm = Object.assign({}, data.data);
                },{id:row.id})

            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    chapterName:'',
                    orderIndex:'',
                    chapterContent:'',
                    isVip:1,
                    bookId:localStorage.getItem('bookId')
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
                            var that = this;
                            this.$post('chapter/create',para,function(res){
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
                            this.$post('chapter/create',para,function(res){
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
            // 退回到书籍页面
            moveToBooks: function () {
                this.$router.push({ path: './books' });
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