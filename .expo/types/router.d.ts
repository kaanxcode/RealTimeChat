/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/contacts` | `/_sitemap` | `/contacts` | `/login` | `/modals/forgot-pass` | `/modals/image-pick-and-upload` | `/modals/search` | `/register` | `/stack` | `/stack/profile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
