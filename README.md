# <img src="https://docs.goshippo.com/images/Logo.png" width="30" alt="Shippo logo"> Shippo Typescript SDK demo

* Collect shipping rates offered by the carriers configured in your Shippo account
* Use a selected rate to request a label
* Download the label for use in shipping your package

## Running the code

Before you run this code, you will need to have performed the below steps:
1. Install a recent version of Python 3 (this sample was written using 3.10)
2. [Create a Shippo Account](https://apps.goshippo.com/join)
3. [Generate a Shippo API Token](https://support.goshippo.com/hc/en-us/articles/360026412791-Managing-Your-API-Tokens-in-Shippo#:~:text=Generate%20a%20Token,-To%20generate%20a&text=To%20generate%20a%20Test%20Token,and%20purchase%20test%20shipping%20labels.). Since this is a sample app, it is recommended that you generate a test token rather than a production (i.e., paid) token.
4. Update the code in shippo-python-sdk-demo.py to use your token
``` typescript
  // Put your real token below...
  const sdk: Shippo = new Shippo({ apiKeyHeader:"shippo_test_0123456789abcdef0123456789abcdef01234567" });
```
5. Install pre-requisites
```shell
npm install
```
6. Run the sample!
```shell
npm start
```
