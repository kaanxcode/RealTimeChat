/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/groups` | `/_sitemap` | `/groups` | `/login` | `/modals/add-users` | `/modals/create-group` | `/modals/forgot-pass` | `/modals/group-info` | `/register` | `/stack` | `/stack/chat-room` | `/stack/group-room` | `/stack/profile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
