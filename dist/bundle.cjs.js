'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var REG_LINK$1 = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
var script$b = {
    name: 'JsonString',
    props: {
        jsonValue: {
            type: String,
            required: true
        }
    },
    data: function data() {
        return {
            expand: true,
            canExtend: false
        };
    },
    mounted: function mounted() {
        if (this.$refs.itemRef.offsetHeight > this.$refs.holderRef.offsetHeight) {
            this.canExtend = true;
        }
    },
    methods: {
        toggle: function toggle() {
            this.expand = !this.expand;
        }
    },
    render: function render() {
        var value = this.jsonValue;
        var islink = REG_LINK$1.test(value);
        var domItem;
        if (!this.expand) {
            domItem = {
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                innerText: '...'
            };
        } else {
            domItem = {
                'class': {
                    'jv-item': true,
                    'jv-string': true
                },
                ref: 'itemRef'
            };
            if (islink) {
                value = '<a href="'.concat(value, '" target="_blank" class="jv-link">').concat(value, '</a>');
                domItem.innerHTML = '"'.concat(value.toString(), '"');
            } else {
                domItem.innerText = '"'.concat(value.toString(), '"');
            }
        }
        return vue.h('span', {}, [
            this.canExtend && vue.h('span', {
                'class': {
                    'jv-toggle': true,
                    open: this.expand
                },
                onClick: this.toggle
            }),
            vue.h('span', {
                'class': { 'jv-holder-node': true },
                ref: 'holderRef'
            }),
            vue.h('span', domItem)
        ]);
    }
};

script$b.__file = "src/Components/types/json-string.vue";

var script$a = {
    name: 'JsonUndefined',
    functional: true,
    props: {
        jsonValue: {
            type: Object,
            'default': null
        }
    },
    render: function render() {
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-undefined': true
            },
            innerText: this.jsonValue === null ? 'null' : 'undefined'
        });
    }
};

script$a.__file = "src/Components/types/json-undefined.vue";

var script$9 = {
    name: 'JsonNumber',
    functional: true,
    props: {
        jsonValue: {
            type: Number,
            required: true
        }
    },
    render: function render() {
        var isInteger = Number.isInteger(this.jsonValue);
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-number': true,
                'jv-number-integer': isInteger,
                'jv-number-float': !isInteger
            },
            innerText: this.jsonValue.toString()
        });
    }
};

script$9.__file = "src/Components/types/json-number.vue";

var script$8 = {
    name: 'JsonBoolean',
    functional: true,
    props: { jsonValue: Boolean },
    render: function render() {
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-boolean': true
            },
            innerText: this.jsonValue.toString()
        });
    }
};

script$8.__file = "src/Components/types/json-boolean.vue";

var script$7 = {
    name: 'JsonObject',
    props: {
        jsonValue: {
            type: Object,
            required: true
        },
        keyName: {
            type: String,
            'default': ''
        },
        depth: {
            type: Number,
            'default': 0
        },
        expand: Boolean,
        sort: Boolean,
        previewMode: Boolean,
        allowImageShow: Boolean
    },
    data: function data() {
        return { value: {} };
    },
    computed: {
        ordered: function ordered() {
            var _this = this;
            if (!this.sort) {
                return this.value;
            }
            var ordered = {};
            Object.keys(this.value).sort().forEach(function (key) {
                ordered[key] = _this.value[key];
            });
            return ordered;
        }
    },
    watch: {
        jsonValue: function jsonValue(newVal) {
            this.setValue(newVal);
        }
    },
    mounted: function mounted() {
        this.setValue(this.jsonValue);
    },
    methods: {
        setValue: function setValue(val) {
            var _this2 = this;
            setTimeout(function () {
                _this2.value = val;
            }, 0);
        },
        toggle: function toggle() {
            this.$emit('update:expand', !this.expand);
            this.dispatchEvent();
        },
        dispatchEvent: function dispatchEvent() {
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var elements = [];
        if (!this.keyName) {
            elements.push(vue.h('span', {
                'class': {
                    'jv-toggle': true,
                    'open': !!this.expand
                },
                onClick: this.toggle
            }));
        }
        elements.push(vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-object': true
            },
            innerText: '{'
        }));
        if (this.expand) {
            for (var key in this.ordered) {
                if (this.ordered.hasOwnProperty(key)) {
                    var value = this.ordered[key];
                    elements.push(vue.h(script$1, {
                        key: key,
                        style: { display: !this.expand ? 'none' : undefined },
                        sort: this.sort,
                        keyName: key,
                        depth: this.depth + 1,
                        value: value,
                        previewMode: this.previewMode,
                        allowImageShow: this.allowImageShow,
                        mineType: this.value.mime_type,
                        originalValue: this.value
                    }));
                }
            }
        }
        if (!this.expand && Object.keys(this.value).length) {
            elements.push(vue.h('span', {
                style: { display: this.expand ? 'none' : undefined },
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                title: 'click to reveal object content (keys: '.concat(Object.keys(this.ordered).join(', '), ')'),
                innerText: '...'
            }));
        }
        elements.push(vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-object': true
            },
            innerText: '}'
        }));
        return vue.h('span', elements);
    }
};

