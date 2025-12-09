export enum OSType {
  IOS = 'iOS',
  ANDROID = 'Android',
  WINDOWS_PHONE = 'Windows Phone',
  UNKNOWN = 'Unknown'
}

export interface AppLinks {
  ios: string;
  android: string;
  web: string;
}

export interface DeepLinks {
  ios: string;
  android: string;
}

// ストアのURL
export const APP_LINKS: AppLinks = {
  ios: "https://apps.apple.com/jp/app/%E3%82%AB%E3%83%A9%E3%82%AA%E3%82%B1%E9%A4%A8%E5%85%AC%E5%BC%8F%E3%82%A2%E3%83%97%E3%83%AA/id1341634219",
  android: "https://play.google.com/store/apps/details?id=jp.karaokekan.karakan.karakan&hl=ja",
  web: "https://karaokekan.jp/app"
};

// アプリを直接開くためのURLスキーム
// AndroidはIntentスキームを使用し、自動フォールバック機能を利用します
const ANDROID_PACKAGE_ID = "jp.karaokekan.karakan.karakan";
const ANDROID_SCHEME = "karaokekan"; // 一般的な推測値。必要に応じて変更してください
const FALLBACK_URL = encodeURIComponent(APP_LINKS.android);

export const APP_DEEP_LINKS: DeepLinks = {
  // iOS用カスタムスキーム (karaokekan://)
  ios: "jp.karaokekan.karakan://",
  
  // Android用Intent (アプリがあれば起動、なければストアへ自動遷移)
  android: `intent://open#Intent;scheme=${ANDROID_SCHEME};package=${ANDROID_PACKAGE_ID};S.browser_fallback_url=${FALLBACK_URL};end`
};

export const WIFI_SSID = "+karaokekan-wifi";