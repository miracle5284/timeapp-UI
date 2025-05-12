@description('Name of the Web App')
param appServiceName string

@description('Name of the App Service Plan')
param appServicePlan string

@description('Whether to use an existing App Service Plan')
@allowed([true, false])
param useExistingPlan bool = false

@description('Location for new resources (ignored if using existing plan)')
param location string = resourceGroup().location

@description('SKU for new App Service Plan (e.g., F1, B1)')
param planSku string = 'F1'

@description('Full image name (e.g., registry.azurecr.io/app:tag)')
param imageName string

@description('ACR login server URL (e.g., https://registry.azurecr.io)')
param registryUrl string

@description('ACR username')
param acrUsername string

@description('ACR password')
param acrPassword string

// Optional reference to an existing plan
resource existingPlan 'Microsoft.Web/serverfarms@2022-03-01' existing = if (useExistingPlan) {
  name: appServicePlan
}

// Create new plan only if not reusing one
resource newPlan 'Microsoft.Web/serverfarms@2022-03-01' = if (!useExistingPlan) {
  name: appServicePlan
  location: location
  sku: {
    name: planSku
    tier: planSku == 'F1' ? 'Free' : 'Basic' // adjust as needed
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: useExistingPlan ? existingPlan.id : newPlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|' + imageName
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
