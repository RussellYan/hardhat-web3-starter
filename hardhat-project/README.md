# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat help
```

项目创建、部署
```shell
// 1、创建项目
mkdir hardhat-project
cd hardhat-project
npx hardhat init
// 2、测试
npx hardhat node
npm run dev (新建窗口 本机节点运行)
// 3、部署合约
// alchemy申请自动部署api, 在hardhat-config.js文件添加配置信息
npm run deploy
```
