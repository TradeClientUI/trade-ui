module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/component-definition-name-casing': ['error', 'PascalCase'], // 组件名称驼峰式
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            registeredComponentsOnly: true // 仅检查已注册组件
        }], // 组件标签驼峰式
        'vue/mustache-interpolation-spacing': ['error', 'always'], // 插值间距
        'vue/html-closing-bracket-spacing': ['error', {
            startTag: 'never',
            endTag: 'never',
            selfClosingTag: 'always'
        }], // 标签左右箭头的空格
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                normal: 'never',
                component: 'always'
            },
            svg: 'always',
            math: 'always'
        }], // 标签自闭合
        'vue/max-attributes-per-line': ['error', {
            singleline: 5,
            multiline: {
                max: 1,
                allowFirstLine: false
            }
        }], // 每行可接受的最大属性数量
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'always'
        }], // 闭合箭头的位置
        'vue/html-end-tags': 'error', // 禁止标签未闭合
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: []
        }], // 标签和属性的缩进
        'vue/html-quotes': ['error', 'single', {
            avoidEscape: true
        }], // 属性的单双引号以及是否需要转义属性内的单双引号
        'vue/attribute-hyphenation': ['error', 'always', {
            ignore: []
        }], // 属性名:连字符
        'vue/multiline-html-element-content-newline': ['error', {
            ignoreWhenEmpty: true,
            ignores: ['pre', 'textarea'],
            allowEmptyLines: false
        }], // 多行元素的内容前后自动换行对齐，禁止元素标签包裹处存在空行
        'vue/no-multi-spaces': ['error', {
            ignoreProperties: false
        }], // 属性前后删除冗余空格
        'vue/no-spaces-around-equal-signs-in-attribute': ['error'], // 不允许属性中等号周围有空格
        'vue/attributes-order': ['error', {
            order: [
                'DEFINITION',
                'LIST_RENDERING',
                'CONDITIONALS',
                'RENDER_MODIFIERS',
                'GLOBAL',
                'UNIQUE',
                'TWO_WAY_BINDING',
                'OTHER_DIRECTIVES',
                'OTHER_ATTR',
                'EVENTS',
                'CONTENT'
            ],
            alphabetical: true
        }], // 标签属性排序

        'vue/component-tags-order': ['error', {
            order: ['template', 'script', 'style']
        }], // 单文件组件的顶层元素排序
        'vue/order-in-components': ['error', {
            order: [
                'el',
                'name',
                'parent',
                'functional',
                'delimiters',
                'comments',
                'components',
                'mixins',
                'directives',
                'filters',
                'extends',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'fetch',
                'asyncData',
                'data',
                'computed',
                'watch',
                'LIFECYCLE_HOOKS',
                'methods',
                'head',
                ['template', 'render'],
                'renderError'
            ]
        }], // 组件内属性的声明顺序
        'vue/this-in-template': ['error', 'never'], // 禁止在模板内使用this
        'vue/script-indent': ['error', 4, {
            baseIndent: 0,
            switchCase: 1,
            ignores: []
        }], // vue组件内的script代码缩进
        indent: ['error', 4], // 代码缩进
        'vue/padding-line-between-blocks': ['error', 'always'], // vue组件三个顶层元素之间留空行
        'vue/object-curly-spacing': ['error', 'always'], // template属性内的花括号间距,例slot-scope='{k}' => "{ k }"
        'vue/no-reserved-component-names': 'error', // 禁止组件名称使用保留字
        'vue/match-component-file-name': ['error', {
            // "extensions": ["vue"],
            shouldMatchCase: false // 是否匹配大小写(若匹配，可能和强制大驼峰有冲突，建议false)
        }], // 组件名称和文件名称是否相同
        'vue/v-slot-style': ['error', {
            atComponent: 'v-slot',
            default: 'shorthand',
            named: 'shorthand'
        }], // v-slot样式

        'vue/v-on-style': ['error', 'shorthand'], // @on事件样式
        'vue/v-bind-style': ['error', 'shorthand'], // v-bind样式

        'vue/singleline-html-element-content-newline': ['error', {
            ignoreWhenNoAttributes: true,
            ignoreWhenEmpty: true,
            ignores: ['pre', 'textarea']
        }], // 单行元素基于属性和内容是否换行
        'vue/prop-name-casing': ['error', 'camelCase'], // props的key名驼峰式
        'vue/require-prop-types': 'off', // props 必须定义类型
        'vue/require-default-prop': 'off', // props 必须定义默认值
        'vue/no-template-shadow': 'error', // 禁止多个v-for嵌套中出现的同名变量
        'vue/valid-v-bind-sync': 'error', // sync是否有效
        'vue/valid-v-slot': 'error', // v-slot是否有效
        'vue/no-v-model-argument': 'off', // v-slot是否有效
        'vue/no-multiple-template-root': 'off', // 单文件组件不允许多个根节点
        'vue/no-v-for-template-key': 'off', // 单文件组件不允许多个根节点
        'vue/no-mutating-props': 'off',
        'comma-dangle': 'off',
        'dot-notation': 'off',
        'prefer-promise-reject-errors': 'off',
        'handle-callback-err': 'off',
        'quote-props': 'off',
        'no-prototype-builtins': 'off',
        'camelcase': 'off',
        'standard/no-callback-literal': 'off',
    },
    overrides: [{
        files: ['*.vue'],
        rules: {
            indent: 'off' // 对部分文件类型禁用缩进
        }
    }]
}
