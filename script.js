
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';
import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element@0.6.2/lit-element.js?module';

class ScreenSharing extends LitElement {
  constructor() {
    super();
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = false;
    this.stream = null;
    this.chunks = [];
    this.mediaRecorder = null;
    this.status = 'Inactive';
    this.recording = null;
  }

  static get properties() {
    return {
      status: String,
      enableStartCapture: Boolean,
      enableStopCapture: Boolean,
      enableDownloadRecording: Boolean,
      recording: {
        type: {
          fromAttribute: input => input
        }
      }
    };
  }

  render() {
    return html`<style>
@import "../../../css/main.css";
:host {
  display: block;
  padding: 10px;
  width: 100%;
  height: 100%;
}
video {
    --video-width: 100%;
    width: var(--video-width);
    height: calc(var(--video-width) * (16 / 9));
}
</style>
<video ?controls="${this.recording !== null}" playsinline autoplay loop muted .src="${this.recording}"></video>
<div>
<p>Status: ${this.status}</p>
<button ?disabled="${!this.enableStartCapture}" @click="${e => this._startCapturing(e)}">Start screen capture</button>
<button ?disabled="${!this.enableStopCapture}" @click="${e => this._stopCapturing(e)}">Stop screen capture</button>
<button ?disabled="${!this.enableDownloadRecording}" @click="${e => this._downloadRecording(e)}">Download recording</button>
<a id="downloadLink" type="video/webm" style="display: none"></a>
</div>`;
  }

  static _startScreenCapture() {
    if (navigator.getDisplayMedia) {
      return navigator.getDisplayMedia({video: true});
    } else if (navigator.mediaDevices.getDisplayMedia) {
      return navigator.mediaDevices.getDisplayMedia({video: true});
    } else {
      return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
    }
  }

  async _startCapturing(e) {
    console.log('Start capturing.');
    this.status = 'Screen recording started.';
    this.enableStartCapture = false;
    this.enableStopCapture = true;
    this.enableDownloadRecording = false;
    this.requestUpdate('buttons');

    if (this.recording) {
      window.URL.revokeObjectURL(this.recording);
    }

    this.chunks = [];
    this.recording = null;
    this.stream = await ScreenSharing._startScreenCapture();
    this.stream.addEventListener('inactive', e => {
      console.log('Capture stream inactive - stop recording!');
      this._stopCapturing(e);
    });
    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
    this.mediaRecorder.addEventListener('dataavailable', event => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });
    this.mediaRecorder.start(10);
  }

  _stopCapturing(e) {
    console.log('Stop capturing.');
    this.status = 'Screen recorded completed.';
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = true;

    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;

    this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
  }

  _downloadRecording(e) {
    console.log('Download recording.');
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = false;

    const downloadLink = this.shadowRoot.querySelector('a#downloadLink');
    downloadLink.addEventListener('progress', e => console.log(e));
    downloadLink.href = this.recording;
    downloadLink.download = 'screen-recording.webm';
    downloadLink.click();
  }
}

customElements.define('screen-sharing', ScreenSharing);

var map, tb;

      require([
        "esri/map", 
        
        "esri/toolbars/draw",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol", 
        "esri/graphic", 
        "dojo/_base/Color", 
        "dojo/dom", "dojo/on", 
        "dojo/domReady!"
      ], function(
        Map, 
         Draw,
        SimpleMarkerSymbol, SimpleLineSymbol,
        PictureFillSymbol, CartographicLineSymbol, 
        Graphic, 
        Color, dom, on
      ) {
        map = new Map("viewDiv", {
          basemap: "streets",
          center: [-25.312, 34.307],
          zoom: 3
        });
        map.on("load", initToolbar);

        
        
        
        
        
        
        
        
        
        
   
        var markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
        markerSymbol.setColor(new Color("#00FFFF"));
        
        
        
        
        
        
        
        
        
        
        
        
        


        var lineSymbol = new CartographicLineSymbol(
 CartographicLineSymbol.STYLE_SOLID,
          new Color([255,0,0]), 10, 
 CartographicLineSymbol.CAP_ROUND,
 CartographicLineSymbol.JOIN_MITER, 5
        );

        
        
        
        
        
        
        var fillSymbol = new PictureFillSymbol(
          "images/mangrove.png",
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'), 
            1
          ), 
          42, 
          42
        );
        function initToolbar() {
          tb = new Draw(map);
          tb.on("draw-end", addGraphic);

          on(dom.byId("info"), "click", function(evt) {
            if ( evt.target.id === "info" ) {
              return;
            }
            
            
            
            
            
            
            var tool = evt.target.id.toLowerCase();
            map.disableMapNavigation();
            tb.activate(tool);
          });
        }
        function addGraphic(evt) {
          tb.deactivate(); 
          map.enableMapNavigation();
          
          
          
          
          
          var symbol;
          if ( evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
            symbol = markerSymbol;
          } else if ( evt.geometry.type === "line" || evt.geometry.type === "polyline") {
            symbol = lineSymbol;
          }
          else {
            symbol = fillSymbol;
          }
          map.graphics.add(new Graphic(evt.geometry, symbol));
        }
      });
