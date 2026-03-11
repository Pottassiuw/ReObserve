#!/bin/bash
set -e

ACR_NAME="reobserve"
RESOURCE_GROUP="ReObserve"
CONTAINER_APP="reobserve-client"
IMAGE="reobserve.azurecr.io/reobserve-client:latest"

echo "🔨 Buildando imagem do client..."
docker build --no-cache -t $IMAGE .

echo "📤 Fazendo push para o ACR..."
docker push $IMAGE

echo "🚀 Atualizando Container App..."
az containerapp update \
  --name $CONTAINER_APP \
  --resource-group $RESOURCE_GROUP \
  --image $IMAGE

echo "✅ Deploy do client concluído!"
echo "🌐 URL: https://reobserve-client.happyisland-773d92bd.eastus.azurecontainerapps.io"