script$7.__file = "src/Components/types/json-object.vue";

var script$6 = {
    name: 'JsonArray',
    props: {
        jsonValue: {
            type: Array,
            required: true
        },
        keyName: {
            type: String,
            'default': ''
        },
        depth: {
            type: Number,
            'default': 0
        },
        sort: Boolean,
        expand: Boolean,
        previewMode: Boolean,
        allowImageShow: Boolean
    },
    data: function data() {
        return { value: [] };
    },
    watch: {
        jsonValue: function jsonValue(newVal) {
            this.setValue(newVal);
        }
    },
    mounted: function mounted() {
        this.setValue(this.jsonValue);
    },
    methods: {
        setValue: function setValue(vals) {
            var _this = this;
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            if (index === 0) {
                this.value = [];
            }
            setTimeout(function () {
                if (vals.length > index) {
                    _this.value.push(vals[index]);
                    _this.setValue(vals, index + 1);
                }
            }, 0);
        },
        toggle: function toggle() {
            this.$emit('update:expand', !this.expand);
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var _this2 = this;
        var elements = [];
        if (!this.keyName) {
            elements.push(vue.h('span', {
                'class': {
                    'jv-toggle': true,
                    'open': !!this.expand
                },
                onClick: this.toggle
            }));
        }
        elements.push(vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-array': true
            },
            innerText: '['
        }));
        if (this.expand) {
            this.value.forEach(function (value, key) {
                elements.push(vue.h(script$1, {
                    key: key,
                    style: { display: _this2.expand ? undefined : 'none' },
                    sort: _this2.sort,
                    depth: _this2.depth + 1,
                    value: value,
                    previewMode: _this2.previewMode,
                    allowImageShow: _this2.allowImageShow
                }));
            });
        }
        if (!this.expand && this.value.length) {
            elements.push(vue.h('span', {
                style: { display: undefined },
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                title: 'click to reveal '.concat(this.value.length, ' hidden items'),
                innerText: '...'
            }));
        }
        elements.push(vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-array': true
            },
            innerText: ']'
        }));
        return vue.h('span', elements);
    }
};

script$6.__file = "src/Components/types/json-array.vue";

var script$5 = {
    name: 'JsonFunction',
    functional: true,
    props: {
        jsonValue: {
            type: Function,
            required: true
        }
    },
    render: function render() {
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-function': true
            },
            attrs: { title: this.jsonValue.toString() },
            innerHTML: '&lt;function&gt;'
        });
    }
};

script$5.__file = "src/Components/types/json-function.vue";

var script$4 = {
    name: 'JsonDate',
    inject: ['timeformat'],
    functional: true,
    props: {
        jsonValue: {
            type: Date,
            required: true
        }
    },
    render: function render() {
        var value = this.jsonValue;
        var timeformat = this.timeformat;
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-string': true
            },
            innerText: '"'.concat(timeformat(value), '"')
        });
    }
};

script$4.__file = "src/Components/types/json-date.vue";

var REG_LINK = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
var script$3 = {
    name: 'JsonString',
    props: {
        jsonValue: {
            type: RegExp,
            required: true
        }
    },
    data: function data() {
        return {
            expand: true,
            canExtend: false
        };
    },
    mounted: function mounted() {
        if (this.$refs.itemRef.offsetHeight > this.$refs.holderRef.offsetHeight) {
            this.canExtend = true;
        }
    },
    methods: {
        toggle: function toggle() {
            this.expand = !this.expand;
        }
    },
    render: function render() {
        var value = this.jsonValue;
        var islink = REG_LINK.test(value);
        var domItem;
        if (!this.expand) {
            domItem = {
                'class': { 'jv-ellipsis': true },
                onClick: this.toggle,
                innerText: '...'
            };
        } else {
            domItem = {
                'class': {
                    'jv-item': true,
                    'jv-string': true
                },
                ref: 'itemRef'
            };
            if (islink) {
                value = '<a href="'.concat(value, '" target="_blank" class="jv-link">').concat(value, '</a>');
                domItem.innerHTML = ''.concat(value.toString());
            } else {
                domItem.innerText = ''.concat(value.toString());
            }
        }
        return vue.h('span', {}, [
            this.canExtend && vue.h('span', {
                'class': {
                    'jv-toggle': true,
                    open: this.expand
                },
                onClick: this.toggle
            }),
            vue.h('span', {
                'class': { 'jv-holder-node': true },
                ref: 'holderRef'
            }),
            vue.h('span', domItem)
        ]);
    }
};

