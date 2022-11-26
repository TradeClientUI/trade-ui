<p align="center">
<a href="https://ctradeex.io/"><img src="docs/images/ctradeex-icon.jpg" alt="banner" width="200px"></a>
</p>

<p align="center">
<b> CtradeExchange <i>digital currency, foreign exchange, stock trading , spot matching</i></b>
</p>

<p align=center>

<a href="https://twitter.com/intent/follow?screen_name=KubeSphere">
  <img src="https://img.shields.io/twitter/follow/KubeSphere?style=social" alt="follow on Twitter">
</a>
<a href="https://join.slack.com/t/kubesphere/shared_invite/enQtNTE3MDIxNzUxNzQ0LTZkNTdkYWNiYTVkMTM5ZThhODY1MjAyZmVlYWEwZmQ3ODQ1NmM1MGVkNWEzZTRhNzk0MzM5MmY4NDc3ZWVhMjE">
  <img src="https://img.shields.io/badge/Slack-600%2B-blueviolet?logo=slack&amp;logoColor=white">
</a>

<a href="https://www.youtube.com/channel/UCyTdUQUYjf7XLjxECx63Hpw">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCyTdUQUYjf7XLjxECx63Hpw?style=social">
</a>

</p>


----

# trade-system
> English | [中文](README_zh.md)

Open source digital currency, foreign exchange, stock trading system, support a variety of trading methods, spot matching, contract full position, contract isolated position, leveraged spot, stock, foreign exchange, etc.


# List of functions:

- Support multiple trading strategies: contract, leverage, spot, and risk hedging (single-shot trading mode)
- Rich open interfaces, convenient and fast access to mainstream payment systems and rapid development of business promotion activities
- Multiple client support (H5, PC, APP), rich market icons, multiple indicators
- Powerful background management, support the main white label mode, and realize the simultaneous development of multiple business modes
- Flexible parameter configuration capabilities, various transaction parameter configurations take effect in real time
- Stable market structure, supporting mutual backup of multiple sources (coinapi, binance, ib, ig, longbridge, etc.)


# Features:
- Client
<table>
  <tr>
     <td><img src="docs/images/client/en/client-1.png"/></td>
     <td><img src="docs/images/client/en/client-2.png"/></td>
	 <td><img src="docs/images/client/en/client-3.png"/></td>
     <td><img src="docs/images/client/en/client-4.png"/></td>
  </tr>
  <tr>
     <td><img src="docs/images/client/en/client-5.png"/></td>
     <td><img src="docs/images/client/en/client-6.png"/></td>
	 <td><img src="docs/images/client/en/client-7.png"/></td>
     <td><img src="docs/images/client/en/client-8.png"/></td>
  </tr>
  <tr>
     <td><img src="docs/images/client/en/client-9.png"/></td>
     <td></td>
	 <td></td>
     <td></td>
  </tr>
</table>

- Management background

<table>
  <tr>
     <td><img src="docs/images/admin/en/admin-1.png"/></td>
     <td><img src="docs/images/admin/en/admin-2.png"/></td>
  </tr>
  <tr>
	 <td><img src="docs/images/admin/en/admin-3.png"/></td>
     <td><img src="docs/images/admin/en/admin-4.png"/></td>
  </tr>
  <tr>
     <td><img src="docs/images/admin/en/admin-5.png"/></td>
     <td><img src="docs/images/admin/en/admin-6.png"/></td>
  </tr>
  <tr>
	 <td><img src="docs/images/admin/en/admin-7.png"/></td>
     <td><img src="docs/images/admin/en/admin-8.png"/></td>
  </tr>
  <tr>
     <td><img src="docs/images/admin/en/admin-9.png"/></td>
     <td></td>
  </tr>
</table>

# Main technique:

## Backstage:
- Development framework: Spring Boot 2.7
- Microservice Framework: Spring Cloud 2021
- Security framework: Spring Security + Spring OAuth 2.0
- Task scheduling: Quartz, Saturn
- Database support: MySQL, PostgreSQL, MongoDB, TiDB, influxDB
- Persistence layer framework: MyBatis && MyBatis Plus
- Database connection pool: Druid
- Service registration and discovery: Nacos
- Client load balancing: Spring Cloud Loadbalancer
- Fuse component: Sentinel
- Gateway component: Spring Cloud Gateway
- Log management: Logback
- Running container: Undertow
- Distributed transactions: LCN, Seata
- Workflow: Activiti 5.22
- Data synchronization: Canal
- Message middleware: Kafka, RocketMQ
- In-memory database: Ignite
- Matching engine: Exchange-core
- Lock-free queue: LMAX Disruptor
- Risk control rule engine: Drools
- Transaction communication protocol Netty + Dubbo
- Market communication protocol TCP + PB

