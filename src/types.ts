export interface SinglePlugin {
  name: string
  dataType: string // string:lorem-zh
  getterFn: (getter: string) => any
}