script$3.__file = "src/Components/types/json-regexp.vue";

var script$2 = {
    name: 'JsonImage',
    functional: true,
    props: {
        jsonValue: {
            type: [
                String,
                Blob
            ],
            required: true
        },
        originalValue: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function,
                Date
            ],
            'default': null
        },
        popup: Boolean
    },
    methods: {
        toggle: function toggle() {
            this.$emit('update:popup', true);
            this.dispatchEvent();
        },
        dispatchEvent: function dispatchEvent() {
            try {
                this.$el.dispatchEvent(new CustomEvent('jvImgPopup', { detail: this.originalValue }));
            } catch (e) {
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent('jvImgPopup', true, false, this.originalValue);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        return vue.h('span', {
            'class': {
                'jv-item': true,
                'jv-image': true
            },
            onClick: this.toggle,
            innerText: 'click to show the image'
        });
    }
};

script$2.__file = "src/Components/types/json-image.vue";

var debounce = function debounce(func, wait) {
    var startTime = Date.now();
    var timer;
    return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }
        if (Date.now() - startTime < wait && timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            func.apply(void 0, args);
        }, wait);
        startTime = Date.now();
    };
};
var base64toBlob = function base64toBlob(base64) {
    var binStr = window.atob(base64);
    var uint8Array = Uint8Array.from(binStr, function (x) {
        return x.charCodeAt(0);
    });
    var buff = uint8Array.buffer;
    var blobURL = window.URL.createObjectURL(new Blob([buff]));
    return blobURL;
};
var checkIslegalURL = function checkIslegalURL(url) {
    return /^(http|https):\/\//.test(url);
};

var script$1 = {
    name: 'JsonBox',
    inject: [
        'expandDepth',
        'keyClick'
    ],
    props: {
        value: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function,
                Date
            ],
            'default': null
        },
        keyName: {
            type: String,
            'default': ''
        },
        sort: Boolean,
        depth: {
            type: Number,
            'default': 0
        },
        previewMode: Boolean,
        allowImageShow: Boolean,
        originalValue: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function,
                Date
            ],
            'default': null
        },
        mineType: {
            type: String,
            'default': null
        }
    },
    data: function data() {
        return {
            expand: true,
            popup: false
        };
    },
    mounted: function mounted() {
        this.expand = this.previewMode || (this.depth >= this.expandDepth ? false : true);
    },
    methods: {
        toggle: function toggle() {
            this.expand = !this.expand;
            try {
                this.$el.dispatchEvent(new Event('resized'));
            } catch (e) {
                var evt = document.createEvent('Event');
                evt.initEvent('resized', true, false);
                this.$el.dispatchEvent(evt);
            }
        }
    },
    render: function render() {
        var _this$mineType, _this$value, _this = this;
        var elements = [];
        var dataType;
        if (this.value === null || this.value === undefined) {
            dataType = script$a;
        } else if (Array.isArray(this.value)) {
            dataType = script$6;
        } else if (Object.prototype.toString.call(this.value) === '[object Date]') {
            dataType = script$4;
        } else if (this.allowImageShow && (typeof this.value === 'string' && (_this$mineType = this.mineType) !== null && _this$mineType !== void 0 && _this$mineType.includes('image') && this.keyName === 'uri' && checkIslegalURL(this.value) || this.keyName === 'blob' && this.value.length > 0)) {
            dataType = script$2;
        } else if (_typeof(this.value) === 'object') {
            dataType = script$7;
        } else if (typeof this.value === 'number') {
            dataType = script$9;
        } else if (typeof this.value === 'string') {
            dataType = script$b;
        } else if (typeof this.value === 'boolean') {
            dataType = script$8;
        } else if (typeof this.value === 'function') {
            dataType = script$5;
        }
        if (((_this$value = this.value) === null || _this$value === void 0 ? void 0 : _this$value.constructor) === RegExp) {
            dataType = script$3;
        }
        var complex = this.keyName && this.value && (Array.isArray(this.value) || _typeof(this.value) === 'object' && Object.prototype.toString.call(this.value) !== '[object Date]');
        if (complex) {
            elements.push(vue.h('span', {
                'class': {
                    'jv-toggle': true,
                    open: !!this.expand
                },
                onClick: this.toggle
            }));
        }
        if (this.keyName) {
            elements.push(vue.h('span', {
                'class': { 'jv-key': true },
                onClick: function onClick() {
                    _this.keyClick(_this.keyName);
                },
                innerText: ''.concat(this.keyName, ':')
            }));
        }
        elements.push(vue.h(dataType, {
            'class': { 'jv-push': true },
            jsonValue: this.value,
            keyName: this.keyName,
            sort: this.sort,
            depth: this.depth,
            expand: this.expand,
            previewMode: this.previewMode,
            allowImageShow: this.allowImageShow,
            originalValue: this.originalValue,
            'onUpdate:expand': function onUpdateExpand(value) {
                _this.expand = value;
            },
            'onUpdate:popup': function onUpdatePopup(value) {
                _this.popup = value;
            }
        }));
        return vue.h('div', {
            'class': {
                'jv-node': true,
                'jv-key-node': Boolean(this.keyName) && !complex,
                toggle: complex
            }
        }, elements);
    }
};

