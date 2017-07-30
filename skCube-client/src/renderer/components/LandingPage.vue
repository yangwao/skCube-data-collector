<template>
<div id="wrapper">
  <img id="logo" src="~@/assets/sk-cube-rr.png" alt="skcube">
  <main>
    <div class="left-side">
      <div class="doc">
        <div class="title">Getting Started</div>
        <p>
              Select your folder where GSR files are created and we will do the rest
        </p>
        <button v-on:click="openDialogFile">Choose folder</button>
        <br>
        <br>
        <p>
          Selected path:
        </p>
        <p>
          {{ path }}
        </p>
        <p>
          Destination Callsign: <input v-model="packetInfo.destinationCallsign" placeholder="destination callsign">
        </p>
        <p>
          Source Callsign: <input v-model="packetInfo.sourceCallsign" placeholder="source callsign">
        </p>
        <p>
          Meta: <input v-model="packetInfo.meta" placeholder="fill your meta">
        </p>
        <p>This data will be joined to request</p>
        <p>
          {{ packetInfo.meta }}
        </p>
        <p>
          {{ packetInfo.destinationCallsign }}
        </p>
        <p>
          {{ packetInfo.sourceCallsign }}
        </p>
        <br>
      </div>
        <div class="doc">
          <button class="alt" v-on:click="sendRaw">Start sending GSR packets</button>
          <button class="alt">Stop sending GSR packets</button>
        </div>
      </div>

  </main>
</div>
</template>

<script>
export default {
  data() {
    return {
      targetServer: 'http://localhost:9001/v1/raw',
      path: '',
      packetInfo: {
        meta: 'default meta',
        sourceCallsign: 'jkl',
        destinationCallsign: 'iop'
      },
      counter: 0,
      gsrPacket: ''
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
      const path = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openFile']
      })

      this.path = path[0]

      fs.readFile(path[0], 'utf-8', (err, data) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('gsr packet content', data);
        this.gsrPacket = data
      })
    },
    openDialogDir: function () {
      const { dialog } = require('electron').remote
      const path = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openDirectory']
      })
      console.log(path)
      this.path = path[0]
    },
    sendRaw: function() {
      console.log('using this path', this.path);
      var request = require('request')
      var fs = require('fs')
      var FormData = require('form-data')

      var formData = {
        sourceCallsign: this.packetInfo.sourceCallsign,
        destinationCallsign: this.packetInfo.destinationCallsign,
        meta: this.packetInfo.meta,
        gsr: fs.createReadStream(this.path)
      }

      request.post({url:this.targetServer, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
        console.log('Server response:', body);
      });
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
    width: 100vw;
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
