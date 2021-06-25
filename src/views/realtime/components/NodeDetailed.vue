<template>
  <el-dialog title="节点详细信息" :visible.sync="visible" @closed="onClose()">
    <p>
      <el-row>
        <el-col :span="24">
          节点服务器名称：{{ data.svr_name }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          内部IP地址：{{ data.inet_ip }}
          <el-divider direction="vertical"></el-divider>
          内部DEBUG端口：{{ data.inet_debug_port }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          公网IP地址：{{ data.inet_ip }}
          <el-divider direction="vertical"></el-divider>
          公网DEBUG端口：{{ data.inet_debug_port }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          钱包地址：{{ data.ethereum || '-' }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          支票本地址：{{ data.chequebookAddress || '-' }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          (公钥)publicKey：{{ data.publicKey || '-' }}
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row>
        <el-col :span="24">
          (签名)pssPublicKey：{{ data.pssPublicKey || '-' }}
        </el-col>
      </el-row>
    </p>
    <el-divider content-position="left">节点配置信息 0</el-divider>

    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="配置字段"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'NodeDetailed',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      data: {
        id: 0,
        svr_name: '',
        inet_debug_port: 0,
        inet_ip: '',
        wan_debug_port: 0,
        wan_ip: '',
        ethereum: '',
        chequebookAddress: '',
        publicKey: '',
        pssPublicKey: ''
      },
      list: []
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.data = Object.assign({}, data)
      }
    },
    onClose() {
      this.$reset('data', false)
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog {
  width: 1000px;
}
</style>