script$1.__file = "src/Components/json-box.vue";

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var clipboard = {exports: {}};

(function (module, exports) {
    (function webpackUniversalModuleDefinition(root, factory) {
        module.exports = factory();
    }(commonjsGlobal, function () {
        return function () {
            var __webpack_modules__ = {
                686: function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                    __webpack_require__.d(__webpack_exports__, {
                        'default': function () {
                            return clipboard;
                        }
                    });
                    var tiny_emitter = __webpack_require__(279);
                    var tiny_emitter_default = __webpack_require__.n(tiny_emitter);
                    var listen = __webpack_require__(370);
                    var listen_default = __webpack_require__.n(listen);
                    var src_select = __webpack_require__(817);
                    var select_default = __webpack_require__.n(src_select);
                    function command(type) {
                        try {
                            return document.execCommand(type);
                        } catch (err) {
                            return false;
                        }
                    }
                    var ClipboardActionCut = function ClipboardActionCut(target) {
                        var selectedText = select_default()(target);
                        command('cut');
                        return selectedText;
                    };
                    var actions_cut = ClipboardActionCut;
                    function createFakeElement(value) {
                        var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
                        var fakeElement = document.createElement('textarea');
                        fakeElement.style.fontSize = '12pt';
                        fakeElement.style.border = '0';
                        fakeElement.style.padding = '0';
                        fakeElement.style.margin = '0';
                        fakeElement.style.position = 'absolute';
                        fakeElement.style[isRTL ? 'right' : 'left'] = '-9999px';
                        var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                        fakeElement.style.top = ''.concat(yPosition, 'px');
                        fakeElement.setAttribute('readonly', '');
                        fakeElement.value = value;
                        return fakeElement;
                    }
                    var ClipboardActionCopy = function ClipboardActionCopy(target) {
                        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { container: document.body };
                        var selectedText = '';
                        if (typeof target === 'string') {
                            var fakeElement = createFakeElement(target);
                            options.container.appendChild(fakeElement);
                            selectedText = select_default()(fakeElement);
                            command('copy');
                            fakeElement.remove();
                        } else {
                            selectedText = select_default()(target);
                            command('copy');
                        }
                        return selectedText;
                    };
                    var actions_copy = ClipboardActionCopy;
                    function _typeof(obj) {
                        '@babel/helpers - typeof';
                        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
                            _typeof = function _typeof(obj) {
                                return typeof obj;
                            };
                        } else {
                            _typeof = function _typeof(obj) {
                                return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
                            };
                        }
                        return _typeof(obj);
                    }
                    var ClipboardActionDefault = function ClipboardActionDefault() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        var _options$action = options.action, action = _options$action === void 0 ? 'copy' : _options$action, container = options.container, target = options.target, text = options.text;
                        if (action !== 'copy' && action !== 'cut') {
                            throw new Error('Invalid "action" value, use either "copy" or "cut"');
                        }
                        if (target !== undefined) {
                            if (target && _typeof(target) === 'object' && target.nodeType === 1) {
                                if (action === 'copy' && target.hasAttribute('disabled')) {
                                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                }
                                if (action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                                    throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                }
                            } else {
                                throw new Error('Invalid "target" value, use a valid Element');
                            }
                        }
                        if (text) {
                            return actions_copy(text, { container: container });
                        }
                        if (target) {
                            return action === 'cut' ? actions_cut(target) : actions_copy(target, { container: container });
                        }
                    };
                    var actions_default = ClipboardActionDefault;
                    function clipboard_typeof(obj) {
                        '@babel/helpers - typeof';
                        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
                            clipboard_typeof = function _typeof(obj) {
                                return typeof obj;
                            };
                        } else {
                            clipboard_typeof = function _typeof(obj) {
                                return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
                            };
                        }
                        return clipboard_typeof(obj);
                    }
                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError('Cannot call a class as a function');
                        }
                    }
                    function _defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ('value' in descriptor)
                                descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }
                    function _createClass(Constructor, protoProps, staticProps) {
                        if (protoProps)
                            _defineProperties(Constructor.prototype, protoProps);
                        if (staticProps)
                            _defineProperties(Constructor, staticProps);
                        return Constructor;
                    }
                    function _inherits(subClass, superClass) {
                        if (typeof superClass !== 'function' && superClass !== null) {
                            throw new TypeError('Super expression must either be null or a function');
                        }
                        subClass.prototype = Object.create(superClass && superClass.prototype, {
                            constructor: {
                                value: subClass,
                                writable: true,
                                configurable: true
                            }
                        });
                        if (superClass)
                            _setPrototypeOf(subClass, superClass);
                    }
                    function _setPrototypeOf(o, p) {
                        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                            o.__proto__ = p;
                            return o;
                        };
                        return _setPrototypeOf(o, p);
                    }
                    function _createSuper(Derived) {
                        var hasNativeReflectConstruct = _isNativeReflectConstruct();
                        return function _createSuperInternal() {
                            var Super = _getPrototypeOf(Derived), result;
                            if (hasNativeReflectConstruct) {
                                var NewTarget = _getPrototypeOf(this).constructor;
                                result = Reflect.construct(Super, arguments, NewTarget);
                            } else {
                                result = Super.apply(this, arguments);
                            }
                            return _possibleConstructorReturn(this, result);
                        };
                    }
                    function _possibleConstructorReturn(self, call) {
                        if (call && (clipboard_typeof(call) === 'object' || typeof call === 'function')) {
                            return call;
                        }
                        return _assertThisInitialized(self);
                    }
                    function _assertThisInitialized(self) {
                        if (self === void 0) {
                            throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
                        }
                        return self;
                    }
                    function _isNativeReflectConstruct() {
                        if (typeof Reflect === 'undefined' || !Reflect.construct)
                            return false;
                        if (Reflect.construct.sham)
                            return false;
                        if (typeof Proxy === 'function')
                            return true;
                        try {
                            Date.prototype.toString.call(Reflect.construct(Date, [], function () {
                            }));
                            return true;
                        } catch (e) {
                            return false;
                        }
                    }
                    function _getPrototypeOf(o) {
                        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                            return o.__proto__ || Object.getPrototypeOf(o);
                        };
                        return _getPrototypeOf(o);
                    }
                    function getAttributeValue(suffix, element) {
                        var attribute = 'data-clipboard-'.concat(suffix);
                        if (!element.hasAttribute(attribute)) {
                            return;
                        }
                        return element.getAttribute(attribute);
                    }
                    var Clipboard = function (_Emitter) {
                        _inherits(Clipboard, _Emitter);
                        var _super = _createSuper(Clipboard);
                        function Clipboard(trigger, options) {
                            var _this;
                            _classCallCheck(this, Clipboard);
                            _this = _super.call(this);
                            _this.resolveOptions(options);
                            _this.listenClick(trigger);
                            return _this;
                        }
                        _createClass(Clipboard, [
                            {
                                key: 'resolveOptions',
                                value: function resolveOptions() {
                                    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                                    this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                                    this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                                    this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                                    this.container = clipboard_typeof(options.container) === 'object' ? options.container : document.body;
                                }
                            },
                            {
                                key: 'listenClick',
                                value: function listenClick(trigger) {
                                    var _this2 = this;
                                    this.listener = listen_default()(trigger, 'click', function (e) {
                                        return _this2.onClick(e);
                                    });
                                }
                            },
                            {
                                key: 'onClick',
                                value: function onClick(e) {
                                    var trigger = e.delegateTarget || e.currentTarget;
                                    var action = this.action(trigger) || 'copy';
                                    var text = actions_default({
                                        action: action,
                                        container: this.container,
                                        target: this.target(trigger),
                                        text: this.text(trigger)
                                    });
                                    this.emit(text ? 'success' : 'error', {
                                        action: action,
                                        text: text,
                                        trigger: trigger,
                                        clearSelection: function clearSelection() {
                                            if (trigger) {
                                                trigger.focus();
                                            }
                                            document.activeElement.blur();
                                            window.getSelection().removeAllRanges();
                                        }
                                    });
                                }
                            },
                            {
                                key: 'defaultAction',
                                value: function defaultAction(trigger) {
                                    return getAttributeValue('action', trigger);
                                }
                            },
                            {
                                key: 'defaultTarget',
                                value: function defaultTarget(trigger) {
                                    var selector = getAttributeValue('target', trigger);
                                    if (selector) {
                                        return document.querySelector(selector);
                                    }
                                }
                            },
                            {
                                key: 'defaultText',
                                value: function defaultText(trigger) {
                                    return getAttributeValue('text', trigger);
                                }
                            },
                            {
                                key: 'destroy',
                                value: function destroy() {
                                    this.listener.destroy();
                                }
                            }
                        ], [
                            {
                                key: 'copy',
                                value: function copy(target) {
                                    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { container: document.body };
                                    return actions_copy(target, options);
                                }
                            },
                            {
                                key: 'cut',
                                value: function cut(target) {
                                    return actions_cut(target);
                                }
                            },
                            {
                                key: 'isSupported',
                                value: function isSupported() {
                                    var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [
                                        'copy',
                                        'cut'
                                    ];
                                    var actions = typeof action === 'string' ? [action] : action;
                                    var support = !!document.queryCommandSupported;
                                    actions.forEach(function (action) {
                                        support = support && !!document.queryCommandSupported(action);
                                    });
                                    return support;
                                }
                            }
                        ]);
                        return Clipboard;
                    }(tiny_emitter_default());
                    var clipboard = Clipboard;
                },
                828: function (module) {
                    var DOCUMENT_NODE_TYPE = 9;
                    if (typeof Element !== 'undefined' && !Element.prototype.matches) {
                        var proto = Element.prototype;
                        proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
                    }
                    function closest(element, selector) {
                        while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                            if (typeof element.matches === 'function' && element.matches(selector)) {
                                return element;
                            }
                            element = element.parentNode;
                        }
                    }
                    module.exports = closest;
                },
                438: function (module, __unused_webpack_exports, __webpack_require__) {
                    var closest = __webpack_require__(828);
                    function _delegate(element, selector, type, callback, useCapture) {
                        var listenerFn = listener.apply(this, arguments);
                        element.addEventListener(type, listenerFn, useCapture);
                        return {
                            destroy: function () {
                                element.removeEventListener(type, listenerFn, useCapture);
                            }
                        };
                    }
                    function delegate(elements, selector, type, callback, useCapture) {
                        if (typeof elements.addEventListener === 'function') {
                            return _delegate.apply(null, arguments);
                        }
                        if (typeof type === 'function') {
                            return _delegate.bind(null, document).apply(null, arguments);
                        }
                        if (typeof elements === 'string') {
                            elements = document.querySelectorAll(elements);
                        }
                        return Array.prototype.map.call(elements, function (element) {
                            return _delegate(element, selector, type, callback, useCapture);
                        });
                    }
                    function listener(element, selector, type, callback) {
                        return function (e) {
                            e.delegateTarget = closest(e.target, selector);
                            if (e.delegateTarget) {
                                callback.call(element, e);
                            }
                        };
                    }
                    module.exports = delegate;
                },
                879: function (__unused_webpack_module, exports) {
                    exports.node = function (value) {
                        return value !== undefined && value instanceof HTMLElement && value.nodeType === 1;
                    };
                    exports.nodeList = function (value) {
                        var type = Object.prototype.toString.call(value);
                        return value !== undefined && (type === '[object NodeList]' || type === '[object HTMLCollection]') && 'length' in value && (value.length === 0 || exports.node(value[0]));
                    };
                    exports.string = function (value) {
                        return typeof value === 'string' || value instanceof String;
                    };
                    exports.fn = function (value) {
                        var type = Object.prototype.toString.call(value);
                        return type === '[object Function]';
                    };
                },
                370: function (module, __unused_webpack_exports, __webpack_require__) {
                    var is = __webpack_require__(879);
                    var delegate = __webpack_require__(438);
                    function listen(target, type, callback) {
                        if (!target && !type && !callback) {
                            throw new Error('Missing required arguments');
                        }
                        if (!is.string(type)) {
                            throw new TypeError('Second argument must be a String');
                        }
                        if (!is.fn(callback)) {
                            throw new TypeError('Third argument must be a Function');
                        }
                        if (is.node(target)) {
                            return listenNode(target, type, callback);
                        } else if (is.nodeList(target)) {
                            return listenNodeList(target, type, callback);
                        } else if (is.string(target)) {
                            return listenSelector(target, type, callback);
                        } else {
                            throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
                        }
                    }
                    function listenNode(node, type, callback) {
                        node.addEventListener(type, callback);
                        return {
                            destroy: function () {
                                node.removeEventListener(type, callback);
                            }
                        };
                    }
                    function listenNodeList(nodeList, type, callback) {
                        Array.prototype.forEach.call(nodeList, function (node) {
                            node.addEventListener(type, callback);
                        });
                        return {
                            destroy: function () {
                                Array.prototype.forEach.call(nodeList, function (node) {
                                    node.removeEventListener(type, callback);
                                });
                            }
                        };
                    }
                    function listenSelector(selector, type, callback) {
                        return delegate(document.body, selector, type, callback);
                    }
                    module.exports = listen;
                },
                817: function (module) {
                    function select(element) {
                        var selectedText;
                        if (element.nodeName === 'SELECT') {
                            element.focus();
                            selectedText = element.value;
                        } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
                            var isReadOnly = element.hasAttribute('readonly');
                            if (!isReadOnly) {
                                element.setAttribute('readonly', '');
                            }
                            element.select();
                            element.setSelectionRange(0, element.value.length);
                            if (!isReadOnly) {
                                element.removeAttribute('readonly');
                            }
                            selectedText = element.value;
                        } else {
                            if (element.hasAttribute('contenteditable')) {
                                element.focus();
                            }
                            var selection = window.getSelection();
                            var range = document.createRange();
                            range.selectNodeContents(element);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            selectedText = selection.toString();
                        }
                        return selectedText;
                    }
                    module.exports = select;
                },
                279: function (module) {
                    function E() {
                    }
                    E.prototype = {
                        on: function (name, callback, ctx) {
                            var e = this.e || (this.e = {});
                            (e[name] || (e[name] = [])).push({
                                fn: callback,
                                ctx: ctx
                            });
                            return this;
                        },
                        once: function (name, callback, ctx) {
                            var self = this;
                            function listener() {
                                self.off(name, listener);
                                callback.apply(ctx, arguments);
                            }
                            listener._ = callback;
                            return this.on(name, listener, ctx);
                        },
                        emit: function (name) {
                            var data = [].slice.call(arguments, 1);
                            var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                            var i = 0;
                            var len = evtArr.length;
                            for (i; i < len; i++) {
                                evtArr[i].fn.apply(evtArr[i].ctx, data);
                            }
                            return this;
                        },
                        off: function (name, callback) {
                            var e = this.e || (this.e = {});
                            var evts = e[name];
                            var liveEvents = [];
                            if (evts && callback) {
                                for (var i = 0, len = evts.length; i < len; i++) {
                                    if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                                        liveEvents.push(evts[i]);
                                }
                            }
                            liveEvents.length ? e[name] = liveEvents : delete e[name];
                            return this;
                        }
                    };
                    module.exports = E;
                    module.exports.TinyEmitter = E;
                }
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
                if (__webpack_module_cache__[moduleId]) {
                    return __webpack_module_cache__[moduleId].exports;
                }
                var module = __webpack_module_cache__[moduleId] = { exports: {} };
                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
                return module.exports;
            }
            !function () {
                __webpack_require__.n = function (module) {
                    var getter = module && module.__esModule ? function () {
                        return module['default'];
                    } : function () {
                        return module;
                    };
                    __webpack_require__.d(getter, { a: getter });
                    return getter;
                };
            }();
            !function () {
                __webpack_require__.d = function (exports, definition) {
                    for (var key in definition) {
                        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                            Object.defineProperty(exports, key, {
                                enumerable: true,
                                get: definition[key]
                            });
                        }
                    }
                };
            }();
            !function () {
                __webpack_require__.o = function (obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                };
            }();
            return __webpack_require__(686);
        }().default;
    }));
}(clipboard));
var Clipboard = getDefaultExportFromCjs(clipboard.exports);

