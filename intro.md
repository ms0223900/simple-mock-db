# Simple Mock DB
簡單就能生成API假資料，支援參數和巢狀解析，可擴充plugin自訂解析與資料的生成方法。

## MockServer
封裝好的mock server，最基本且必要的啟動mock server的方法。
```
// express server
const server = jsonServer.create();
server.use(cors({
  origin: '*',
}));

const mockServer = new MockServer({
  routeList: routes, // SingleRoute[], 必填
  plugins: basicPlugins, // 可選
  getterResolvers: BasicGetterResolvers // 可選
});

mockServer  
  .addPlugin(LoremZhPlugin)
  .addPlugin(SimpleEmailGenerator)
  .addPlugin(DateGenerator)
  .serve(); // serve the server
```

## server.settings.ts
最主要的server設定，在這邊填入你的routes設定，並export 給mock server使用(強烈建議，可以照自己的寫法任意撰寫，總之要在MockServer那邊加上routeList)。

詳見SingleRoute的說明，基本使用mock db生成假資料，只要設定此檔案即可。

### SingleRoute
```
interface SingleRoute {
  path: '/abc' // 
  pathName: 'ABC' //
  method?: 'get' // 
  
  reqDataHandlers?: ((req: Request, dataList: Data[]) => Data)[] 
  // 主要作為params, query的過濾條件擴充使用
  // 將資料陣列做處理，會遍歷每個data handler。

  schema?: Record<string, string[]>
  // 最主要生成mock api的方法，就是使用schema來生成
  // 格式如下，可以單單指定dataType即可
  // [欄位名稱]: [
    dataType:specificType, // dataType 必填
    type.condition:param // getter 選填
  ]
  // 下面有詳細的範例
}
```

### reqDataHandlers
用於擴充過濾req(像是params, query等)使用，因為資料會遍歷每個handler，要注意handler過濾的順序。
```
// 例如過濾同年份的資料 
const yearMonthReqDataListHandler = (req: any, dataList: any[]) => {
  return dataList.filter(d => String(d.year) === String(req.params.year))
}
```

### schema
schema的寫法很重要，會對應到負責解析的plugin。
只要記得schema對應解析出來的參數名稱即可，主要解析寫在getterResolver和plugin。
```
const schema = {
  id: [
    'number:seq', 
    // dataType:specificType
  ],
  title: [
    'string:lorem-zh',
    'get.limit:20-100', 
    // getter字串
    // 照這樣解析 type.condition:param
  ]
}
```

['object:{PathName}', ]: 如果object或array接的 specificType是pathName(PascalCase)，默認會直接解析符合該pathName的API，是個相當便利的功能。
```
{
  // ...
  schema: {
    createdAt: [
      'object:Date',
      'get',
    ]
  }
}

// 可以直接取得"一個"Date的資料
const data = [{
  //...,
  createdAt: {
    year: 2022,
    month: 8,
    // ...
  }
}]

```

### getterResolvers
負責統一處理getter的函式，主要使用於plugin中，因為不同的dataType可能會用到同樣的getterResolver，因此將其抽離出來統一管理與擴充，以方便在plugin中組合運用。

schema中的getter字串會在resover被解析成type, condition和param，getterResolver可以從參數中直接使用解析過後的值。

例如以下範例

```
const DateGetterResolver: SingleGetterResolver = {
  name: 'dateGetter', // 在plugin使用時看這個，而非檔名
  resolveByGetterInput: ({
    type, condition, param // 解析過的getter
  }) => {
    return (idx = 0) => {
      const now = new Date();
      if(type === 'get') {
        if(condition === 'ascByIdx') {
          const devided = param.split('/');
          const ascNum = devided[1];
          
          if(!Number.isNaN(Number(ascNum))) {
            const ascDate = Math.floor(idx / Number(ascNum));
            now.setTime(now.getTime() + ascDate * oneDayMs);
          }
        }
      }

      return now.toLocaleDateString();
    };
  }
}
```
以上的DateGetterResolver會取得隨index增加的日期假資料。

### plugins
真正處理與解析schema的就是plugin，會從schema取得dataType和getter(還有index)生成API假資料。

以下的plugin對應到 ['string:date', 'get.ascByIdx:idx/4'] 的schema
```
// 搭配剛剛的DateGetterResolver使用
const DateGenerator: SinglePlugin = {
  name: 'DateGenerator',
  dataType: DataType.string,
  specificType: 'date',
  getterFn: (
    getterResolvers, // 可以取得所有的getterResolvers
    getter, // 已經解析過的getter，可以直接傳給getterResolver
    idx // 從resolver來的
  ) => {
    if(getterResolvers['dateGetter']) {
      const res = (getterResolvers['dateGetter'] as SingleGetterResolver).resolveByGetterInput(getter)(idx);
      return res;
    }
    return new Date().toLocaleDateString();
  }
};

export default DateGenerator;

```

### 擴充getterResolvers 和 plugins
如果有自訂解析schema的需求，例如['number:bigInt', 'get']，則可以在mockServer用addPlugin和addGetterResolver，詳細的plugin和getterResolver可以參照type型別或是其他內建的函式。

```
mockServer
  .addPlugin(YourPlugin)
  .addGetterResolver(YourGetterResolver);

mockServer.serve();
```

### 靜態資料
也可以不使用schema生成假資料，如果有既有的假資料，也可以將檔案放在src/static資料夾，並將檔名命名為{path}.static.ts。
資料可以是function生成或完全靜態資料，並用export default將其輸出。

```
// user.static.ts
const makeMockUserListData = () => {
  //...
}

export default makeMockUserListData;
```

### resolver
無論是從schema還是靜態資料取得，mock server都會將其處理成有get() 方法的resolver，每一個資料都會變成一個resolver，像上面提到的Date, User等等，都會變成以resolver的形式存在於mock server中。
"每一個"resovler都可以取得其他的resolver，因此可以進行巢狀解析，例如User使用到object:Date，Profile使用到array:User，則mock server會遞迴取值，將資料傳給Profile。

```
// profile的schema
{
  name: 'profile/:id?',
  pathName: 'Profile',
  schema: {
    sharedUserList: [
      'array:User',
      'get.limit:2-5'
    ]
  }
}

// 生成假資料
const data = [{
  sharedUserList: [
    {
      id: 0,
      createdAt: {
        // date的資料
      }
    },
    // ...
  ]
}]

```

---

## 其他

### /:id
如果path自帶/:id，則默認number:seq的dataType的欄位，會從參數的id取得值，並且只取得一個值，就像真實的API一樣。
```
GET /abc/123

const data = [{
  id: '123',
  // ...
}]
```

### 檢查參數
會自動檢查參數，如果參數不足就會回傳錯誤(404)response。
