<template>
<div>
  <section class="section main">
    <section class="section">
      <img id="logo" src="~@/assets/sk-cube-rr.png" alt="skcube">
    </section>
    <section class="section">
      <div class="left-side">
        <div class="doc">
          <div class="title">How to send your packets:</div>
          <p>
            Select folder where you store your GSR files and we will do the rest. </br>We will also watch for new GSR packets in that directory.
          </p>
          <div>
            <button @click="openDialogDir">
              <i class="fa fa-folder"></i>
              Choose folder
            </button>
          </div>
          <div>
            <button class="alt" @click="patrolForGsr" v-if="!!this.gsrPath.dir">Start watching for GSR packets</button>
            <div v-if="!!this.isWatching">
            <p>
              Watching <br>
              <!--LOADING ANIMATION-->
              <span class="load-3">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </span>
            <!--END OF LOADING ANIMATION-->
            </p>

            </div>
            <p v-if="!!this.gsrPath.dir">
              Selected gsrDirPath: {{ gsrPath.dir }}
            </p>
          </div>
          <div class="separator"></div>
          <div>
            <button @click="openDialogFile">
              <i class="fa fa-file"></i>
              Choose file
            </button>
          </div>
          <div>
            <button class="alt" @click="sendRaw" v-if="!!this.gsrPath.file">Send single GSR packet</button>
            <div v-if="!!this.isSuccess && !this.isWatching">
              <p>
                Successfully sent!
              </p>
            </div>
            <p v-if="!!this.gsrPath.file && !this.isWatching">
              Selected gsrFilePath: {{ gsrPath.file }}
            </p>
          </div>
          <div class="separator"></div>
          <div>
            <p>
              <button class="alt" @click="loadSettings" v-if="isSettingsStore()">Load last settings</button>
              <button class="alt" @click="saveSettings">Save settings</button>
            </p>
          </div>
          <div class="separator"></div>
          <p>
            <a @click="toggleAdvancedUser">Advanced users<span class="icon"><i class="fa fa-hand-pointer-o"></i></span></a>
          </p>
          <div class="advanced-settings" v-if="this.isAdvancedUser">
            <p>
              Source Callsign: <input v-model="packetInfo.sourceCallsign" placeholder="source callsign">
            </p>
            <p>
              Destination Callsign: <input v-model="packetInfo.destinationCallsign" placeholder="destination callsign">
            </p>
            <p>
              Meta: <input v-model="packetInfo.meta" placeholder="fill your meta">
            </p>
          </div>
        </div>
      </div>
    </section>
  </section>
  <!--ABSOLUTE POSITION-->
  <div class="server-info">
    <div class="separator"></div>
    <p>
      <a class="alt" @click="open(targetViewer + (today - last30days))">
        Show received packets for last 30 days<span class="icon"><i class="fa fa-external-link"></i></span>
      </a>
    </p>
    <p>
      last server packet status: {{ serverReply.status }} @ {{ serverReply.timestamp }} seen: {{ serverReply.seen }} packetId: {{ serverReply._id }}
    </p>
    <p>
      targetServer {{ targetServer }} version {{ this.appVersion }}
    </p>
  </div>
  <!--END OF ABSOLUTE POSITION-->
</div>
</template>

