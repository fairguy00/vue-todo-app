const path = require('path')//nodejs path 상수제공
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')//빌드전 dist 폴더 클린
const merge = require('webpack-merge')//개발/제품 빌드옵션분기

require('@babel/polyfill')
// nodejs 런타임에서 실행되는 파일

// 전처리기(LESS SASS(SCSS), stylers, preprocessor)-css보다 고급문법지원
// -> css
// -> 후처리(postCSS - Autoprefixer - (브라우저)공급업체 접두사 - webkit - ms - mozi - o)
// 여기선 전처리 scss 사용위해 sass 모듈사용
//npm i -D sass-loader@^7 node-sass 메이저7버전의 제일 최신버전설치 , node-sass 노드환경에서 sass 사용위한모듈
// 버전은 1.2.3 메이저버전은 1 마이너버전은 2 패치는 3
// npm i -D autoprefixer postcss-loader 후처리 모듈 설치 postcss-loader는 웹팩관련 postcss 관련모듈

module.exports = (env, opts) => { //opts 개발용인지 제품용인지
  const config = {

    resolve: {//확장자생략
      extensions: [
        '.vue', '.js'
      ]
    },
    entry: {
      //app: path.join(__dirname, 'main.js')//app - 별칭
      app: [
        '@babel/polyfill', //진입점과 함께 구형브라우저 지원모듈설정 npm i @babel/polyfill 설치 필요
        path.join(__dirname, 'main.js')
      ]
      //__dirname nodejs 에서 제공하는 전역변수
    }, //진입점 - 프로젝트가 돌아가기위해 제일먼저 돌아갈파일
    //결과물에 대한 설정
    output: {
      //filename: 'app.js',//결과물의 이름
      filename: '[name].js', //엔트리의 이름의 별칭 app.js
      path: path.join(__dirname, 'dist')//app.js 디렉터리 dist 에 넣겠다
    }, //결과물에 대한 설정
    module: {
      rules: [
        // ... other rules
        { //npm install -D vue-loader vue-template-compiler
          test: /\.vue$/, //뷰확장자파일을 해석하는 정규표현식
          loader: 'vue-loader' //뷰해석하는 로더 지정
          //스타일해석하는 로더도 필요하다
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        //npm i -D babel-loader vue-style-loader css-loader 로 설치하자
        { // . 은 정규표현식에서 문자하나를 지칭 마침표를 의미하는 .을 표현하려면 \.
          // js로 끝나는 파일의미로 $ 로 표현
          test: /\.js$/, //.js 로 끝나는 파일을 바벨 로더로 해석하겠다
          //node_modules 안에 있는 스크립트는 해석할 필요가 없기때문에 exclude로
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.css$/,
          use: [//두개 이상의 모듈가져올 때 동작 "순서"대로 모듈 기입
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          //scss사용환경
          test: /\.scss$/, //정규표현식 .scss로 끝나는파일
          use: [
            'vue-style-loader', //모듈순서 주의
            'css-loader',
            'postcss-loader', //postcss가 sass-loader보다 먼저 있어야함
            'sass-loader'//scss-loader 아님 - 주의

          ]
        }
      ]
    },
    plugins: [//모듈이 돌아가고나서 추가로 하는것들 명시
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/', //이플러그인은 특정 디렉터리 파일들을 어딘가 넣어주는 역할
            to: ''
          }
        ]
      })

    ]
    //구조 -- 모듈 > plugins -- 결과
    //webpack 모듈 실행안되면 npx webpack --mode production' 로
    //콘솔에 webpack --mode production 대신
    //package.json 에 아래를 추가하여 npm run build로 사용
    //"scripts": {
    //"build":"webpack --mode production"
    //},
  }
  if (opts.mode === 'development') {
    return merge(config, {
      //추가 개발용 옵션
      //개발용- 웹팩 빌드를 할때 빌드시간을 축소하고 디버깅가능하게, 파일용량이 커짐
      devtool: 'eval',
      devServer: {
        open: false, //실행시 브라우저강제이동
        hot: true//hot module replacement 브라우저에 실시간 반영 default - true
      }
    })
  } else { // (opts.mode === 'production')
    return merge(config, {
      //추가 제품용 옵션
      devtool: 'cheap-module-source-map', //용량이 적어지고 최적화된빌드
      plugins: [
        new CleanWebpackPlugin()//output의 경로에 빌드를 할때마다 삭제하고시작하겠다 - 제품용
      ]
    })
  }
}
