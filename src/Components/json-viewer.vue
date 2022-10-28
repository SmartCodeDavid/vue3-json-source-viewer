<template>
  <div :class="jvClass">
    <div class="header-action">
      <div v-if="copyable" :class="`jv-tooltip ${copyText.align || 'right'}`">
        <span ref="clip" class="jv-button" :class="{ copied }">
          <slot name="copy" :copied="copied">
            {{ copied ? copyText.copiedText : copyText.copyText }}
          </slot>
        </span>
      </div>
      <div class="jv-button collapses" @click="more">{{ isShowMore ? 'collapses' : 'expands' }}</div>
    </div>
    <div class="jv-code" :class="{ open: expandCode, boxed }">
      <json-box
        :key="localKey"
        ref="jsonBox"
        :value="value"
        :sort="sort"
        :preview-mode="previewMode"
        :allow-image-show="allowImageShow"
      />
    </div>
    <!-- <div
      v-if="expandableCode && boxed"
      class="jv-more"
      @click="toggleExpandCode"
    >
      <span class="jv-toggle" :class="{ open: !!expandCode }" />
    </div> -->
    <div class="jv-image-popup" v-if="showPopup">
      <div class="show-area">
        <img class="jv-image" :src="imgeSrc" alt="" />
        <div class="close-btn" @click.stop="closePopup">+</div>
      </div>
    </div>
  </div>
</template>

<script>
import JsonBox from "./json-box.vue";
import Clipboard from "clipboard";
import { debounce, base64toBlob, checkIslegalURL } from "../utils";

export default {
  name: "JsonViewer",
  components: {
    JsonBox,
  },
  props: {
    value: {
      type: [Object, Array, String, Number, Boolean, Function],
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    expandDepth: {
      type: Number,
      default: 1,
    },
    copyable: {
      type: [Boolean, Object],
      default: false,
    },
    sort: {
      type: Boolean,
      default: false,
    },
    boxed: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
    },
    timeformat: {
      type: Function,
      default: (value) => value.toLocaleString(),
    },
    allowImageShow: {
      type: Boolean,
      default: false,
    }
  },
  provide() {
    return {
      expandDepth: this.expandDepth,
      timeformat: this.timeformat,
      keyClick: this.keyClick,
    };
  },
  data() {
    return {
      copied: false,
      previewMode: false,
      expandableCode: false,
      expandCode: this.expanded,
      showPopup: false,
      localKey: 0,
      imgeSrc: "",
      isShowMore: false,
    };
  },
  emits: ["onKeyClick"],
  computed: {
    jvClass() {
      return (
        "jv-container " + "jv-" + this.theme + (this.boxed ? " boxed" : "")
      );
    },
    copyText() {
      const { copyText, copiedText, timeout, align } = this.copyable;

      return {
        copyText: copyText || "copy",
        copiedText: copiedText || "copied!",
        timeout: timeout || 2000,
        align,
      };
    },
  },
  watch: {
    value() {
      this.onResized();
    },
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    reset() {
      this.debounceResized = debounce(this.debResized.bind(this), 200);
      if (this.boxed && this.$refs.jsonBox) {
        this.onResized();
        this.$refs.jsonBox.$el.addEventListener("resized", this.onResized, true);
        this.$refs.jsonBox.$el.addEventListener("jvImgPopup", this.onPopup, true);
      }
      if (this.copyable) {
        const clipBoard = new Clipboard(this.$refs.clip, {
          text: () => {
            return JSON.stringify(this.value, null, 2);
          },
        });
        clipBoard.on("success", (e) => {
          this.onCopied(e);
        });
      } 
    },
    more () {
      this.localKey += 1;
      this.previewMode = !this.previewMode;
      this.isShowMore = !this.isShowMore;
      this.$nextTick(() => {
        this.reset();
      })
    },
    closePopup() {
      this.showPopup = !this.showPopup;
      this.imgeSrc = "";
    },
    onPopup(e) {
      // mime_type needed to identify a blob or img url
      const obj = e.detail;
      const source = checkIslegalURL(obj.uri)
        ? obj.uri
        : base64toBlob(obj.blob);
      this.imgeSrc = source;
      this.showPopup = !this.showPopup;
    },
    onResized() {
      this.debounceResized();
    },
    debResized() {
      this.$nextTick(() => {
        if (!this.$refs.jsonBox) return;
        if (this.$refs.jsonBox.$el.clientHeight >= 250) {
          this.expandableCode = true;
        } else {
          this.expandableCode = false;
        }
      });
    },
    keyClick(keyName) {
      this.$emit("onKeyClick", keyName);
    },
    onCopied(copyEvent) {
      if (this.copied) {
        return;
      }
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, this.copyText.timeout);
      this.$emit("copied", copyEvent);
    },
    toggleExpandCode() {
      this.expandCode = !this.expandCode;
    },
  },
};
</script>

