<template>
<div id="wrapper">
  <img id="logo" src="~@/assets/sk-cube-rr.png" alt="skcube">
  <main>
    <div class="left-side">
      <div class="doc">
        <div class="title">Getting Started</div>
        <p>
          Select your folder where GSR files are created and we will do the rest. We will watch for new GSR packets in directory and send it to collector server)
        </p>
        <p>
          <button @click="openDialogDir">Choose folder</button>
          <button class="alt" @click="patrolForGsr">Start watching for GSR packets</button>
        </p>
        <p>
          <button class="alt" @click="loadSettings">Load last setting</button>
          <button class="alt" @click="saveSettings">Save settings</button>
        </p>
        <p>
        <p>
          <button class="alt" @click="open(targetViewer + (today - last30days))">Show received packets for last 30 days</button>
        </p>
          === Advanced users ===
        </p>
        <p>
          Selected gsrDirPath: {{ gsrPath.dir }}
        </p>
        <p>
          Source Callsign: <input v-model="packetInfo.sourceCallsign" placeholder="source callsign">
        </p>
        <p>
          Destination Callsign: <input v-model="packetInfo.destinationCallsign" placeholder="destination callsign">
        </p>
        <p>
          Meta: <input v-model="packetInfo.meta" placeholder="fill your meta">
        </p>
        <br>
      </div>
        <div class="doc">
          <button @click="openDialogFile">Choose file</button>
          <button class="alt" @click="sendRaw">Send single GSR packet</button>
          <p>
            Selected gsrFilePath: {{ gsrPath.file }}
          </p>
          <p>
            last server packet status: {{ serverReply.status }} @ {{ serverReply.timestamp }} seen: {{ serverReply.seen }} packetId: {{ serverReply._id }}
          </p>
          <p>
            targetServer {{ targetServer }} version {{ this.appVersion }}
          </p>
        </div>
      </div>

  </main>
</div>
</template>

<script>
import {version} from '../../../package.json'
export default {
  data() {
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
      packetInfo: {
        meta: 'null',
        sourceCallsign: 'OM9SAT',
        destinationCallsign: '00000'
      },
      counter: 0,
      gsrPacket: '',
      serverReply: {
        status: '-',
        seen: '-',
        timestamp: '-'
      },
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
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
    background: radial-gradient( ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, .9) 100%);
    height: 100vh;
    padding: 60px 80px;
    width: 150vw;
}

#logo {
    height: auto;
    margin-bottom: 20px;
    width: 200px;
}

main {
    display: flex;
    justify-content: space-between;
}

main>div {
    flex-basis: 50%;
}

.left-side {
    display: flex;
    flex-direction: column;
}

.welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
}

.title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
}

.title.alt {
    font-size: 18px;
    margin-bottom: 10px;
}

.doc p {
    color: black;
    margin-bottom: 10px;
}

.doc button {
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
}

.doc button.alt {
    color: #42b983;
    background-color: transparent;
}
</style>
