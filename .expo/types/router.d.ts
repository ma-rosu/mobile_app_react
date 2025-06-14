/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/reminders` | `/reminders`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/videoplayer` | `/videoplayer`; params?: Router.UnknownInputParams; } | { pathname: `/movies/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/reminders` | `/reminders`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/videoplayer` | `/videoplayer`; params?: Router.UnknownOutputParams; } | { pathname: `/movies/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/reminders${`?${string}` | `#${string}` | ''}` | `/reminders${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/videoplayer${`?${string}` | `#${string}` | ''}` | `/videoplayer${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/reminders` | `/reminders`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/videoplayer` | `/videoplayer`; params?: Router.UnknownInputParams; } | `/movies/${Router.SingleRoutePart<T>}` | { pathname: `/movies/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
