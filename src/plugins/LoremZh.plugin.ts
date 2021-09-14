import { RandomValGetterResolverOutput } from "@/getterResolvers/RandomValGetterResolver";
import { DataType, SingleGetterResolver, SinglePlugin } from "@/types";
import getRandomNumberByRange from "@/utils/getRandomNumberByRange";
import SchemaParser from "@/utils/SchemaParser";

const loremZh = `
題讀什是力今高頭法息外直住。

馬正在子海氣，是有我帶……研代會地傳水現！力蘭了非飛義對學坐一可學國出看，眾學給沒中士半可興生？聯省常人，業的亞節也音中就演不會的熱上才麼思青對廣結表劇：長每樂不壓呢物。

縣這線進？將大車心登。

的發告像電實神容，質形我嗎知製。夠治能外跑送黃時過紅木許死北種方之自件顯軍基即利下：現長解心我際之跑得根問，命者你開新到不，父不考教說上轉望色資件銷報從業上失個可，他前共集我精我兩客們玩家基發們增了影節近香上手增又大英的醫家從節，術星發小養好部畫。的國歷不隊力成，好野北小過也性見究變作與星蘭二子談散生叫學麼裡影賣孩兒，東觀師、共理如開什電去？此可海法爭的性原前速王，難都人代生，到時電，民以所因房一見下我十集此方外精，是新一無想長、是水變積？的不般生出你電下時一歡滿沒展些人期最這機活計息步陽居們，人立顧象代管花作選海鄉一，讓自院權展民長快子化獎完認行種要父選容在在人新理。辦小唱書！資進們，課只裡馬據無事內教臉品至從度過類向不線光際。中高和的戰己愛達記識息們：會發人！聲來卻專高的血今子二她了房我衣沒過立，我國作人面：外之我專毛性人公幾情突司深，笑人這為自系流華……草同主安達花度用所當！感性故重世對把還上：岸數腦南查，引同日味起場數要的時進投金當它字選用遠不工事。可上水足後人仍蘭。放在前戰境上好據育言國的出南絕了方已教足親可！
`;

const LoremZhPlugin: SinglePlugin = {
  name: 'LoremZh',
  dataType: DataType.string,
  specificType: 'lorem-zh',
  getterFn: (getterResolvers, getter) => {
    const randomGetterResolver = getterResolvers['randomGetter'] as SingleGetterResolver;
    const resolved = randomGetterResolver.resolveByGetterInput(getter)(loremZh.trim().length) as RandomValGetterResolverOutput;
    
    if(resolved) {
      const {
        startIdx, endIdx,
      } = resolved;
      return loremZh.trim().slice(startIdx, endIdx);
    }
    return loremZh.slice(0, 20);
  }
};

export default LoremZhPlugin;