<script>
import { h } from "vue";
export default {
  name: "JsonImage",
  functional: true,
  props: {
    jsonValue: {
      type: [String, Blob],
      required: true,
    },
    originalValue: {
      type: [Object, Array, String, Number, Boolean, Function, Date],
      default: null,
    },
    popup: Boolean,
  },
  methods: {
    toggle() {
      // emit popup event to show image
      this.$emit("update:popup", true);
      this.dispatchEvent();
    },
    dispatchEvent() {
      try {
        this.$el.dispatchEvent(
          new CustomEvent("jvImgPopup", {
            detail: this.originalValue,
          })
        );
      } catch (e) {
        // handle IE not supporting Event constructor
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("jvImgPopup", true, false, this.originalValue);
        this.$el.dispatchEvent(evt);
      }
    },
  },
  render() {
    return h("span", {
      class: {
        "jv-item": true,
        "jv-image": true,
      },
      onClick: this.toggle,
      innerText: `click to show the image`,
    });
  },
};
</script>
