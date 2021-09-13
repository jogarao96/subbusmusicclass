import 'promise-polyfill/src/polyfill';
import ReactDOM from 'react-dom';
import { App } from '@/infra/monolithic/app';
import { isElectron } from '@/infra/utils';
import { EduManager } from 'aa-agora-edu-core-lb';
import { eduSDKApi } from 'aa-agora-edu-core-lb';
import { AgoraEduSDK } from './infra/api';
import { GlobalStorage } from '@/infra/utils';

//@ts-ignore
import { stopReportingRuntimeErrors } from 'react-error-overlay';

// NOTE: 改方法仅在开发环境生效，所以在开发环境禁止。
if (process.env.NODE_ENV === 'development') {
  stopReportingRuntimeErrors(); // disables error overlays
}

GlobalStorage.useSessionStorage();
//@ts-ignore
window.AgoraEduSDK = AgoraEduSDK;

if (isElectron) {
  EduManager.useElectron();
}

eduSDKApi.updateConfig({
  sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
  appId: `${REACT_APP_AGORA_APP_ID}`,
});

ReactDOM.render(
  <App
    appConfig={{
      agoraAppId: `${REACT_APP_AGORA_APP_ID}`,
      agoraNetlessAppId: `${REACT_APP_NETLESS_APP_ID}`,
      sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
      enableLog: true,
      rtmToken: '',
      rtmUid: '',
      courseWareList: [],
      recordUrl: '',
    }}
  />,
  document.getElementById('root'),
);
