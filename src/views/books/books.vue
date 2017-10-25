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
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="bookName" label="书名" sortable></el-table-column>
            <el-table-column prop="authorName" label="作者" sortable></el-table-column>
            <el-table-column label="封面图片">
                <template slot-scope="scope">
                    <a target="_blank" style="text-decoration: none;color: #1f2d3d;" :href="scope.row.imageUrl">{{scope.row.imageExists == 0?'':'查看图片'}}</a>
                    {{scope.row.imageExists == 0?'默认图片':''}}
                </template>
            </el-table-column>
            <el-table-column prop="lastUpdateChapterName" label="最后更新章节" :formatter="getTime" sortable></el-table-column>
            <el-table-column prop="isVip" label="VIP阅读" :formatter="isVip" sortable></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="getTime" sortable></el-table-column>
            <el-table-column prop="categoryName" label="分类名称" sortable></el-table-column>
            <el-table-column prop="bookStatus" :formatter="bookStatus" label="连本/完载" sortable></el-table-column>
            <el-table-column prop="auditStatus" label="书籍审核状态" :formatter="auditStatus" sortable></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="moveToPage(scope.$index, scope.row)">章节</el-button>
                    <el-button :type="scope.row.enable=='0'?'primary':'danger'" size="small" @click="handleDel(scope.$index, scope.row)">{{scope.row.enable == "0"?"无效":"有效"}}</el-button>
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
                <el-form-item label="书名" prop="bookName">
                    <el-input v-model="editForm.bookName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="authorName">
                    <el-input v-model="editForm.authorName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="editForm.keywords" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类名称">
                    <el-select v-model="editForm.categoryId" placeholder="请选择分类所在位置">
                        <el-option @click.native="changeLoc" v-for="item in category" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否是VIP">
                    <el-radio-group v-model="editForm.isVip">
                        <el-radio class="radio" :label="1">VIP</el-radio>
                        <el-radio class="radio" :label="0">免费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="连载/完本">
                    <el-radio-group v-model="editForm.bookStatus">
                        <el-radio class="radio" :label="1">完本</el-radio>
                        <el-radio class="radio" :label="2">连载</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="书籍状态">
                    <el-radio-group v-model="editForm.enable">
                        <el-radio class="radio" :label="0">无效</el-radio>
                        <el-radio class="radio" :label="1">有效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计费方式">
                    <el-radio-group v-model="editForm.billingType">
                        <el-radio class="radio" :label="1002">单章计费</el-radio>
                        <el-radio class="radio" :label="1001">整本购买</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="上传图片" prop="imageUrl">
                    <el-upload
                            class="upload-demo"
                            :action="fileLoadUrl"
                            :on-success="fileSuccess"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <div v-html="fileImg">{{fileImg}}</div>
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
                <el-form-item label="书名" prop="bookName">
                    <el-input v-model="addForm.bookName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="authorName">
                    <el-input v-model="addForm.authorName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="addForm.keywords" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类名称">
                    <el-select v-model="addForm.categoryId" placeholder="请选择分类所在位置">
                        <el-option @click.native="changeLoc" v-for="item in category" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否是VIP">
                    <el-radio-group v-model="addForm.isVip">
                        <el-radio class="radio" :label="1">VIP</el-radio>
                        <el-radio class="radio" :label="0">免费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="连载/完本">
                    <el-radio-group v-model="addForm.bookStatus">
                        <el-radio class="radio" :label="1">完本</el-radio>
                        <el-radio class="radio" :label="2">连载</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="书籍状态">
                    <el-radio-group v-model="addForm.enable">
                        <el-radio class="radio" :label="0">无效</el-radio>
                        <el-radio class="radio" :label="1">有效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计费方式">
                    <el-radio-group v-model="addForm.billingType">
                        <el-radio class="radio" :label="1002">单章计费</el-radio>
                        <el-radio class="radio" :label="1001">整本购买</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传图片" prop="imageUrl">
                    <el-upload
                            class="upload-demo"
                            :action="fileLoadUrl"
                            :on-success="fileSuccess"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <div v-html="fileImg">{{fileImg}}</div>
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
                fileLoadUrl: this.$url + 'book/info/upload',
                fileImg:'',
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    bookName: [
                        { required: true, message: '请输入书籍名称', trigger: 'blur' }
                    ],
                    authorName: [
                        { required: true, message: '请输入作者名字', trigger: 'blur' }
                    ],
                    categoryName: [
                        { required: true, message: '请输入分类名字', trigger: 'blur' }
                    ],
                    keywords: [
                        { required: true, message: '请输入关键字', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    bookName:'',
                    authorName:'',
                    categoryId:'',
                    keywords:'',
                    bookStatus:'',
                    isVip:'',
                    enable:'',
                    billingType:'',
                    imageUrl:''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    bookName: [
                        { required: true, message: '请输入书籍名称', trigger: 'blur' }
                    ],
                    authorName: [
                        { required: true, message: '请输入作者名字', trigger: 'blur' }
                    ],
                    categoryName: [
                        { required: true, message: '请输入分类名字', trigger: 'blur' }
                    ],
                    keywords: [
                        { required: true, message: '请输入关键字', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    bookName:'',
                    authorName:'',
                    categoryId:'',
                    keywords:'',
                    bookStatus:'',
                    isVip:'',
                    enable:'',
                    billingType:'',
                    imageUrl:''
                },
                fileList: [],
                category:[

                ]
            }
        },
        methods: {
            //书籍封面图片是否存在
            isVip: function (row, column) {
                return row.isVip == 0 ? '免费' : row.isVip == 1 ? 'VIP' : '';
            },
            // 书籍连载装填
            bookStatus: function (row, column) {
                return row.bookStatus == 1 ? '完本' : row.bookStatus == 2 ? '连载' : '连载';
            },
            // 书籍审核状态
            auditStatus: function (row, column) {
                return row.auditStatus == 0 ? '未审核' : row.auditStatus == 1 ? '审核通过' : '暂无状态';
            },
            // 文件上传
            fileSuccess(res, file, fileList){
                if(res.code == 1000){
                    this.fileImg = '<img style="width: 120px;height: 180px" src="'+res.data.image+'">'
                    this.editForm.imageUrl = res.data.image;
                    this.addForm.imageUrl = res.data.image;
                }
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
           // 获取书籍分类
            changeLoc: function(){
                var that = this
                this.$get('category/page?loc=1', {}, function(res){
                    that.category = res.data.list;
                })
            },
            //获取用户列表
            getUsers() {
                let para = {
                    pageNumber: this.page,
                    pageSize: 20
                };
                this.listLoading = true;
                var that = this
                this.$get('book', para, function(res){
                    that.total = res.data.total;
                    that.users = res.data.list;
                    that.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认要操作该书籍吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id,enable: row.enable == 0?1:0};
                    var that = this;
                    this.$post('book/info/enable',para,function(data){
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
                this.fileImg = '<img style="width: 120px;height: 180px" src="'+ row.imageUrl +'">';
                this.$post('book/query',{id:row.id},function(data){
                    data.data.billingType = Number(data.data.billingType);
                    that.editForm = Object.assign({}, data.data);
                })
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    bookName:'',
                    authorName:'',
                    categoryId:'',
                    keywords:'',
                    bookStatus:1,
                    isVip:1,
                    enable:0,
                    billingType:1002,
                    imageUrl:''
                };
                this.fileImg = ''
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
                            this.$post('book/save',para,function(res){
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
                            this.$post('book/save',para,function(res){
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
            // 跳转到章节页面
            moveToPage: function (index, row) {
                localStorage.setItem('bookId', row.id)
                this.$router.push({ path: './bookchap' });
            },
            // 格式化时间
            getTime: function (row, column) {
                return this.$moment(row.updateTime)
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
            this.changeLoc();
        }
    }

</script>

<style scoped>

</style>