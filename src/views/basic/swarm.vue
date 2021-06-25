<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="节点主机">
          <el-input v-model="search.name" placeholder="节点主机" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddMore()">
          批量添加
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="a"
        label="节点主机"
        align="center"
      />
      <el-table-column
        prop="b"
        label="内网IP"
        align="center"
      />
      <el-table-column
        prop="c"
        label="内网DEBUG-PORT"
        align="center"
      />
      <el-table-column
        prop="d"
        label="外网IP"
        align="center"
      />
      <el-table-column
        prop="e"
        label="外网DEBUG-PORT"
        align="center"
      />
      <el-table-column
        prop="f"
        label="节点位置"
        align="center"
      />
      <el-table-column
        prop="g"
        label="备注"
        align="center"
      />
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <swarm-add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

    <!-- 批量 -->
    <add-more
      v-if="addMoreVisible"
      ref="addMore"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/swarm'
import SwarmAddOrUpdate from './components/SwarmAddOrUpdate'
import addMore from './components/addMore'

export default {
  name: 'Swarm',
  components: { Pagination, SwarmAddOrUpdate, addMore },
  data() {
    return {
      list: [
        { id: 1, a: '新加坡-ecs-i2-bee102', b: '161.117.177.58', c: '1135', d: '161.117.177.58', e: '1135', f: '海外', g: '备注' }
      ],
      search: {
        name: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      loading: false,
      addOrUpdateVisible: false,
      addMoreVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      //this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          if (response.code !== 0) return
          // this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onAddMore() {
      this.addMoreVisible = true
      this.$nextTick(() => {
        this.$refs.addMore && this.$refs.addMore.init()
      })
    },
    onDelete({ a, id }) {
      this.$confirm(`确定对[${a}](#${id})进行[删除]操作?`, '删除', {
          type: 'error',
          cancelButtonClass: 'btn-custom-cancel'
        }
      )
        .then(() => {
          deleteData(id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
