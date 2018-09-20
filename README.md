# Node.js 서버리스 프레임웍을 사용하여 싱글페이지 포트폴리오 제작하기

## 사전 준비

- AWS 계정
- GitHub 계정
- Node.js, NPM(혹은 Yarn) 설치
    - Node.js 버전은 8.10(AWS Lambda의 최신 노드 버전)
    - 기왕이면 NVM을 이용해주세요.
- 각자 사용하시는 에디터(혹은 IDE)
    - 저는 vscode를 사용할 예정입니다.



## 1. GitHub Repository 만들기

1. 홈페이지 화면에서 "New repository"를 클릭합니다.

    ![스크린샷 2018-09-14 오후 3.59.15](./assets/images/image-1.png)



2. 내용을 채워주세요!

    ![image-20180914160318336](./assets/images/image-2.png)




3. Git client에서 `clone`해주세요. GUI 어플리케이션이 있다면 사용하셔도 됩니다.(전 GitKraken을 사용합니다. 짱짱🤩)

    ![image-20180914160318336](./assets/images/image-2.1.png)

    ```bash
    $git clone https://github.com/<username>/<projectName>.git
    ```



4. 해당 디렉토리로 이동합니다. `$cd <projectName>`
5. 이제 에디터로 넘어가시죠!



## 2. 개념 설명

### [AWS Lambda](https://aws.amazon.com/ko/lambda/)

> AWS Lambda를 사용하면 서버를 프로비저닝하거나 관리할 필요 없이 코드를 실행할 수 있습니다. 사용한 컴퓨팅 시간만큼만 비용을 지불하고, 코드가 실행되지 않을 때는 요금이 부과되지 않습니다. 
>
> Lambda에서는 사실상 모든 유형의 애플리케이션이나 백엔드 서비스에 대한 코드를 별도의 관리 없이 실행할 수  있습니다. 코드를 업로드하기만 하면, Lambda에서 높은 가용성으로 코드를 실행 및 확장하는 데 필요한 모든 것을 처리합니다.  다른 AWS 서비스에서 코드를 자동으로 트리거하도록 설정하거나 웹 또는 모바일 앱에서 직접 코드를 호출할 수 있습니다.
>
> \- AWS 홈페이지 설명 -

즉, 서버는 AWS에서 관리합니다😎. 고객은 코드만 관리하세요.😍(쏘 박력)

#### 유사 제품

