<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import { useAuthenticationStore } from '~/stores/authentication-store';

const store = useAuthenticationStore();

const getAuthorizationURL = async ({ instanceURL, client_id }) => {
  const authorizationParams = new URLSearchParams({
    client_id,
    scope: SCOPES,
    redirect_uri: location.origin + location.pathname,
    // redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    response_type: 'code',
  });
  const authorizationURL = `https://${instanceURL}/oauth/authorize?${authorizationParams.toString()}`;
  return authorizationURL;
}

const instanceURL = 'pixelfed.social';

const tryLogin = async (event: Event) => {
  const { client_id, client_secret, vapid_key } = await authLogin(event);
  console.log({ client_id, client_secret, vapid_key });

  if (client_id && client_secret) {
    sessionStorage.setItem('clientID', client_id);
    sessionStorage.setItem('clientSecret', client_secret);
    sessionStorage.setItem('vapidKey', vapid_key);

    location.href = await getAuthorizationURL({
      instanceURL,
      client_id,
    });
  } else {
    alert('Failed to register application');
  }
}

const authLogin = async (event: Event) => {
  const registrationParams = new URLSearchParams({
    client_name: 'QuinJet',
    redirect_uris: location.origin + location.pathname,
    scopes: SCOPES,
    website: "https://quinjet.vercel.app",
  });

  const registrationResponse = await fetch(
    `https://${instanceURL}/api/v1/apps`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: registrationParams.toString(),
    },
  );
  const registrationJSON = await registrationResponse.json();
  return registrationJSON;
}

if (!!window.__ACCOUNT_APIS__[instanceURL]) {
  console.log('Already logged in');
  location.href = '/gallery';
}
</script>

<template>
  <div>
    <button @click="tryLogin">instance login</button>
  </div>

</template>
