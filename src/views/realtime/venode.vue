<template>
  <div class="app-container">
    <sticky :sticky-top="84">
      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="节点主机">
            <el-input v-model="search.name" placeholder="节点主机" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-button icon="el-icon-search" @click="getList(1)">
            {{ $t('table.search') }}
          </el-button>
          <el-button :loading="downloadLoading" type="warning" icon="el-icon-download" @click="onHandleDownload">
            {{ $t('table.export') }} Excel
          </el-button>
        </el-form>
          <el-button type="primary" icon="el-icon-s-finance" :disabled="!currentRow.id" @click="onNode(currentRow)">
            节点详情
          </el-button>
          <el-button type="primary" icon="el-icon-s-finance" :disabled="true">
            查看钱包
          </el-button>
          <el-button type="primary" icon="el-icon-s-finance" :disabled="true">
            提取支票
          </el-button>
          <el-button type="primary" icon="el-icon-s-finance" :disabled="true">
            提取所有未兑支票
          </el-button>
          <el-button type="primary" icon="el-icon-s-finance" :disabled="true">
            提取记录
          </el-button>
        <p>
          <el-button :type="item.type" :plain="!(search.status === item.value)"  v-for="item in nodeOptions" @click="search.status = item.value;getList(1)" >{{ `${item.label} ${item.num}` }}</el-button>
        </p>
        <p>
          链接总数：22222
          <el-divider direction="vertical" />
          自动更新：
          <el-switch
            v-model="autoOps.auto"
            active-color="#409EFF"
            inactive-color="#909399">
          </el-switch>
          {{ autoOps.auto ? autoOps.timeFormat : '' }}
        </p>
      </div>
    </sticky>

    <el-table
      ref="singleTable"
      v-loading="loading"
      highlight-current-row
      :data="list"
      @row-click="handleCurrentClick"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        prop="online"
        label="连接状态"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link :type="row.online ? 'success' : 'danger'" :underline="false">{{ row.online | paraphrase(onlineOptions) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="offline_time"
        label="离线时长"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link :type="row.online ? 'success' : 'danger'" :underline="false">{{ row.online ? '--' : row.offline_time }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="svr_name"
        label="节点主机"
        align="center"
      />
      <el-table-column
        prop="version"
        label="运行版本"
        align="center"
      />
      <el-table-column
        prop="inet_ip"
        label="内网IP"
        min-width="90"
        align="center"
      />
      <el-table-column
        prop="inet_debug_port"
        label="内网调试端口"
        align="center"
      />
      <el-table-column
        prop="wan_ip"
        label="外网IP"
        min-width="90"
        align="center"
      />
      <el-table-column
        prop="wan_debug_port"
        label="外网调试端口"
        align="center"
      />
      <el-table-column
        prop="peers"
        label="连接数量"
        align="center"
      />
      <el-table-column
        prop="g"
        label="未兑现支票"
        align="center"
      />
      <el-table-column
        prop="g"
        label="已兑支票"
        align="center"
      />
      <el-table-column
        prop="totalBalance"
        label="GBZZ余额"
        align="center"
      />
      <el-table-column
        prop="update_time"
        label="更新时间"
        align="center"
      />
      <el-table-column
        prop="cpu"
        label="CPU(%)"
        align="center"
      />
      <el-table-column
        prop="mem"
        label="内存"
        align="center"
      />
      <el-table-column
        prop="disk_usage"
        label="磁盘占用"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.disk_usage || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="net_sent"
        label="发送(kb/s)"
        align="center"
      />
      <el-table-column
        prop="net_recv"
        label="接收(kb/s)"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <node-detailed
      v-if="nodeDetailedVisible"
      ref="nodeDetailed"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/venode'
import Sticky from '@/components/Sticky'
import NodeDetailed from './components/NodeDetailed'

export default {
  name: 'Vnode',
  components: { Pagination, Sticky, NodeDetailed },
  data() {
    return {
      loading: false,
      addOrUpdateVisible: false,
      downloadLoading: false,
      nodeDetailedVisible: false,
      onlineOptions: [
        { label: '正常', value: 1 },
        { label: '离线', value: 0 },
      ],
      autoOps: {
        auto: true,
        time: 20,
        currentTime: 20,
        timeFormat: '00:00'
      },
      nodeOptions: [
        { label: '节点总数', value: '', type: 'primary', num: 222 },
        { label: '正常在线', value: 1, type: 'success', num: 223 },
        { label: '异常节点', value: 2, type: 'warning', num: 224 },
        { label: '离线节点', value: 3, type: 'danger', num: 225 },
        { label: '未兑支票', value: 4, type: 'info', num: 226 },
        { label: '已兑支票', value: 5, type: 'info', num: 227 },
        { label: 'GBZZ余额', value: 6, type: 'success', num: 228 },
      ],
      list: [
        { 
          chequebookAddress: "0x1f67Fac7EAA721b932759FB9AAC3eDc8484f04dd",
          cpu: "41.2",
          ethereum: "0xa6f38319932910a61642883ea8348a5c89755409",
          id: 6386,
          inet_debug_port: 1135,
          inet_ip: "161.117.177.58",
          is_oversea: 1,
          lastcheques: [],
          mem: "1193.4",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 0,
          offline_time: 0,
          online: 1,
          peers: 247,
          pssPublicKey: "025e3d95894903df017bf530618239dc69ba4737cd69ebd73d0197f6e1d7900000",
          publicKey: "02e5e25f40208928b9741c21c03c395a514a37c199b4e7836e71a91a6a6c1d4e2c",
          remark: null,
          svr_name: "新加坡-ecs-i2-bee102",
          totalBalance: 1.0000023000000000,
          update_time: 1624437170,
          user_id: 17,
          version: "0.6.2",
          wan_debug_port: 1135,
          wan_ip: "161.117.177.58"
        },
        {
          chequebookAddress: "0xde3296023aA0E6505A3EBb881e7546EE1a499929",
          cpu: "39.8",
          ethereum: "0x28e9387784dfffc01ecd5f8592de1116ecb0cc98",
          id: 7386,
          inet_debug_port: 1535,
          inet_ip: "161.117.177.58",
          is_oversea: 1,
          lastcheques: [],
          mem: "922.3",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 0,
          offline_time: 0,
          online: 1,
          peers: 227,
          pssPublicKey: "0302ad948e5549d5dd4b64fb50dda860c8f33d3604b51808929f0187ac5b1d3b19",
          publicKey: "022cdaefad410ceaac62e2cbc1e7a36ea91e9431e5b53aaea4e7621a8c22d88f23",
          remark: null,
          svr_name: "新加坡-ecs-i2-bee1102",
          totalBalance: 10000000000000000,
          update_time: 1624443278,
          user_id: 17,
          version: "0.6.2",
          wan_debug_port: 1535,
          wan_ip: "161.117.177.58"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6168,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6169,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6170,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6171,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6171,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6172,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6173,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6174,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6175,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6176,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6177,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6178,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        },
                {
          chequebookAddress: "",
          config: "\"{\\\"api-addr\\\": \\\":1633\\\", \\\"clef-signer-enable\\\": false, \\\"debug-api-addr\\\": \\\":1635\\\", \\\"debug-api-enable\\\": true, \\\"swap-enable\\\": true, \\\"swap-endpoint\\\": \\\"http://47.241.248.33:9000\\\", \\\"swap-initial-deposit\\\": 0, \\\"mainnet\\\": true, \\\"network-id\\\": 1, \\\"db-open-files-limit\\\": 20000, \\\"p2p-addr\\\": \\\":1634\\\", \\\"nat-addr\\\": \\\"161.117.183.52:1634\\\", \\\"full-node\\\": true, \\\"verbosity\\\": \\\"info\\\", \\\"welcome-message\\\": \\\"BZZ 小蜜蜂呀 飞呀飞呀\\\", \\\"cache-capacity\\\": 5000000}\"",
          cpu: "5.5",
          disk_usage: "18M",
          ethereum: "",
          id: 6179,
          inet_debug_port: 1635,
          inet_ip: "161.117.183.52",
          is_oversea: 1,
          lastcheques: [],
          mem: "302.5",
          net_recv: "0.0",
          net_sent: "0.0",
          offline_duration: 2972,
          offline_time: 1624435476,
          online: 0,
          peers: 0,
          pssPublicKey: "",
          publicKey: "",
          remark: null,
          svr_name: "新加坡-固定带宽",
          totalBalance: 0,
          update_time: 1624438448,
          user_id: 17,
          version: "0.0.0",
          wan_debug_port: 1635,
          wan_ip: "161.117.183.52"
        }
      ],
      search: {
        name: '',
        status: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      currentRow: {},
      timer: null
    }
  },
  watch: {
    'autoOps.auto'(val, oldVal){
      val ? this.timeFuc() : clearInterval(this.timer)
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() { 
    clearInterval(this.timer)
  },
  methods: {
    init() {
      this.getList()
      this.autoOps.auto ? this.timeFuc() : clearInterval(this.timer)
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
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then(response => {
          location.href = location.origin + '/' + response.data.filename
        })
        .catch(() => {
        })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    handleCurrentClick(val) {
      if (val.id === this.currentRow.id) {
        this.currentRow = {}
        this.$refs.singleTable.setCurrentRow()
      } else {
        this.currentRow = val
      }
    },
    onNode(data) {
      this.nodeDetailedVisible = true
      this.$nextTick(() => {
        this.$refs.nodeDetailed && this.$refs.nodeDetailed.init(data)
      })
    },
    countDown() {
      let d = parseInt(this.autoOps.currentTime / (24 * 60 * 60))
      d = d < 10 ? "0" + d : d
      let h = parseInt(this.autoOps.currentTime / (60 * 60) % 24);
      h = h < 10 ? "0" + h : h
      let m = parseInt(this.autoOps.currentTime / 60 % 60);
      m = m < 10 ? "0" + m : m
      let s = parseInt(this.autoOps.currentTime % 60);
      s = s < 10 ? "0" + s : s
      // this.autoOps.timeFormat = d + '天' + h + '时' + m + '分' + s + '秒'
      this.autoOps.timeFormat = m + ':' + s
    },
    timeFuc() {
      this.timer = setInterval(() => {
          this.countDown()
          this.autoOps.currentTime -= 1
          if (this.autoOps.currentTime === 0) {
            this.autoOps.currentTime = this.autoOps.time
            this.getList()
          }
      }, 1000)
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding-top: 0;
}
.filter-container {
  padding-top: 20px;
  background-color: #fff;
}
::v-deep .el-table th > .cell {
  padding: 0 2px;
}
::v-deep .el-table .cell {
  padding: 0 2px;
}
</style>