var script = {
    name: 'JsonViewer',
    components: { JsonBox: script$1 },
    props: {
        value: {
            type: [
                Object,
                Array,
                String,
                Number,
                Boolean,
                Function
            ],
            required: true
        },
        expanded: {
            type: Boolean,
            'default': false
        },
        expandDepth: {
            type: Number,
            'default': 1
        },
        copyable: {
            type: [
                Boolean,
                Object
            ],
            'default': false
        },
        sort: {
            type: Boolean,
            'default': false
        },
        boxed: {
            type: Boolean,
            'default': false
        },
        theme: {
            type: String,
            'default': 'light'
        },
        timeformat: {
            type: Function,
            'default': function _default(value) {
                return value.toLocaleString();
            }
        },
        allowImageShow: {
            type: Boolean,
            'default': false
        }
    },
    provide: function provide() {
        return {
            expandDepth: this.expandDepth,
            timeformat: this.timeformat,
            keyClick: this.keyClick
        };
    },
    data: function data() {
        return {
            copied: false,
            previewMode: false,
            expandableCode: false,
            expandCode: this.expanded,
            showPopup: false,
            localKey: 0,
            imgeSrc: '',
            isShowMore: false
        };
    },
    emits: ['onKeyClick'],
    computed: {
        jvClass: function jvClass() {
            return 'jv-container ' + 'jv-' + this.theme + (this.boxed ? ' boxed' : '');
        },
        copyText: function copyText() {
            var _this$copyable = this.copyable, copyText = _this$copyable.copyText, copiedText = _this$copyable.copiedText, timeout = _this$copyable.timeout, align = _this$copyable.align;
            return {
                copyText: copyText || 'copy',
                copiedText: copiedText || 'copied!',
                timeout: timeout || 2000,
                align: align
            };
        }
    },
    watch: {
        value: function value() {
            this.onResized();
        }
    },
    mounted: function mounted() {
        this.reset();
    },
    methods: {
        reset: function reset() {
            var _this = this;
            this.debounceResized = debounce(this.debResized.bind(this), 200);
            if (this.boxed && this.$refs.jsonBox) {
                this.onResized();
                this.$refs.jsonBox.$el.addEventListener('resized', this.onResized, true);
                this.$refs.jsonBox.$el.addEventListener('jvImgPopup', this.onPopup, true);
            }
            if (this.copyable) {
                var clipBoard = new Clipboard(this.$refs.clip, {
                    text: function text() {
                        return JSON.stringify(_this.value, null, 2);
                    }
                });
                clipBoard.on('success', function (e) {
                    _this.onCopied(e);
                });
            }
        },
        more: function more() {
            var _this2 = this;
            this.localKey += 1;
            this.previewMode = !this.previewMode;
            this.isShowMore = !this.isShowMore;
            this.$nextTick(function () {
                _this2.reset();
            });
        },
        closePopup: function closePopup() {
            this.showPopup = !this.showPopup;
            this.imgeSrc = '';
        },
        onPopup: function onPopup(e) {
            var obj = e.detail;
            var source = checkIslegalURL(obj.uri) ? obj.uri : base64toBlob(obj.blob);
            this.imgeSrc = source;
            this.showPopup = !this.showPopup;
        },
        onResized: function onResized() {
            this.debounceResized();
        },
        debResized: function debResized() {
            var _this3 = this;
            this.$nextTick(function () {
                if (!_this3.$refs.jsonBox)
                    return;
                if (_this3.$refs.jsonBox.$el.clientHeight >= 250) {
                    _this3.expandableCode = true;
                } else {
                    _this3.expandableCode = false;
                }
            });
        },
        keyClick: function keyClick(keyName) {
            this.$emit('onKeyClick', keyName);
        },
        onCopied: function onCopied(copyEvent) {
            var _this4 = this;
            if (this.copied) {
                return;
            }
            this.copied = true;
            setTimeout(function () {
                _this4.copied = false;
            }, this.copyText.timeout);
            this.$emit('copied', copyEvent);
        },
        toggleExpandCode: function toggleExpandCode() {
            this.expandCode = !this.expandCode;
        }
    }
};

