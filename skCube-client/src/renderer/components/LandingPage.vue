<template>
<div id="wrapper">
      <img id="logo" src="~@/assets/sk-cube-rr.png" alt="skcube">
      <main>
            <div class="left-side">
                  <span class="title">
                        skCube client GSR collect0r
                  </span>
                  <system-information></system-information>
            </div>

            <div class="right-side">
                  <div class="doc">
                        <div class="title">Getting Started</div>
                        <p>
                              Select your folder where GSR files are created and we will do the rest
                        </p>
                        <button v-on:click="openDialog">Choose folder</button>
                        <br>
                        <br>
                        <p>
                          Selected path: {{ path }}
                        </p>
                          Meta: <input v-model="meta" placeholder="fill your meta">
                          <p>This text will be joined as meta tag</p>
                          <p>
                            {{ meta }}
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
import axios from 'axios'
import SystemInformation from './LandingPage/SystemInformation'

export default {
  data() {
    return {
      path: '',
      meta: '',
      counter: 0,
    }
  },
  name: 'landing-page',
  components: {
    SystemInformation
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    openDialog: function () {
      const {
        dialog
      } = require('electron').remote
      const path = dialog.showOpenDialog({
        filters: [{
          name: 'Packets',
          extensions: ['gsr']
        }],
        properties: ['openDirectory']
      })
      console.log(path)
      this.path = path[0]
      this.counter += 1
      console.log(this.counter);
    },
    sendRaw: function() {
      axios({
        method: 'post',
        baseURL: 'http://localhost:9001',
        url: '/v1/raw',
        data: {
           timestamp: '0',
           sourceCallsign: 'skCUBE',
           desinationCallsign: 'OM3KAA',
           meta: 'znacka'
         }
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
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
