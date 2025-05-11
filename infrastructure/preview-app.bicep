param appServiceName string
param appServicePlan string
param imageName string
param registryUrl string
param acrUsername string
@secure()
param acrPassword string

resource plan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlan
  location: resourceGroup().location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource app 'Microsoft.Web/sites@2023-01-01' = {
  name: appServiceName
  location: resourceGroup().location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${imageName}'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: registryUrl
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acrUsername
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acrPassword
        }
      ]
    }
    httpsOnly: true
  }
}