<style>
.jv-container {
  box-sizing: border-box;
  position: relative;
  height: 100%;
}
.jv-container.boxed {
  /* border: 1px solid #eee; */
  border-radius: 6px;
}
.jv-container.boxed:hover {
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
  border-color: transparent;
  position: relative;
}
.jv-container.jv-light {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
}
.jv-container.jv-dark {
  background: #282c34;
  white-space: nowrap;
  color: #fff;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
}
.jv-container.jv-light .jv-ellipsis {
  color: #999;
  background-color: #eee;
  display: inline-block;
  line-height: 0.9;
  font-size: 0.9em;
  padding: 0px 4px 2px 4px;
  margin: 0 4px;
  border-radius: 3px;
  vertical-align: 2px;
  cursor: pointer;
  user-select: none;
}
.jv-container.jv-dark .jv-ellipsis {
  color: #f8f8f8;
  background-color: #2c3e50;
  display: inline-block;
  line-height: 0.9;
  font-size: 0.9em;
  padding: 0px 4px 2px 4px;
  margin: 0 4px;
  border-radius: 3px;
  vertical-align: 2px;
  cursor: pointer;
  user-select: none;
}
.jv-container.jv-light .jv-button {
  color: #32c8cd;
}
.jv-container.jv-dark .jv-button {
  color: #32c8cd;
}
.jv-container.jv-light .jv-key {
  color: #111111;
  margin-right: 4px;
}
.jv-container.jv-dark .jv-key {
  color: #fff;
  margin-right: 4px;
}

/**dark */
.jv-container.jv-dark .jv-item.jv-array {
  color: #111111;
}
.jv-container.jv-dark .jv-item.jv-array {
  color: #fff;
}
.jv-container.jv-dark .jv-item.jv-boolean {
  color: #fc1e70;
}
.jv-container.jv-dark .jv-item.jv-function {
  color: #067bca;
}
.jv-container.jv-dark .jv-item.jv-number {
  color: #fc1e70;
}
.jv-container.jv-dark .jv-item.jv-object {
  color: #fff;
}
.jv-container.jv-dark .jv-item.jv-undefined {
  color: #e08331;
}
.jv-container.jv-dark .jv-item.jv-string {
  color: #42b983;
  word-break: break-word;
  white-space: normal;
}
.jv-container.jv-dark .jv-item.jv-string .jv-link {
  color: #0366d6;
}
.jv-container.jv-dark .jv-code .jv-toggle:before {
  padding: 0px 2px;
  border-radius: 2px;
}
.jv-container.jv-dark .jv-code .jv-toggle:hover:before {
  background: #eee;
}
.jv-container.jv-dark .jv-item.jv-image {
  width: 100px;
  height: 30px;
  background-color: #42b983;
  border-radius: 5px;
  color: white;
  padding: 4px;
}
.jv-container.jv-dark .jv-item.jv-image:hover {
  cursor: pointer;
}
/**light */
.jv-container.jv-light .jv-item.jv-array {
  color: #111111;
}
.jv-container.jv-light .jv-item.jv-boolean {
  color: #fc1e70;
}
.jv-container.jv-light .jv-item.jv-function {
  color: #067bca;
}
.jv-container.jv-light .jv-item.jv-number {
  color: #fc1e70;
}
.jv-container.jv-light .jv-item.jv-object {
  color: #111111;
}
.jv-container.jv-light .jv-item.jv-undefined {
  color: #e08331;
}
.jv-container.jv-light .jv-item.jv-string {
  color: #42b983;
  word-break: break-word;
  white-space: normal;
}
.jv-container.jv-light .jv-item.jv-string .jv-link {
  color: #0366d6;
}
.jv-container.jv-light .jv-item.jv-image {
  width: 100px;
  height: 30px;
  background-color: #42b983;
  border-radius: 5px;
  color: white;
  padding: 4px;
}
.jv-container.jv-light .jv-item.jv-image:hover {
  cursor: pointer;
}

.jv-container.jv-light .jv-code .jv-toggle:before {
  padding: 0px 2px;
  border-radius: 2px;
}
.jv-container.jv-light .jv-code .jv-toggle:hover:before {
  background: #eee;
}
.jv-container .jv-code {
  /* overflow: hidden; */
  padding: 30px 20px;
}
.jv-container .jv-code.boxed {
  height: 100%;
  overflow: scroll;
}

.jv-container .jv-toggle {
  background-image: url(./icon.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  cursor: pointer;
  width: 10px;
  height: 10px;
  margin-right: 2px;
  display: inline-block;
  transition: transform 0.1s;
}
.jv-container .jv-toggle.open {
  transform: rotate(90deg);
}
.jv-container .jv-more {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.jv-container .jv-more .jv-toggle {
  position: relative;
  top: 40%;
  z-index: 2;
  color: #888;
  transition: all 0.1s;
  transform: rotate(90deg);
}
.jv-container .jv-more .jv-toggle.open {
  transform: rotate(-90deg);
}
.jv-container .jv-more:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 20%,
    rgba(230, 230, 230, 0.3) 100%
  );
  transition: all 0.1s;
}
.jv-container .jv-more:hover .jv-toggle {
  top: 50%;
  color: #111;
}
.jv-container .jv-more:hover:after {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 20%,
    rgba(230, 230, 230, 0.3) 100%
  );
}
.jv-container .jv-button {
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
  z-index: 5;
}
.jv-container .jv-button.copied {
  opacity: 0.4;
  cursor: default;
}
.jv-container .jv-button.collapses {
  margin-left: 4px;
}
.jv-container .j-icon {
  font-size: 12px;
}

.header-action {
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 5px;
}

.jv-image-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 999;
}

.jv-image-popup .show-area {
  position: relative;
  /* width: 40vw;
  height: 40vw; */
  width: 50%;
  height: 50%;
  max-width: 650px;
  max-height: 650px;
  background: white;
}

.jv-image-popup .show-area .jv-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jv-image-popup .show-area .close-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(230, 230, 230, 0.9);
  color: black;
  font-weight: 500;
  position: absolute;
  top: -15px;
  right: -15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
  font-size: 25px;
}
.jv-image-popup .show-area .close-btn:hover {
  cursor: pointer;
}
</style>


