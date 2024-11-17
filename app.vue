<script setup lang="ts">
import { createRestAPIClient } from 'masto';

import 'vue3-carousel/dist/carousel.css'
import 'primeicons/primeicons.css'


const code = decodeURIComponent(
  (window.location.search.match(/code=([^&]+)/) || [, ''])[1],
);

const DEFAULT_INSTANCE = 'pixelfed.social';
const apis = {};

const accountApis = {};
window.__ACCOUNT_APIS__ = accountApis;

const initClient = async ({ instance, accessToken }) => {
  if (/^https?:\/\//.test(instance)) {
    instance = instance
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  }
  const url = instance ? `https://${instance}` : `https://${DEFAULT_INSTANCE}`;


  const masto = createRestAPIClient({
    url,
    accessToken, // Can be null
    timeout: 30_000, // Unfortunatly this is global instead of per-request
  });

  const client = {
    masto,
    instance,
    accessToken,
  };
  apis[instance] = client;
  if (!accountApis[instance]) accountApis[instance] = {};
  if (accessToken) accountApis[instance][accessToken] = client;

  return client;
}

const getAccessToken = async ({
  instanceURL,
  client_id,
  client_secret,
  code,
}) => {
  const params = new URLSearchParams({
    client_id,
    client_secret,
    redirect_uri: location.origin + location.pathname,
    grant_type: 'authorization_code',
    code,
    scope: SCOPES,
  });
  const tokenResponse = await fetch(`https://${instanceURL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const tokenJSON = await tokenResponse.json();
  console.log({ tokenJSON });
  return tokenJSON;
}

if (code) {
  console.log({ code });
  // Clear the code from the URL
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname || '/',
  );

  const clientID = sessionStorage.getItem('clientID');
  const clientSecret = sessionStorage.getItem('clientSecret');
  const vapidKey = sessionStorage.getItem('vapidKey');

  const instanceURL = 'pixelfed.social';
  const { access_token: accessToken } = await getAccessToken({
    instanceURL,
    client_id: clientID,
    client_secret: clientSecret,
    code,
  });

  const client = initClient({ instance: instanceURL, accessToken });
  sessionStorage.setItem('accessToken', accessToken);
}

if (sessionStorage.getItem('accessToken') === null && window.location.pathname !== '/login') {
  window.location.href = '/login';
}

</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
