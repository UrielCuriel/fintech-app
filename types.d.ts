/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'js-cookie' {
  export interface CookieAttributes {
    path?: string
    domain?: string
    expires?: Date | number | string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
    [key: string]: string | number | boolean | undefined
  }

  export interface CookieConverter {
    write: (value: unknown, name: string) => string
    read: (value: string, name: string) => unknown
  }

  export interface CookieManager {
    set(
      name: string,
      value: unknown,
      attributes?: CookieAttributes
    ): string | void
    get(name: string): string | undefined
    remove(name: string, attributes?: CookieAttributes): void
    withAttributes(attributes: CookieAttributes): CookieManager
    withConverter(converter: CookieConverter): CookieManager
  }

  export function init(
    converter: CookieConverter,
    defaultAttributes: CookieAttributes
  ): CookieManager

  const defaultInstance: CookieManager
  export default defaultInstance
}