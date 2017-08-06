<template>
<div id="wrapper">
  <img id="logo" src="~@/assets/sk-cube-rr.png" alt="skcube">
  <main>
    <div class="left-side">
      <div class="doc">
        <div class="title">Getting Started</div>
        <p>
              Select your folder where GSR files are created and we will do the rest (patrol every 60 seconds for new GSR packets in directory and send it to collector server)
        </p>
        <button v-on:click="openDialogFile">Choose folder</button>
        <br>
        <br>
        <p>
          <button class="alt" @click="saveSettings">Save settings</button>
        </p>
        <p>
          <button class="alt" @click="loadSettings">Load last setting</button>
        </p>
        <p>
          Selected gsrPath:
        </p>
        <p>
          {{ gsrPath }}
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
          <button class="alt" v-on:click="sendRaw">Start sending GSR packets</button>
          <p>
            server status: {{ serverReply.status }} @ {{ serverReply.timestamp }} seen: {{ serverReply.seen }}
          </p>
          <button class="alt">Stop sending GSR packets</button>
          <button class="alt" @click="open(targetViewer + (today - last30days))">Show received packets for last 30 days</button>
        </div>
      </div>

  </main>
</div>
</template>

<script>
export default {
  data() {
    return {
      today: Date.now(),
      last30days: 1000*60*60*24*30,
      targetViewer: 'http://localhost:9001/v1/createdAt/',
      targetServer: 'http://localhost:9001/v1/raw',
      gsrPath: '',
      packetInfo: {
        meta: '',
        sourceCallsign: '',
        destinationCallsign: ''
      },
      counter: 0,
      gsrPacket: '',
      serverReply: {
        status: '-',
        seen: '-',
        timestamp: '-'
      }
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
      var fs = require('fs')
      const gsrPath = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openFile']
      })

      this.gsrPath = gsrPath[0]

      fs.readFile(gsrPath[0], 'utf-8', (err, data) => {
        if (err) {
          console.log(err)
          return
        }
        // console.log('gsr packet content', data);
        this.gsrPacket = data
      })
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
      console.log(gsrPath)
      this.gsrPath = gsrPath[0]
    },
    sendRaw: function() {
      console.log('using this gsrPath', this.gsrPath);
      var request = require('request')
      var fs = require('fs')
      var formData = {
        sourceCallsign: this.packetInfo.sourceCallsign,
        destinationCallsign: this.packetInfo.destinationCallsign,
        meta: this.packetInfo.meta,
        gsr: {
          value: fs.createReadStream(this.gsrPath),
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

          if (!this.serverReply.seen) {
            this.serverReply.seen = 'unique!'
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
