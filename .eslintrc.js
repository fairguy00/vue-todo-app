const { TRUE } = require("node-sass");

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType:'module',
    },
    env: {
        browser: true,
        node:TRUE
    },
    extends: [
        'standard',//자바스크립트 표준스타일로 검사하겠다
        'plugin:vue/essential'//뷰 규칙

    ],
    plugins: [
        'vue'
    ],
    rules: {
        //예외규칙들 기입 0 에러표시 안함, 1 에러표시, 2 경고
        'no-new': 0,
        'spaced-comment': 0,
        'spaced-line-comment': 0

    }
}