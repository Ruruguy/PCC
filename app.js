'use strict';
const $=id=>document.getElementById(id);
const core=['傷患監測','急救復甦','通氣給氧','呼吸道管理','鎮靜止痛','理學檢查與診斷','護理與衛生','手術介入','遠距醫療指導','包裹與後送準備'];
// Each risk maps an observed change to a reassessment and team response.
const risks={
 出血:['敷料滲血、脈搏與灌流趨勢','重新評估止血效果，通報持續出血','M 大出血',1],
 呼吸惡化:['呼吸功、胸廓起伏與血氧趨勢','評估氧療需求與呼吸支持，提前聯絡後送','R 呼吸',2],
 氣血胸:['比較雙側呼吸音、胸痛與循環變化','請具資格人員評估胸腔損傷與引流需求','R 呼吸',7],
 休克:['意識、皮膚灌流、血壓及尿量趨勢','通知團隊重新評估失血與復甦反應','C 循環',1],
 神經惡化:['意識、瞳孔與肢體活動的變化','通報新發神經缺損並重新評估後送優先度','H 頭傷與低體溫',8],
 氣道阻塞:['聲音、分泌物與吸氣費力情形','請合格人員重新評估呼吸道與備援方案','A 呼吸道',3],
 感染:['傷口外觀、體溫與全身狀態','評估換藥與感染治療需求','W 傷口',6],
 灌流受損:['比較遠端膚色、溫度、感覺與活動','重評固定與局部壓迫，通報灌流改變','S 固定',5],
 疼痛:['記錄疼痛位置、程度與介入後變化','依醫囑調整止痛計畫並複評呼吸意識','P 疼痛',4],
 代謝異常:['記錄尿量、心律與可取得的電解質結果','聯絡醫療指導評估腎功能與轉送需求','C 循環',8],
 視力惡化:['記錄兩眼視力變化與眼痛','避免眼球受壓並聯絡眼科評估','W 傷口',9],
 污染持續:['確認暴露史、去污狀態與症狀變化','與去污團隊確認防護及後送交接','W 傷口',6],
 管路異常:['核對位置標記、固定、通暢及周邊皮膚','異常時請負責人重新確認位置與功能','W 傷口',6],
 輸血反應:['觀察體溫、皮膚、呼吸與循環變化','疑似反應時停止輸注並立即通知醫療團隊','C 循環',1]
};
const injuries=[
['肢體壓砸傷併開放性骨折','出血 灌流受損','代謝異常 感染'],['胸部鈍挫傷','氣血胸 疼痛','呼吸惡化 休克'],['大面積燒燙傷及吸入性損傷','氣道阻塞 疼痛','休克 感染'],['頭部外傷','神經惡化','氣道阻塞'],['透析中斷併尿毒症','代謝異常','呼吸惡化'],['穿刺性胸傷','氣血胸 出血','休克 呼吸惡化'],['腹部鈍傷或穿刺傷','出血 疼痛','休克 感染'],['骨盆骨折','出血 疼痛','休克'],['脊椎脊髓損傷','神經惡化','呼吸惡化'],['股骨閉鎖性骨折','出血 疼痛','灌流受損'],['截肢或長時間使用止血帶','出血','休克 代謝異常'],['顏面頸部外傷','氣道阻塞 出血','呼吸惡化'],['眼外傷','視力惡化 疼痛','感染'],['爆炸傷','氣血胸 神經惡化','呼吸惡化'],['軟組織撕裂或脫套傷','出血','感染 灌流受損'],['電擊或雷擊傷','代謝異常','灌流受損'],['化學傷','污染持續','呼吸惡化']];
const procedures=[
['胸管引流','確認引流系統固定、管路走向與引流量','管路異常 感染 疼痛'],['氣管內管與機械通氣','交接管深、固定、通氣設定與備援設備','管路異常 呼吸惡化'],['外科呼吸道','交接建立時間、管路固定與通暢','管路異常 出血'],['留置尿管','交接適應症、尿量與集尿袋位置','管路異常 感染'],['筋膜切開','交接術區、敷料與遠端灌流','出血 感染'],['鼻胃管或口胃管','核對位置確認紀錄、固定及引流','管路異常'],['周邊靜脈通路','交接穿刺點、輸注內容及固定狀態','管路異常 感染'],['骨內通路','交接置入時間並觀察局部腫脹','管路異常 灌流受損'],['焦痂切開','比較處置前後灌流或胸廓活動','出血 感染'],['傷口清創與填塞','核對處置部位、填塞物及換藥計畫','出血 感染'],['夾板與骨盆固定','交接固定位置並檢查受壓皮膚','灌流受損 疼痛'],['心包膜穿刺','交接處置反應、循環趨勢與後送需求','休克 出血'],['全血輸注','核對血品紀錄、起迄時間與輸注反應','輸血反應'],['延長給氧','確認裝置、連接、剩餘供氧時間與替代氧源','呼吸惡化']];
const flows=['啟動團隊並指定照護與紀錄負責人','依 MARCH-PAWS 完成初評與必要處置','建立傷情與預期問題清單','記錄生命徵象基準與趨勢','盤點人力、耗材、氧源與電力','安排遠距會診與升級條件','排定護理、複評與輪休時程','定時巡視並依變化修訂計畫','交接處置時間、反應與待辦事項','確認搬運固定、途中資源與接收端'];
const empty=()=>({cases:{},off:{},tasks:{},flow:{},tier:'Basic',sort:'執行頻率'});
let state=empty(),tab=0;try{Object.assign(state,JSON.parse(localStorage.getItem('pcc-training-v1')))}catch{}
const save=()=>{try{localStorage.setItem('pcc-training-v1',JSON.stringify(state))}catch{}};
const checked=v=>v?'checked':'';
const frequencies=['待設定','CONT 持續','Q2h','Q4h','Q6h','Q12h','PRN 需要時','變化時立即複評'];
const all=[...injuries,...procedures];
const workbook='＃EMT教學（20261110）.xlsx';
const slides='TECC、TCCC、PCC/08 NFA TECC_冷區救護 (20250724 V3).pptx';
function citation(label,file){
 if(location.protocol==='file:')return '<a class="source" href="'+file+'">'+label+'</a>';
 return '<span class="source">'+label+'</span>';
}
function note(text,source,file){
 return '<p class="muted">'+text+' '+citation(source,file)+'</p>';
}
const caseNotes={
 '胸部鈍挫傷':note('觀察胸廓起伏時也看腹部是否用力參與呼吸。請學員描述看到的變化，再與前次評估比較。','TECC、TCCC，第 9 列',workbook),
 '穿刺性胸傷':note('若已接受胸部處置，交接時說明處置前後的呼吸變化，讓接手者知道接下來要觀察什麼。','冷區救護，第 13 頁',slides),
 '截肢或長時間使用止血帶':note('接手時核對止血帶完成時間，重新檢查是否仍有效控制出血。','冷區救護，第 7 頁',slides),
 '脊椎脊髓損傷':note('搬運前與可配合的傷患說明如何減少脊椎移動，並確認固定後仍能維持呼吸道通暢。','冷區救護，第 12 頁',slides),
 '周邊靜脈通路':note('把留置針固定與包覆列入搬運演練，交接時指出穿刺位置與固定情形。','災難醫療訓練課程，第 6 列',workbook),
 '氣管內管與機械通氣':note('通氣突然變差時，用 DOPE 向團隊逐項回報管路移位、阻塞、氣胸及設備或供氧異常的可能性。','冷區救護，第 11 頁',slides),
 '延長給氧':note('用現場設備實際辨認氧源、接頭與給氧管路，再討論轉運途中怎麼維持供氧。','災難醫療訓練課程，第 6 列',workbook)
};
const mciSlides='TECC、TCCC、PCC/09 NFA TECC_大量傷患事件應變(20250806 V3).pptx';
const flowNotes={
 0:note('由帶隊者點名確認誰接收傷患、誰負責照護與紀錄、誰管理物資、誰聯絡後送。若一人兼任，先交代搬運時由誰接手觀察。','大量傷患事件應變，第 10 頁',mciSlides),
 1:note('接手時逐項複查前一階段的處置。確認止血是否有效、呼吸裝置是否可用、通路與固定是否完整，以及保暖是否持續。','冷區救護，第 6 頁',slides),
 3:note('紀錄者把量測時間與數值寫在一起。回報血氧、心率與血壓時，對照前次紀錄，指出哪一項正在改變。','冷區救護，第 22 頁',slides),
 5:note('聯絡醫療支援前先整理受傷機轉、主要傷情、生命徵象與已做處置。由聯絡人說明目前最需要協助的決定，並記下回覆。','大量傷患事件應變，第 23 頁（MIST）',mciSlides),
 6:note('排班時，請接手者說出下次量測時間，以及保暖、保持乾燥由誰負責。將這些工作排入照護表，避免換班時漏做。','冷區救護，第 21–22 頁',slides),
 7:note('巡視時重查處置成效與先前未發現的傷害。若病況改變，同步重排照護與後送順序，並告知負責聯絡的人。','冷區救護，第 3、23 頁',slides),
 8:note('依 MIST 交接受傷機轉、傷情、生命徵象與已做處置，再補充處置時間、反應及下一件待辦事項。','大量傷患事件應變，第 23 頁',mciSlides),
 2:note('依當前情境列出接下來最擔心的變化，指出哪一個觀察結果會改變計畫。','災難醫療訓練課程，第 14 列',workbook),
 4:note('新增處置前，討論需要多少人力、可能延遲搬運多久，以及預期能改善哪一個問題。','災難醫療訓練課程，第 5 列',workbook),
 9:note('為後送準備主要、備用、應變與緊急方案（PACE），說明原先載具無法使用時如何交接。','冷區救護，第 5 頁',slides)
};
// These examples adapt the teaching materials to the exercise resource levels.
const resourceNotes={
 Basic:note('人力有限時，指派一人定時觀察與記錄，並指定搬運時的接手者。先確認誰能持續照看傷患，再安排其他工作。','大量傷患事件應變，第 3、5 頁',mciSlides),
 Better:note('有監測設備時，由一人確認設備可用，另一人核對並記錄趨勢。給氧情境另指派人員核對氧源與管路連接。','冷區救護，第 11、22 頁',slides),
 Best:note('有醫療支援與後送團隊時，分別指定床邊照護、聯絡及運送負責人。出發前共同確認接收單位、移動固定方式與備用載具。','冷區救護，第 2、5、27 頁',slides)
};
const baseline=[
 ['止血','檢查已處理的出血點與敷料有無再滲血','M 大出血',1],
 ['氣道','評估能否發聲、維持氣道與處理分泌物','A 呼吸道',3],
 ['呼吸','比較呼吸功與血氧相較前次的變化','R 呼吸',2],
 ['循環','追蹤脈搏、血壓與末梢灌流','C 循環',0],
 ['神經與保暖','複評意識與體溫，檢查衣物及保暖層是否乾燥','H 頭傷與低體溫',6],
 ['疼痛','記錄疼痛位置與程度，複評介入後反應','P 疼痛',4],
 ['感染預防','核對感染風險與既有抗生素醫囑','A 抗生素',6],
 ['傷口與皮膚','巡視傷口、敷料及持續受壓的皮膚','W 傷口',6],
 ['肢體固定','複評固定處的壓迫與遠端感覺、活動及灌流','S 固定',5],
 ['照護交班','交接趨勢、待辦、下次複評時間與求援條件','依處置交接',9]
];
// Numeric case IDs are retained for exercises saved by earlier versions.
const lessonFiles={
 pcc:['胡漢忠《延長傷患照護》','TECC、TCCC、PCC/N20259711252_胡漢忠newＰＣＣ.pdf'],
 cold:['冷區救護',slides],mci:['大量傷患事件應變',mciSlides],
 m:['暖區救護 M','TECC、TCCC、PCC/03 NFA_TECC_暖區救護-M (20250708 V3).pptx'],
 r:['暖區救護 R','TECC、TCCC、PCC/05 NFA_TECC_暖區救護-R (20250630 V3).pptx'],
 h:['暖區救護 H','TECC、TCCC、PCC/07 NFA_TECC_暖區救護-H (20250630 V3).pptx'],
 c:['暖區救護 C','TECC、TCCC、PCC/06 NFA TECC_暖區救護-C (20250721 V3).pptx']
};
// Each lesson carries its original page reference and two independently selectable tasks.
const lessons=[
 ['junction',0,'交界處大量出血','m','26–29','M 大出血',1,'觀察敷料滲血、局部壓迫與灌流變化','交接出血位置、已用止血方式與效果'],
 ['shock',0,'疑似出血性休克','c','4–9、16–19','C 循環',1,'比較意識、脈搏與血壓趨勢','重查可能出血來源並回報復甦反應'],
 ['hypothermia',0,'失溫或持續熱量流失','cold','20–21','H 頭傷與低體溫',6,'檢查體溫趨勢、潮濕衣物與地面接觸','確認隔熱、保暖與移動後的再評估'],
 ['openchest',0,'開放性或疑似張力性氣胸','r','9–21','R 呼吸',2,'比較胸部傷口、胸廓起伏及循環變化','呼吸或灌流惡化時立即通報並重評處置成效'],
 ['arrest',0,'心跳停止與復甦交接','cold','28–29','C 循環',1,'確認團隊已辨識心跳停止並記錄時間','交接復甦經過、可逆原因與醫療指導決策'],
 ['mascal',0,'多名傷患與後送延遲','mci','12、19–23','依處置交接',9,'追蹤各傷患檢傷等級及等待期間的變化','指定次級檢傷負責人並更新後送順序'],
 ['skin',0,'長時間臥床與皮膚受壓','pcc','34–36','W 傷口',6,'巡視受壓皮膚、潮濕處及裝置接觸點','在傷情允許下安排減壓與姿勢調整並交班'],
 ['seal',1,'胸封貼片','r','13–16、21','R 呼吸',2,'查貼合、移位與處置後呼吸變化','記錄貼敷位置與時間，惡化時立即重新評估'],
 ['decomp',1,'針刺減壓後複評','cold','6、13','R 呼吸',2,'比較處置前後及搬運後的呼吸與灌流','交接處置側別、時間、初始反應與是否再次惡化'],
 ['tourniquet',1,'肢體止血帶與效果複評','m','15–21','M 大出血',1,'核對止血帶時間、位置、固定與止血效果','若需調整或轉換，交由合格人員依規範評估並記錄決策'],
 ['pressure',1,'直接加壓與加壓包紮','m','23–26','M 大出血',1,'查看敷料滲血及包紮後的肢體灌流','交接加壓位置，搬動後重新確認效果'],
 ['airadj',1,'基本呼吸道與輔助器材','cold','6、10','A 呼吸道',3,'複評氣道通暢、分泌物與目前裝置狀態','交接擺位、使用的器材與介入後反應'],
 ['fluid',1,'輸液復甦與反應追蹤','c','16–19','C 循環',1,'核對已輸入量、通路狀態及灌流趨勢','交接液體種類、累計量與介入後的反應'],
 ['exam',1,'從頭到腳的次級評估','pcc','27–29','依處置交接',5,'依序檢視各部位並標記尚未檢查的位置','將新發現傷情加入問題清單並指定複評者'],
 ['meds',1,'用藥核對與後送備藥','pcc','32、47','依處置交接',6,'核對已給藥物、時間、反應與現有醫囑','交接下次給藥時間、備藥標示與負責人'],
 ['nursing',1,'口腔衛生與出入量照護','pcc','34–36','依處置交接',6,'檢查口腔狀態並核對本班攝入與排出紀錄','安排口腔清潔，將出入量變化交接給下一班'],
 ['transfer',1,'搬運打包與後送交接','pcc','31、43、46–50','依處置交接',9,'出發前檢查管線、敷料、藥物及途中所需物資','用結構化交接報告處置反應、待辦與接收聯絡方式']
];
const extensions={
 2:['h','13–16','燒傷評估','記錄燒傷範圍、部位與吸入性損傷疑慮','W 傷口',5],
 3:['h','8–12','神經複評','比較意識、瞳孔與生命徵象，交接變化時間','H 頭傷與低體溫',5],
 7:['c','10–14','骨盆骨折','搬動後複查固定狀態、皮膚與循環變化','C 循環',5],
 12:['h','17–19','穿透性眼傷','確認眼部保護無壓迫並記錄視覺變化','W 傷口',6],
 18:['cold','11','通氣異常','用 DOPE 核對管位、阻塞、氣胸及設備問題','A 呼吸道',3],
 27:['m','23–26','傷口填塞與加壓','交接填塞位置、敷料及搬運後止血效果','M 大出血',1],
 29:['c','18、24–25','血品復甦','核對血品及輸注紀錄，向醫療團隊回報反應','C 循環',1]
};
function lessonSource(source,pages){
 const [title,file]=lessonFiles[source];
 return citation(title+'，第 '+pages+' 頁',file+(file.endsWith('.pdf')?'#page='+parseInt(pages,10):''));
}
function draw(){
 $('flow').innerHTML=flows.map((f,i)=>'<label class="action"><input type="checkbox" data-flow="'+i+'" '+checked(state.flow[i])+'> '+(i+1)+'. '+f+'</label>'+(flowNotes[i]||'')).join('')+'<p>演練資源層級（分工示例） <select id="tier">'+['Basic','Better','Best'].map(t=>'<option '+(t===state.tier?'selected':'')+'>'+t+'</option>').join('')+'</select></p>'+resourceNotes[state.tier];
 $('tabs').innerHTML=['傷情與照護情境 · '+(injuries.length+lessons.filter(x=>x[1]===0).length),'技術處置 · '+(procedures.length+lessons.filter(x=>x[1]===1).length)].map((t,i)=>'<button data-tab="'+i+'" aria-pressed="'+(tab===i)+'">'+t+'</button>').join('');
 $('choices').innerHTML=(tab?procedures:injuries).map(([name],i)=>{const id=i+(tab?17:0);return '<label><input type="checkbox" data-case="'+id+'" '+checked(state.cases[id])+'> '+name+'</label>'}).join('');
 $('choices').insertAdjacentHTML('beforeend',lessons.filter(x=>x[1]===tab).map(([id,,name])=>'<label><input type="checkbox" data-case="'+id+'" '+checked(state.cases[id])+'> '+name+'</label>').join(''));
 const planned=[];
 function item(k,title,m,c,context,type){
 if(k in state.tasks)planned.push({k,title,m,c,context,type});
 return '<div class="action"><label><input type="checkbox" data-task="'+k+'" '+checked(k in state.tasks)+'> '+title+'</label></div>'}
 $('baseline').innerHTML=baseline.map(([topic,title,m,c],i)=>item('base-'+i,title,m,c,'通用公版／'+topic,'檢核')).join('');
 function extension(i,name){
 const x=extensions[i];if(!x)return '';
 const [src,pg,topic,title,m,c]=x;
 return '<h4>'+topic+'</h4>'+lessonSource(src,pg)+item('ext-'+i,title,m,c,name,'教材檢核');
 }
 $('cases').innerHTML=all.map(([name,a,b],i)=>{
 if(!state.cases[i])return '';
 const proc=i>=17, sections=proc?[['置放與維護','維護'],...b.split(' ').map(r=>['可能問題',r])]:[...a.split(' ').map(r=>['可能問題',r]),...b.split(' ').map(r=>['接續問題',r])];
 return '<section><small>'+ (proc?'技術處置':'主要傷情')+'</small><h2>'+name+'</h2>'+(caseNotes[name]||'')+extension(i,name)+sections.map(([phase,r],j)=>{
 const key=i+'-'+j;
 const [mon,care,m,c]=r==='維護'?[a,'確認仍有適應症，交接維護責任與異常處理方案','依處置交接',6]:risks[r];
 return '<div class="problem"><label><input type="checkbox" data-problem="'+key+'" '+checked(!state.off[key])+'> '+phase+' · <b>'+r+'</b></label>'+(!state.off[key]?(r==='疼痛'?note('檢查時面向傷患，觀察表情並詢問感受，將觀察與傷患自述一起交接。','TECC、TCCC，第 10、13 列',workbook):'')+'<div class="cols">'+[mon,care].map((t,n)=>'<div><h4>'+(n?'治療與照護':'監測')+'</h4>'+item(key+'-'+n,t,m,n?c:0,name+'／'+r,n?'照護':'監測')+'</div>').join('')+'</div>':'')+'</div>'}).join('')+(i===1&&!state.cases[17]?'<button data-add="17">納入胸管維護情境</button>':'')+'</section>'}).join('');
 $('cases').insertAdjacentHTML('beforeend',lessons.filter(([id])=>state.cases[id]).map(([id,type,name,src,pg,m,c,monitor,care])=>
 '<section><small>'+ (type?'技術處置':'照護情境')+'</small><h2>'+name+'</h2>'+lessonSource(src,pg)+'<div class="cols"><div><h4>監測</h4>'+item(id+'-m',monitor,m,0,name,'監測')+'</div><div><h4>照護與交接</h4>'+item(id+'-c',care,m,c,name,'照護')+'</div></div></section>').join(''));
 $('sort').value=state.sort;
 const groups=new Map();
 for(const p of planned){const g=state.sort==='執行頻率'?state.tasks[p.k]:state.sort==='MARCH-PAWS'?p.m:core[p.c];if(!groups.has(g))groups.set(g,[]);groups.get(g).push(p)}
 const order=state.sort==='執行頻率'?frequencies:state.sort==='MARCH-PAWS'?['M 大出血','A 呼吸道','R 呼吸','C 循環','H 頭傷與低體溫','P 疼痛','A 抗生素','W 傷口','S 固定','依處置交接']:core;
 $('rows').innerHTML=planned.length?'<p>'+planned.length+' 項任務 · '+state.tier+'</p>'+order.filter(g=>groups.has(g)).map(g=>'<h3>'+g+'</h3>'+groups.get(g).map(p=>'<div class="row"><div><small>'+p.context+' · '+p.type+'</small><br>'+p.title+'</div><select aria-label="'+p.title+'頻率" data-freq="'+p.k+'">'+frequencies.map(f=>'<option '+(state.tasks[p.k]===f?'selected':'')+'>'+f+'</option>').join('')+'</select></div>').join('')).join(''):'<p class="muted">勾選通用公版或情境中的項目，即可建立照護計畫。</p>';
}
document.addEventListener('change',e=>{const el=e.target,d=el.dataset;
 if(d.case!==undefined)state.cases[d.case]=el.checked;
 else if(d.problem!==undefined)state.off[d.problem]=!el.checked;
 else if(d.task!==undefined){if(el.checked)state.tasks[d.task]='待設定';else delete state.tasks[d.task]}
 else if(d.freq!==undefined)state.tasks[d.freq]=el.value;
 else if(d.flow!==undefined)state.flow[d.flow]=el.checked;
 else if(el.id==='tier'||el.id==='sort')state[el.id]=el.value;
 save();draw()});
document.addEventListener('click',e=>{const d=e.target.dataset;if(d.tab!==undefined){tab=Number(d.tab);draw()}if(d.add){state.cases[d.add]=true;save();draw()}});
$('clear').onclick=()=>{if(confirm('清除目前所有情境與演練計畫？')){state=empty();save();draw()}};
draw();