- [GCP Cloud Functions](https://cloud.google.com/functions/)/[Firebase Functions](https://firebase.google.com/products/functions/)
- [MS Azure Functions](https://azure.microsoft.com/ko-kr/services/functions/)
- [IBM](https://www.ibm.com/cloud/functions), [네이버](https://www.ncloud.com/product/compute/cloudFunctions) 등등



### [AWS API Gateway](https://aws.amazon.com/ko/api-gateway/?nc2=type_a)

> 모든 규모의 API를 생성, 유지 관리 및 보호

> Amazon API Gateway는 어떤 규모에서든 개발자가 API를 손쉽게 생성, 게시, 유지 관리, 모니터링 및 보안할 수 
> 있게 해주는 완전관리형 서비스입니다. AWS Management Console에서 클릭 몇 번으로 애플리케이션이 백엔드 서비스의 데이터, 비즈니스 로직 또는 기능(예: [Amazon Elastic Compute Cloud(EC2)](https://aws.amazon.com/ko/ec2/)에서 실행되는 워크로드, [AWS Lambda](https://aws.amazon.com/ko/lambda/)에서 실행되는 코드, 기타 웹 애플리케이션 등)에 액세스할 수 있도록 "현관문" 역할을 하는 API를 생성할 수 있습니다.

http/https 프로토콜을 통해 들어오는 모든 API Endpoint를 생성하고 관리해줍니다. 

이걸 통해서 http로 들어온 요청을 Lambda에 연결해줄 수 있어요!(너와 나의 연결고리⛓)



### [Express.js](http://expressjs.com/ko/)

웹 어플리케이션과 API를 위한 웹 프레임워크입니다.

**클라이언트로부터 http request를 받아 express가 미들웨어와 라우터에 따라서 처리하고 response를 전달합니다.** 

일반적으로는 listen()을 통해 서버가 지속적으로 클라이언트의 요청을 기다립니다.

#### **그렇다면 express가 request만 전달 받을 수 있다면? 굳이 listen()을 쓰기 위해 계속 켜져 있을 필요가 있을까?🤔**



### [Serverless Framework](https://serverless.com/)

![image-20180914164502085](./assets/images/image-3.png)

Cloud 제공업체(AWS, GCP, Azure, IBM etc.)의 서버리스 모델(Lambda, Functions)과 연계 자원(Database, Endpoint, Event 등)을 손쉽게 구성하고 사용할 수 있습니다.

> AWS의 경우 CloudFormation이라는 서비스를 이용하여 통합 관리합니다.
>
> 코드는 S3에 업로드 됩니다.
>
> Lambda는 S3에 올라간 코드를 불러와서 실행됩니다.
>
> API는 해당 Lambda에 연결됩니다.

- [Documents](https://serverless.com/framework/docs/providers/aws/)
- [QuickStart](https://serverless.com/framework/docs/providers/aws/guide/quick-start/)



## 3. Serverless Framework 구성하기

1. Serverless Framework 설치하기 
    `npm i -g serverless` or `yarn global add serverless`

2. Serverless Framework template 사용하기 [#](a857dbcedddc1f8c79efc23e30ae0fbe052f737e)
    `serverless create --template aws-nodejs --name MyPortfolio`

    > **serverless의 약자로 sls를 쓸수 있어요!!**

3. `./serverless.yml`파일에서 `provider.runtime`의 노드 버전을 `nodejs6.10` -> `nodejs8.10`로 변경해줍니다. [#](43955f19bf5912ea2dc8b74409d86b53e02e0789)

4. 26번째 줄 `provider.region: us-east-1`에 주석을 풀고 region을 `us-east-1`(버지니아주)에서 `ap-northeast-2`(서울)으로 바꿔줍니다. [#](e217bfd2a469e048f272c45335b8c4e4e12ff72f)

5. AWS 계정을 등록합니다. 아래의 1, 2 방법 중 하나를 선택적으로 하시면 됩니다. (김예본님 감사합니다) [#](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
    1. serverless config: `serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
    2. aws-cli: `aws configure`
    > AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE \
    > AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
    > Default region name [None]: us-west-2 \
    > Default output format [None]: ENTER

    > **AWS credential을 모른다면?**(김예본님, 김예은님 감사합니다)
    > ![image-3.1](./assets/images/image-3.1.png)
    > ![image-3.2](./assets/images/image-3.2.png)
    > ![image-3.3](./assets/images/image-3.3.png)
    > ![image-3.4](./assets/images/image-3.4.png)
6. 배포를 해봅시다. `sls deploy [-v] [--aws-profile <name>]` ([]는 선택 옵션입니다) (김예은님 감사합니다)

    > --verbose / -v ..................... Show all stack events during deployment(배포 과정 자세히 보기)
    >
    > --aws-profile은 AWS credential이 여러개여서 관리되는 계정으로 배포할때 옵션으로 주세요.
    > 혹은 provider.profile에 credential name을 적어주셔도 됩니다. [참고](https://serverless.com/framework/docs/providers/aws/guide/credentials#setup-with-the-aws-cli)

    ![image-4](./assets/images/image-4.png)

    ![image-5](./assets/images/image-5.png)

    ![image-6](./assets/images/image-6.png)

7. 함수를 실행해볼까요? `sls invoke -f hello`

    > {\
    > ​    "statusCode": 200,\
    > ​    "body": "{\"message\":\"Go Serverless v1.0! Your function executed successfully!\",\"input\":{}}"\
    > }


## 4. package.json, serverless-offline 구성하기
> package.json이란? 간단히 설명하면 npm 관리를 위해 사용

> serverless-offline이란? serverless 플러그인 중 하나로 로컬에서 동일한 환경으로 실행 가능하도록 도와줍니다.
1. `npm init` or `yarn init`
2. package.json에 명령 등록
    ```json
    // pakcage.json
    {
        ...
        "scripts": {
            "start": "sls offline --stage=local",
            "deploy": "sls deploy",
            "remove": "sls remove"
        }
    }
    ```
3. [serverless-offline](https://github.com/dherault/serverless-offline): `npm i serverless-offline --only=dev` or `yarn add serverless-offline --dev`
4. serverless.yml에 serverless-offline 추가하고 API Gateway 추가하기
    ```yml
    # serverless.yml
    plugins:
      - serverless-offline

    provider:
      ...
      environment:
        STAGE: ${self:provider.stage}

    functions:
      hello:
        ...
        events:
          - http:
              path: /
              method: ANY
              cors: true
          - http:
              path: /{proxy+}
              method: ANY
              cors: true
    ```

## 5. Express.js를 Lambda에 올리기
1. express 코드를 작성하기 전에 받아야하는 라이브러리들이 있습니다.
    `npm i express serverless-http` or `yarn add express serverless-http`
    1. express
    2. [serverless-http](https://github.com/dougmoscrop/serverless-http) or [aws-serverless-express](https://github.com/awslabs/aws-serverless-express)
        > lambda handler를 통해 들어온 event 파라매터를 express 같은 web framework에 잘 전달해주기 위한 라이브러리입니다.

        > 여기서는 가볍게 사용할 수 있는 serverless-http를 사용하겠습니다.

2. express 코드를 작성해봅시다.
    ```javascript
    // app.js
    const express = require('express')

    const app = express()

    app.get('/', (req, res) => res.send('Ok! Hello world!'))

    module.exports = app
    ```
3. express에 lambda 이벤트를 전달해주는 라이브러리를 연결해줍니다.
    ```javascript
    // handler.js
    'use strict';
    const serverless = require('serverless-http')
    const app = require('./app')

    module.exports.hello = serverless(app)
    ```
4. 잘 되는지 확인해봅시다!
    1. `npm run start` or `yarn start`
    2. 인터넷 브라우저에서 http://localhost:3000
    > Ok! Hello world!

## 6. Single Page Portfolio
1. 메인 페이지 만들기 [`./index.html`](https://gist.github.com/yoonhoGo/bcd7731762d650f27b014943b83ea61e)
2. 메인 페이지 서빙하기
    ```javascript
    // app.js
    const express = require('express')

    const app = express()

    app.use('/static', (req, res) => {
        const staticURI = 'https://raw.githubusercontent.com/yoonhoGo/serverless-spa-portfolio/master/static'
        res.redirect(`${staticURI}${req.path}`)
    })

    app.get('/', (req, res) => {
        res.type('html').sendFile(__dirname + '/index.html')
    })

    module.exports = app
    ```

## 7. API 만들기 [#](https://gist.github.com/yoonhoGo/8d7e914ba558375642e311ff723e5732)
1. 두가지 방법
    1. 하나의 express 안에서 여러개의 endpoint 만들기
    2. **API Gateway에서 endpoint 별로 나뉘어 복수의 express 만들기**
2. 이름 바꾸기: `handler.js` -> `webHandler.js` / `app.js` -> `web.js`
3. 새로운 파일: `apiHandler.js`, `api.js`
4. `serverless.yml`에서 `functions` 수정, `resource` 추가


## 8. 테스트
1. `npm run start` or `yarn start`로 테스트
2. `npm run deploy` or `yarn deploy`로 develop 배포

## 9. 프로젝트 삭제
> (허진호님 감사합니다)

Q. 혹여라도 요금을 절약해야 한다면? \
A. 다음 명령어를 실행시켜 줍니다. \
`sls remove`, `npm run remove` or `yarn run remove`

---

## 결론
더 해보면 좋을 것들
* [ ] Typescript
* [ ] Rendering Solutions
    * express render
    * Nuxt.js 같은 Front-end Framwork
* [ ] RESTful API/Graphql
* [ ] S3에 static 파일 배포 자동화
* [ ] CI 배포 자동화
    * Circle CI
    * Travis CI
    * Jenkins
    * ...(너무 많...)
* [ ] AWS Custom Domain