var _hoisted_1 = { 'class': 'header-action' };
var _hoisted_2 = {
    key: 0,
    'class': 'jv-image-popup'
};
var _hoisted_3 = { 'class': 'show-area' };
var _hoisted_4 = ['src'];
function render(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_json_box = vue.resolveComponent('json-box');
    return vue.openBlock(), vue.createElementBlock('div', { 'class': vue.normalizeClass($options.jvClass) }, [
        vue.createElementVNode('div', _hoisted_1, [
            $props.copyable ? (vue.openBlock(), vue.createElementBlock('div', {
                key: 0,
                'class': vue.normalizeClass('jv-tooltip '.concat($options.copyText.align || 'right'))
            }, [vue.createElementVNode('span', {
                    ref: 'clip',
                    'class': vue.normalizeClass([
                        'jv-button',
                        { copied: $data.copied }
                    ])
                }, [vue.renderSlot(_ctx.$slots, 'copy', { copied: $data.copied }, function () {
                        return [vue.createTextVNode(vue.toDisplayString($data.copied ? $options.copyText.copiedText : $options.copyText.copyText), 1)];
                    })], 2)], 2)) : vue.createCommentVNode('v-if', true),
            vue.createElementVNode('div', {
                'class': 'jv-button collapses',
                onClick: _cache[0] || (_cache[0] = function () {
                    return $options.more && $options.more.apply($options, arguments);
                })
            }, vue.toDisplayString($data.isShowMore ? 'collapse' : 'expand'), 1)
        ]),
        vue.createElementVNode('div', {
            'class': vue.normalizeClass([
                'jv-code',
                {
                    open: $data.expandCode,
                    boxed: $props.boxed
                }
            ])
        }, [(vue.openBlock(), vue.createBlock(_component_json_box, {
                key: $data.localKey,
                ref: 'jsonBox',
                value: $props.value,
                sort: $props.sort,
                'preview-mode': $data.previewMode,
                'allow-image-show': $props.allowImageShow
            }, null, 8, [
                'value',
                'sort',
                'preview-mode',
                'allow-image-show'
            ]))], 2),
        vue.createCommentVNode(' <div\n      v-if="expandableCode && boxed"\n      class="jv-more"\n      @click="toggleExpandCode"\n    >\n      <span class="jv-toggle" :class="{ open: !!expandCode }" />\n    </div> '),
        $data.showPopup ? (vue.openBlock(), vue.createElementBlock('div', _hoisted_2, [vue.createElementVNode('div', _hoisted_3, [
                vue.createElementVNode('img', {
                    'class': 'jv-image',
                    src: $data.imgeSrc,
                    alt: ''
                }, null, 8, _hoisted_4),
                vue.createElementVNode('div', {
                    'class': 'close-btn',
                    onClick: _cache[1] || (_cache[1] = vue.withModifiers(function () {
                        return $options.closePopup && $options.closePopup.apply($options, arguments);
                    }, ['stop']))
                }, '+')
            ])])) : vue.createCommentVNode('v-if', true)
    ], 2);
}

script.render = render;
script.__file = "src/Components/json-viewer.vue";

var install = function install(app) {
    app.component(script.name, script);
};
var index = { install: install };

exports.JsonViewer = script;
exports["default"] = index;