## front end:
- JS framework: Vue, Avue, nodejs
- CSS framework: sass
- Component library: ElementUI
- Package build tool: Webpack
- Client Uniapp


# Service definition:

<details>
  <summary><b>🕸 Trade Api/Trading Interface</b></summary>
  After receiving the request, perform static risk control and pre-buy orders based on configuration parameters such as product, account, and authority. After the delayed transaction order is sent to PBO successfully, it will be returned to the customer, and the price adjustment order will be bound to the parameters used for settlement after passing the static risk control Put the request in the correct MQ. If it is a read-only query request, directly request clearing.
  </details>

<details>
  <summary><b>🔗PreBuried Order(PBO)/Pre-Buried Order</b></summary>
  Provide an interface to query the user's pending order. If the price or time is triggered, it will request back to the Trade Api to continue at the market price. There is no need to freeze in this module, generate pre-paid orders, maintain order status, and generate delayed transaction orders to maintain order status

  </details>

<details>
  <summary><b>🤖 Trade/Trading Services</b></summary>
  It is processed one by one according to the request order of a single user. There are only market orders here. First, the price risk control of the real-time market is followed, and then the freeze is performed, and the freeze is 20% more (configurable). After the freeze is successful, an order is generated, and the confirmed order is sent to clearing. After clearing is received, it returns to the client successfully. All positions are closed first, and the position is frozen. If the freezing is successful, the client will be returned successfully. When receiving a liquidation request, you need to cancel the prepaid order and delayed order.
  </details>

<details>
  <summary><b>🔎 Order/order service</b></summary>
  Insert a new order, update the order, and provide an order list query interface.
  </details>

<details>
  <summary><b>🧩 Clearing/clearing settlement service</b></summary>
  Execute matching orders, generate positions, provide floating profit and loss interface (real-time calculation), provide account basic information interface (Account), provide account real-time information interface (real-time calculation + Account), deposit and withdrawal request processing (fund management service direct call) , Various types of forced liquidation, overnight interest collection, position change account change notification (to be discussed), fund freezing interface, and position freezing interface.
  </details>

<details>
  <summary><b>💻 Postion/position service</b></summary>
  Insert new position, update position, broadcast position data, position list interface, freeze position interface</a>.
  </details>

<details>
  <summary><b>💡Account/Account Services</b></summary>
  Bookkeeping, reconciliation, account opening, account cancellation, freezing, account basic information interface</a>.
  </details>

<details>
  <summary><b>📊 Real Time Calculate(RTC)/Real Time Calculation Service</b></summary>
  Margin calculation, send orders to CFD Trade for liquidation, take profit and stop loss to close positions, and send orders to CFD Trade, providing floating profit and loss interface
  </details>

<details>
  <summary><b>🗃 Settlement/Product interest settlement service</b></summary>
  When the product expires, send an order to Trade, and when the settlement time arrives, send an order to clearing
  </details>

<details>
  <summary><b>🏘 Config Service/parameter configuration service</b></summary>
  Configure product data, account group data, be responsible for persistence, and provide broadcast synchronization update of configuration information, etc. Other services that need to use configuration information subscribe to this service. The design diagram is in another picture "Basic Data Design Diagram"

  </details>

<details>
  <summary><b>🧠Customer Service/Account Opening KYC Service</b></summary>
  Customer account opening, authorization verification, KYC certification configuration, and KYC data core services; provide KYC certification parameter configuration and customer data review functions; and provide basic customer data query and data export functions.
  </details>
  

<details>
  <summary><b>🔎 Fund Service/Deposit and withdrawal service</b></summary>
  Core services such as customer fund inquiry, recharge and deposit, and withdrawal proposal; responsible for payment gateway access, configuration of different payment methods, and basic payment parameter settings; at the same time, it provides functions such as inquiry of deposit and withdrawal records and data export.
  </details>

<details>
  <summary><b>🧩 Meaasge Service/Message Center Service</b></summary>
  Responsible for the external sending interface of internal messages, SMS, Email and other messages
  </details>

<details>
  <summary><b>💻Admin Service/Platform Management Service</b></summary>
  SAAS background management, users set product permissions and game configuration, SMS, Email, payment and other related basic configuration functions; provide white label companies, and assign white label permission levels; white labels can configure their own product parameters and manage their own customers Data, such as data and transaction processes.
  </details>



# Overall structure:

![design diagram](docs/images/design/en/1.png)



# Core process:
Flow chart, Supplemental English version


## Changelog
Detailed changes for each release are documented in the [release notes](CHANGELOG.md).