<script>
export default {
  data() {
    const defaultPacketInfo = {
      meta: 'null',
      sourceCallsign: 'OM9SAT',
      destinationCallsign: '00000'
    }
    return {
      today: Date.now(),
      last30days: 1000*60*60*24*30,
      // targetViewer: 'http://localhost:9001/v1/createdAt/',
      // targetServer: 'http://localhost:9001/v1/raw',
      targetViewer: 'http://collector.hypersignal.xyz:9001/v1/createdAt/',
      targetServer: 'http://collector.hypersignal.xyz:9001/v1/raw',
      gsrPath: {
        sentDir: 'sent/',
        dir: '',
        file: '',
        toBeSentFiles: []
      },
      gsrFilename: '',
      defaultPacketInfo,
      packetInfo: defaultPacketInfo,
      counter: 0,
      gsrPacket: '',
      serverReply: {
        status: '-',
        seen: '-',
        timestamp: '-'
      },
      isAdvancedUser: false,
      isWatching: false,
      isSuccess: false,
      appVersion: require('electron').remote.app.getVersion()
    }
  },
  name: 'landing-page',
  components: {},
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    openDialogFile: function () {
      const { dialog } = require('electron').remote
      const gsrPath = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openFile']
      })

      console.log(gsrPath[0])
      this.gsrPath.file = gsrPath[0]
      // var fs = require('fs')
      // fs.readFile(gsrPath[0], 'utf-8', (err, data) => {
      //   if (err) {
      //     console.log(err)
      //     return
      //   }
      //   // console.log('gsr packet content', data);
      //   this.gsrPacket = data
      // })
    },
    openDialogDir: function () {
      const { dialog } = require('electron').remote
      const gsrPath = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openDirectory']
      })
      console.log(gsrPath[0])
      this.gsrPath.dir = gsrPath[0]
    },
    sendRaw: function() {
      console.log('using this.gsrPath.file', this.gsrPath.file);
      var request = require('request')
      var fs = require('fs')
      var formData = {
        sourceCallsign: this.packetInfo.sourceCallsign,
        destinationCallsign: this.packetInfo.destinationCallsign,
        meta: this.packetInfo.meta,
        gsr: {
          value: fs.createReadStream(this.gsrPath.file),
          options: {
            contentType: 'text/plain'
          }
        }
      }

      request.post({url:this.targetServer, formData: formData},
        (err, httpResponse, body) => {
          if (err) {
            return console.error('upload failed:', err);
          }

          console.log('Server response:', body);
          this.serverReply = JSON.parse(body)
          this.serverReply.timestamp = new Date()

          if (this.serverReply.status === 'ok' && !this.serverReply.seen) {
            this.serverReply.seen = 'unique!'
          }

          this.isSuccess = true
          setTimeout(() => {this.isSuccess = false}, 3000)

          if (this.serverReply.status === 'ok') {
            let gsrFilename = this.gsrPath.file.split('/')[this.gsrPath.file.split('/').length-1]
            console.log(`moving ${gsrFilename} to sendDir`);
            fs.renameSync(this.gsrPath.file, this.gsrPath.dir + '/' + this.gsrPath.sentDir + gsrFilename)
          }
        });
    },
    saveSettings: function() {
      const Store = require('electron-store')
      const store = new Store()
      store.set('user.packetInfo', this.packetInfo)
      store.set('user.gsrPath', this.gsrPath)
    },
    loadSettings: function() {
      const Store = require('electron-store')
      const store = new Store()
      this.gsrPath = store.get('user.gsrPath')
      this.packetInfo = store.get('user.packetInfo')
      if (
        this.packetInfo.meta !== this.defaultPacketInfo.meta ||
        this.packetInfo.destinationCallsign !== this.defaultPacketInfo.destinationCallsign ||
        this.packetInfo.sourceCallsign !== this.defaultPacketInfo.sourceCallsign
      ) {
        this.isAdvancedUser = true
      }
    },
    isSettingsStore: function() {
      const Store = require('electron-store')
      const store = new Store()
      if (store.get('user.gsrPath') || store.get('user.packetInfo')) {
        return true
      }
      return false
    },
    patrolForGsr: function() {
      var fs = require('fs')
      if (!fs.existsSync(this.gsrPath.dir + '/' + this.gsrPath.sentDir)) {
        console.log('will create sentDir')
        fs.mkdirSync(this.gsrPath.dir + '/' + this.gsrPath.sentDir)
      }

      this.listFilesFromDir()
      if(this.gsrPath.toBeSentFiles[0]) {
        this.gsrPath.file = this.gsrPath.dir + '/' + this.gsrPath.toBeSentFiles[0]
        this.sendRaw()
      }

      this.isWatching = true;

      fs.watch(this.gsrPath.dir, (eventType, filename) => {
        console.log(`event type is: ${eventType}`);
        if (filename) {
          console.log(`filename provided: ${filename}`);
          this.listFilesFromDir()
          console.log(this.gsrPath.toBeSentFiles[0]);
          if (this.gsrPath.toBeSentFiles[0]) {
            this.gsrPath.file = this.gsrPath.dir + '/' + this.gsrPath.toBeSentFiles[0]
            this.sendRaw()
          }
        } else {
          console.log('filename not provided');
        }
      })
    },
    listFilesFromDir: function() {
      var fs = require('fs')
      this.gsrPath.toBeSentFiles = fs.readdirSync(this.gsrPath.dir).filter(gsr => gsr.split('.')[1] === 'gsr')
      console.log(this.gsrPath.toBeSentFiles)
    },
    toggleAdvancedUser: function() {
      this.isAdvancedUser = !this.isAdvancedUser
    }
  }
}
</script>

<style lang="sass">
@import "~bulma/css/bulma.css";
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

*
  // box-sizing: border-box;
  margin: 0;
  padding: 0;

body
  font-family: 'Source Sans Pro', sans-serif;

div
  padding: 5px 0 5px 0

#logo
  height: auto;
  margin-bottom: -40px;
  margin-top: -20px;
  width: 200px;

a
  color: #1e5ba8

hr
  margin: 0px;
  margin-bottom: 10px

.main
  text-align: center;

.separator
  height: 1px;
  background: linear-gradient(to right, white, #51af72, #ababab, #51af72, #fdfdfd);
  padding: 0px !important;
  margin: auto;
  margin-bottom: 10px;
  max-width: 1000px;

.left-side
  display: flex;
  flex-direction: column;

.welcome
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;

.title
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px !important;

.title.alt
  font-size: 18px;
  margin-bottom: 10px;

.doc p
  color: black;
  margin-bottom: 10px;


.doc button
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  &:hover
    background-color: #3d946d;
    border: 1px solid #3d946d;
  &:active
    background-color: #33805c;
    border: 1px solid #33805c;

.doc button.alt
  color: #4fc08d;
  background-color: transparent;
  &:hover
    background-color: #3d946d;
    border: 1px solid #3d946d;
    color: white;
  &:active
    background-color: #33805c;
    border: 1px solid #33805c;

.fa
  font-size: 13px !important;

.icon
  margin: auto;

.advanced-settings
  text-align: left;
  display: table;
  margin: auto;

.server-info
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: linear-gradient(to top right, #ffffff, #fbfbfb, #eaeaea);
  padding-left: 20px;
  padding-bottom: 15px;
  padding-top: 0;

  //ANIMATIONS
.line
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 15px;
  background-color: #1e5ba8;
  padding: 0;

.load-3 .line:nth-last-child(1)
  animation: loadingC .9s .10s linear infinite;
.load-3 .line:nth-last-child(2)
  animation: loadingC .9s .30s linear infinite;
.load-3 .line:nth-last-child(3)
  animation: loadingC .9s .50s linear infinite;

.load-3
  display: inline-block;

@keyframes loadingC
  0 {transform: translate(0,0);}
  50% {transform: translate(0,13px);}
  100% {transform: translate(0,0);}

</style>
