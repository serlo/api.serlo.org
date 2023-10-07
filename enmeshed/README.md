## Local testing with enmeshed

### Setup

In order to test enmeshed locally you need to copy [`config-dist.json`](./config-dist.json) to `config.json` and update `clientId` and `clientSecret` in the copied configuration:

```sh
cp enmeshed/config-dist.json enmeshed/config.json
```

Set the `transportLibrary.baseUrl`, `platformClientId` and `platformClientSecret` to the values you've received from the Integration team.

### Starting / stopping enmeshed locally

In order to start enmeshed locally you can run the command `yarn start:enmeshed`. To tear down the connector run `yarn stop:enmeshed`.

### Testing

To test the enmeshed endpoints you can use the script [`fetch.sh`](./fetch.sh). Run `./enmeshed/fetch.sh help` to see the available commands.
