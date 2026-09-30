(() => {
  'use strict';
  const config = window.SITE_CONFIG;
  const main = document.querySelector('main');
  const images = new Map();
  const uploadVersions = new Map();
  let nickname = '', toastTimer, exportUrl = null, page = 'home', counterFrame = null, stopSlideshow = () => {};
  const quiz = { phase: 'intro', index: 0, answers: Array(config.questions.length).fill(null) };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const memberAvatar = member => `<span class="member-avatar" style="--member-color:${member.color}">${member.photo ? `<img src="${escape(member.photo)}" alt="${member.name}" decoding="async">` : member.short}</span>`;
  const toast = message => {const el=document.querySelector('#toast'); el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3800);};
  const top = (number, label) => `<div class="page-top"><a class="back-link" href="#/">기념 홈으로</a><span class="event-label">EVENT ${number} / ${label}</span></div>`;

  const cafeButton = kind => `<a class="button soft cafe-button" href="${escape(config.cafeLinks[kind])}" target="_blank" rel="noopener noreferrer">카페 공유하기</a>`;
  function memorySlideshow() {
    const photos=config.slideshow.photos;
    if(!photos.length)return '';
    return `<section class="hero-slideshow" aria-labelledby="slideshow-title" aria-roledescription="슬라이드 쇼"><h2 id="slideshow-title" class="slideshow-title">HAPPY ANNIVERSARY!</h2><div class="slideshow-frame">${photos.map((photo,i)=>`<figure class="memory-slide${i===0?' is-active':''}" data-memory-slide aria-hidden="${i!==0}" role="group" aria-roledescription="슬라이드" aria-label="${i+1} / ${photos.length}"><img src="${escape(photo.src)}" alt="${escape(photo.alt)}" decoding="async" fetchpriority="${i===0?'high':'low'}"></figure>`).join('')}</div><div class="slideshow-controls"><div class="slideshow-navigation"><button type="button" data-slideshow-action="previous" aria-label="이전 사진">←</button><span class="slideshow-count"><b data-slideshow-current>01</b><span aria-hidden="true"> / </span><span class="sr-only"> / 전체 </span>${String(photos.length).padStart(2,'0')}</span><button type="button" data-slideshow-action="next" aria-label="다음 사진">→</button></div><button type="button" class="slideshow-toggle" data-slideshow-action="toggle" aria-label="슬라이드 쇼 일시정지">일시정지</button></div><p class="sr-only" role="status" data-slideshow-status></p></section>`;
  }
  function home() {
    return `<div class="wrap fade-in"><section class="hero"><div class="hero-main"><div class="anniversary-counter"><p class="counter-label">지하돌 방송 크루 결성일</p><div class="crew-counter" aria-label="플러스 ${config.anniversary.crewDays}일"><span aria-hidden="true">+<b data-count="${config.anniversary.crewDays}" data-duration="${config.anniversary.crewDuration}">${config.anniversary.crewDays}</b><small>일</small></span></div><p class="audition-counter" aria-label="지하아이돌 산하 오디션 합격 후 ${config.anniversary.auditionDays}일째">지하아이돌 산하 오디션 합격 후 <span aria-hidden="true"><b data-count="${config.anniversary.auditionDays}" data-duration="${config.anniversary.auditionDuration}">${config.anniversary.auditionDays}</b>일째</span></p></div><p class="eyebrow"><span class="line"></span>JIHAIDOL · FIRST ANNIVERSARY</p><p class="hero-kicker">SOOP 버추얼 스트리머 개인 크루</p><h1><span>[지하아이돌]</span><br>방송 1주년 기념일.</h1><p class="hero-copy">코코미, 우앵두, 연토리뿡치, 이노리<br>개인 방송 데뷔 1주년 기념 사이트입니다.</p><div class="hero-meta"><b>방송 1주년</b><span>MADE BY 이노리</span></div></div>${memorySlideshow()}</section><section aria-labelledby="events-title"><div class="section-head"><h2 id="events-title">1주년 기념 이벤트</h2><span class="eyebrow">PICK YOUR EVENT / 02</span></div><div class="event-grid"><a class="event-card" href="#/impressions"><div class="event-visual first" aria-hidden="true"><span class="event-number">EVENT 01</span><div class="mini-table"><div class="mini-table-title">FIRST IMPRESSION & NOW</div><div class="mini-table-row"><span></span>${config.members.map(m=>`<span>${m.short}</span>`).join('')}</div><div class="mini-table-row"><span>첫인상</span><i>+</i><i>+</i><i>+</i><i>+</i></div><div class="mini-table-row"><span>현인상</span><i class="filled">?</i><i class="filled">!</i><i class="filled">…</i><i class="filled">♡</i></div></div></div><div class="card-copy"><div class="card-meta"><span>FIRST & NOW</span><span>첫인상 메이커</span></div><h3>첫인상 & 현인상</h3><p>멤버들의 첫인상과 지금의 인상을<br>짤 여덟 장으로 담는 지하돌 첫인상표.</p><div class="card-bottom"><span>지하돌 첫인상표 만들기</span><span class="round-icon" aria-hidden="true">+</span></div></div></a><a class="event-card" href="#/quiz"><div class="event-visual second" aria-hidden="true"><span class="event-number">EVENT 02</span><div class="mini-question"><p class="eyebrow">IF I WAS A STREAMER</p><p>내가 지하아이돌 멤버라면?</p><div class="mini-scale"><i></i><i></i><i></i><i></i><i></i></div></div></div><div class="card-copy"><div class="card-meta"><span>FIND YOUR MEMBER</span><span>스트리머 유형 테스트</span></div><h3>내가 지하돌이라면?</h3><p>내가 스트리머로 데뷔한다면<br>어떤 지하돌 멤버와 가장 비슷할까요?</p><div class="card-bottom"><span>테스트 해보기</span><span class="round-icon" aria-hidden="true">+</span></div></div></a></div></section><section class="members" aria-labelledby="members-title"><div class="section-head"><h2 id="members-title">지하아이돌 프로필</h2><span class="eyebrow">PROFILE</span></div><div class="members-grid">${config.members.map((m,i)=>`<article class="member-card"><div class="member-intro">${memberAvatar(m)}<div><small>MEMBER 0${i+1}</small><h3>${m.name}</h3></div></div><dl class="member-facts"><div><dt>생일</dt><dd>${m.birthday}</dd></div><div><dt>방송 데뷔일</dt><dd>${m.debut}</dd></div></dl><a class="button soft station-link" href="${m.station}" target="_blank" rel="noopener noreferrer" aria-label="${m.name} 방송국 바로가기">방송국 바로가기</a></article>`).join('')}</div></section></div>`;
  }
  function animateCounters() {
    if(counterFrame!==null)cancelAnimationFrame(counterFrame);
    const nodes=[...main.querySelectorAll('[data-count]')];
    if(!nodes.length||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    nodes.forEach(el=>{el.textContent='0';});
    let start;
    const step=now=>{if(page!=='home')return;if(start===undefined)start=now;let done=true;nodes.forEach(el=>{const progress=Math.min(1,(now-start)/Number(el.dataset.duration));el.textContent=String(Math.round(Number(el.dataset.count)*(1-(1-progress)**3)));if(progress<1)done=false;});if(!done)counterFrame=requestAnimationFrame(step);else counterFrame=null;};
    counterFrame=requestAnimationFrame(step);
  }

  function uploadCell(member, kind) {
    const key = `${member.id}-${kind}`, image=images.get(key), label=kind==='first'?'첫인상':'현인상';
    return `<div class="upload-cell" data-kind="${kind}" data-mobile-label="${label}"><div class="upload-zone ${image?'has-image':''}" data-key="${key}">${image?`<img src="${image.url}" style="object-fit:${image.fit}" alt="${member.name} ${label} 이미지">`:''}<label><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp" data-upload="${key}" aria-label="${member.name} ${label} 이미지 ${image?'교체':'업로드'}"><span class="plus" aria-hidden="true">+</span><span class="upload-text">${image?'이미지 바꾸기':'이미지 넣기'}</span></label></div><div class="cell-actions">${image?`<button data-action="fit" data-key="${key}" aria-label="${member.name} ${label} ${image.fit==='contain'?'꽉 채우기':'전체 보기'}">${image.fit==='contain'?'꽉 채우기':'전체 보기'}</button><button data-action="remove" data-key="${key}" aria-label="${member.name} ${label} 이미지 삭제">삭제</button>`:'<span class="empty-hint">클릭 또는 드래그</span>'}</div></div>`;
  }

  function impressions() {
    return `<div class="wrap fade-in">${top('01','FIRST & NOW')}<div class="page-heading"><div><h1>첫인상 & 현인상</h1><p>멤버를 보고 떠오르는 짤을 넣어주세요.<br>완성한 지하돌 첫인상표는 이미지로 저장할 수 있어요.</p></div><div class="page-actions"><button class="button primary" data-action="export">이미지로 저장</button>${cafeButton('impressions')}</div></div><div class="editor-toolbar"><label class="name-field">만든 사람 <input id="nickname" value="${escape(nickname)}" maxlength="20" autocomplete="off" placeholder="닉네임 (선택)"></label><span class="editor-info"><b>${images.size} / 8</b> 이미지 · 빈칸이 있어도 저장할 수 있어요</span></div><section class="impression-sheet" aria-label="지하돌 첫인상표 편집"><div class="sheet-heading"><div><h2>지하돌 첫인상표</h2><p>JIHAIDOL · 1ST ANNIVERSARY</p></div><span class="sheet-by" id="sheet-by">${nickname?escape(nickname)+'의 지하돌 첫인상표':'MY FIRST & NOW'}</span></div><div class="impression-grid"><div class="grid-corner"></div><div class="row-name first">첫인상<small>FIRST</small></div><div class="row-name now">현인상<small>NOW</small></div>${config.members.map((m,i)=>`<div class="member-col" style="--column:${i+2}"><div class="member-head">${memberAvatar(m)}${m.name}</div>${uploadCell(m,'first')}${uploadCell(m,'now')}</div>`).join('')}</div><div class="sheet-foot"><span>MADE BY 이노리</span><span>지하아이돌 방송 1주년</span></div></section><div class="editor-bottom"><p>이미지는 내 기기에서만 처리돼요. 페이지를 새로고침하기 전에 저장해 주세요.<br>PNG · JPG · WEBP · GIF 등 / 장당 15MB 이하 · GIF는 한 장면으로 저장됩니다.<br>카페 공유하기는 카페를 새 창으로 열어요. 저장한 이미지를 게시글에 첨부해 주세요.</p><button class="text-button" data-action="reset-images">이미지 모두 비우기</button></div></div>`;
  }

  function getQuizResult() {
    if(quiz.answers.length!==config.questions.length||quiz.answers.some(a=>!Number.isInteger(a)||a<1||a>5))throw new Error('모든 문항에 답해주세요.');
    const ranked=config.members.map(member=>{
      const items=config.questions.map((q,i)=>({q,answer:quiz.answers[i]})).filter(x=>x.q.targets.includes(member.id));
      const score=items.reduce((sum,x)=>sum+x.answer-1,0),max=items.length*4;
      if(!max)throw new Error('멤버별 문항 설정을 확인해 주세요.');
      return {member,score,max,normalizedScore:score/max*100,points:items.filter(x=>x.answer>=4).sort((a,b)=>b.answer-a.answer)};
    }).sort((a,b)=>b.score*a.max-a.score*b.max);
    const matches=ranked.filter(r=>r.score*ranked[0].max===ranked[0].score*r.max).map(r=>r.member);
    return {ranked,matches};
  }
  const resultNotice = () => `<aside class="result-notice" aria-labelledby="result-notice-title"><h2 id="result-notice-title">${escape(config.resultNotice.title)}</h2><p>${escape(config.resultNotice.body)}</p><strong>${escape(config.resultNotice.emphasis)}</strong></aside>`;
  function quizPage() {
    let content='';
    if(quiz.phase==='intro')content=`<div class="quiz-intro"><span class="demo-label">스트리머 유형 테스트</span><h1>내가<br><em>지하돌</em>이라면?</h1><p>내가 스트리머로 데뷔한다면<br>어떤 지하돌 멤버와 가장 비슷할까요?</p><div class="quiz-member-line">${config.members.map(memberAvatar).join('')}</div><button class="button accent" data-action="start-quiz">지하돌 테스트</button><div class="quiz-details"><span>총 ${config.questions.length}문항</span><span>약 3분</span><span>5단계 선택</span></div><div class="demo-note">게임 취향, 소통 방식, 일상 기록과 공포 면역까지.<br><strong>스트리머가 된 내 모습</strong>을 떠올리면서 골라주세요. 게임을 잘 몰라도 가장 가까운 느낌으로 답하면 됩니다.</div></div>`;
    if(quiz.phase==='questions'){
      const q=config.questions[quiz.index],answer=quiz.answers[quiz.index];
      content=`<span class="demo-label">IF I WAS A STREAMER</span><div class="quiz-progress-top"><span>스트리머가 된 나를 떠올려주세요</span><b>${quiz.index+1} / ${config.questions.length}</b></div><progress value="${quiz.index+1}" max="${config.questions.length}" aria-label="테스트 진행도"></progress><section class="question-card"><span class="question-number">QUESTION ${String(quiz.index+1).padStart(2,'0')} · ${q.category}</span><h1 id="question-title">${q.text}</h1><fieldset class="answer-options" aria-labelledby="question-title"><legend class="sr-only">동의하는 정도</legend>${config.choices.map((c,i)=>`<label><input type="radio" name="answer" value="${i+1}" ${answer===i+1?'checked':''}><span>${c}</span></label>`).join('')}</fieldset><div class="quiz-controls"><button class="button soft" data-action="prev-question" ${quiz.index===0?'disabled':''}>이전 문항</button><button class="button primary" data-action="next-question" ${answer===null?'disabled':''}>${quiz.index===config.questions.length-1?'결과 보기':'다음 문항'}</button></div></section><p class="quiz-footnote">방송 성향을 비교하는 재미용 테스트이며, 심리 진단이 아닙니다.</p>`;
    }
    if(quiz.phase==='result'){
      const {ranked,matches}=getQuizResult(),tie=matches.length>1,winner=ranked[0];
      content=`<div class="result"><span class="demo-label">IF I WAS A STREAMER</span><h1>당신이 지하돌이라면?</h1>${resultNotice()}<article class="result-card"><div class="result-card-top"><p class="eyebrow">YOUR TEST RESULT</p>${tie?`<div class="quiz-member-line">${matches.map(memberAvatar).join('')}</div>`:memberAvatar(matches[0])}<h2 class="${tie?'tied-result':''}">${matches.map(m=>m.name).join(' · ')}</h2><p>${tie?'공동 결과 · 여러 멤버가 같은 점수로 나왔어요.':winner.member.resultTitle}</p></div><div class="result-body"><p class="result-description">${tie?'여러 멤버의 환산 점수가 같아 공동 결과로 표시했습니다.':winner.member.resultDescription}</p>${!tie?`<div class="result-tags">${winner.member.tags.map(t=>`<span>${t}</span>`).join('')}</div>`:''}<h3>멤버별 유사도 점수 <small>100점 환산</small></h3>${ranked.map(r=>`<div class="trait-line"><span>${r.member.name}</span><span class="trait-bar"><i style="width:${r.normalizedScore}%"></i></span><span>${r.normalizedScore.toFixed(1)}점</span></div>`).join('')}<p class="score-note">멤버별 해당 문항의 만점을 기준으로 100점 환산해 비교합니다. 확률이나 심리검사 수치는 아닙니다.</p>${!tie&&winner.points.length?`<div class="matched-points"><h3>특히 비슷하게 답한 부분</h3><ul>${winner.points.slice(0,2).map(x=>`<li>${x.q.text}</li>`).join('')}</ul></div>`:''}</div></article><div class="result-actions"><button class="button primary" data-action="export-quiz">결과 이미지 저장</button>${cafeButton('quiz')}</div><p class="share-help">결과 이미지를 저장한 뒤 카페 게시글에 첨부해 주세요.</p><div class="result-secondary-actions"><button class="text-button" data-action="restart-quiz">다시 테스트하기</button><button class="text-button" data-action="review-quiz">내 답변 수정</button></div></div>`;
    }
    return `<div class="wrap fade-in">${top('02','FIND YOUR MEMBER')}<div class="quiz-shell">${content}</div></div>`;
  }

  function render(focus=false) {
    const route=location.hash.replace(/^#\/?/,'');
    page=route==='impressions'?'impressions':route==='quiz'?'quiz':'home';
    if(counterFrame!==null){cancelAnimationFrame(counterFrame);counterFrame=null;}
    stopSlideshow();
    stopSlideshow = () => {};
    main.innerHTML=page==='impressions'?impressions():page==='quiz'?quizPage():home();
    if(page==='home'){
      animateCounters();
      stopSlideshow=window.startMemorySlideshow(main.querySelector('.hero-slideshow'),config.slideshow);
    }
    document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.title=(page==='impressions'?'첫인상 & 현인상':page==='quiz'?'내가 지하돌이라면?':'방송 1주년')+' · 지하아이돌';
    if(focus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  const imageFromUrl=url=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('이미지를 읽을 수 없어요. PNG 또는 JPG로 다시 시도해 주세요.'));img.src=url;});
  const portraitCache = new Map();
  async function loadMemberPortraits(members) {
    const entries = await Promise.all(members.map(async member => {
      if(!member.photo)return [member.id,null];
      if(!portraitCache.has(member.photo)){
        portraitCache.set(member.photo,imageFromUrl(member.photo).catch(()=>{
          portraitCache.delete(member.photo);
          throw new Error(member.name+' 프로필 이미지를 불러오지 못했어요. 잠시 후 다시 저장해 주세요.');
        }));
      }
      return [member.id,await portraitCache.get(member.photo)];
    }));
    return new Map(entries);
  }
  function drawMemberPortrait(ctx,member,portrait,cx,cy,radius) {
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fillStyle=member.color;ctx.fill();ctx.clip();
    if(portrait)drawFitted(ctx,portrait,cx-radius,cy-radius,radius*2,radius*2,'cover');
    else{ctx.font=`700 ${radius*.85}px "Noto Sans KR", Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#192b42';ctx.fillText(member.short,cx,cy);}
    ctx.restore();
  }
  const canvasBlob=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('이미지를 만들지 못했어요. 다시 시도해 주세요.')),'image/png'));
  async function uploadImage(key,file) {
    if(!file)return;
    if(!/^(image\/(png|jpeg|webp|gif|avif|bmp))$/.test(file.type)){toast('PNG, JPG, WEBP, GIF 등의 이미지 파일을 선택해 주세요.');return;}
    if(file.size>15*1024*1024){toast('장당 15MB 이하의 이미지를 선택해 주세요.');return;}
    const version=(uploadVersions.get(key)||0)+1;uploadVersions.set(key,version);
    const source=URL.createObjectURL(file);let normalizedUrl=null;
    try{
      const raw=await imageFromUrl(source);
      const scale=Math.min(1,1400/Math.max(raw.naturalWidth,raw.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(raw.naturalWidth*scale));canvas.height=Math.max(1,Math.round(raw.naturalHeight*scale));
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('이 브라우저에서 이미지 처리를 지원하지 않아요.');
      ctx.drawImage(raw,0,0,canvas.width,canvas.height);
      normalizedUrl=URL.createObjectURL(await canvasBlob(canvas));
      const img=await imageFromUrl(normalizedUrl);
      if(uploadVersions.get(key)!==version){URL.revokeObjectURL(normalizedUrl);return;}
      if(images.has(key))URL.revokeObjectURL(images.get(key).url);
      images.set(key,{url:normalizedUrl,img,fit:'contain'});
      if(page==='impressions')render();
      toast('이미지를 넣었어요.');
    }catch(error){if(normalizedUrl)URL.revokeObjectURL(normalizedUrl);toast(error.message);}
    finally{URL.revokeObjectURL(source);}
  }
  function removeImage(key){uploadVersions.set(key,(uploadVersions.get(key)||0)+1);if(images.has(key)){URL.revokeObjectURL(images.get(key).url);images.delete(key);}if(page==='impressions')render();}
  function drawFitted(ctx,img,x,y,w,h,fit){
    const scale=fit==='cover'?Math.max(w/img.naturalWidth,h/img.naturalHeight):Math.min(w/img.naturalWidth,h/img.naturalHeight);
    const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);ctx.restore();
  }
  async function exportImages(){
    const button=main.querySelector('[data-action="export"]');if(button){button.disabled=true;button.textContent='이미지 만드는 중…';}
    try{
      if(document.fonts)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]);
      const portraits=await loadMemberPortraits(config.members);
      const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1250;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('이미지 저장을 지원하는 브라우저에서 다시 시도해 주세요.');
      const text=(s,x,y,size=24,weight=500,color='#202320',align='left')=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px "Noto Sans KR", Arial, sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);};
      const rect=(x,y,w,h,fill,stroke)=>{ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}};
      rect(0,0,1800,1250,'#f2f6fa');
      const x=50,y=50,w=1700,labelW=132,colW=(w-labelW)/4,head=166,memberH=90,rowH=405;
      rect(x,y,w,head,'#79d9f2','#202320');text('지하돌 첫인상표',x+38,y+65,47,800);text('JIHAIDOL · 1ST ANNIVERSARY',x+40,y+124,20,600);
      if(nickname)text(nickname+'의 지하돌 첫인상표',x+w-35,y+125,22,500,'#202320','right');
      rect(x,y+head,w,memberH,'#fff','#d1dce7');
      config.members.forEach((m,i)=>{
        const cx=x+labelW+colW*i;
        rect(cx,y+head,colW,memberH,'#fff','#d1dce7');
        ctx.font='700 28px \"Noto Sans KR\", Arial, sans-serif';
        const groupWidth=56+16+ctx.measureText(m.name).width,groupX=cx+(colW-groupWidth)/2;
        drawMemberPortrait(ctx,m,portraits.get(m.id),groupX+28,y+head+memberH/2,28);
        text(m.name,groupX+72,y+head+memberH/2,28,700,'#202320','left');
      });
      ['first','now'].forEach((kind,row)=>{
        const ry=y+head+memberH+row*rowH;
        rect(x,ry,labelW,rowH,'#edf5fa','#d1dce7');
        text(row?'현인상':'첫인상',x+labelW/2,ry+rowH/2-10,28,800,'#202320','center');
        text(row?'NOW':'FIRST',x+labelW/2,ry+rowH/2+30,16,500,'#696d65','center');
        config.members.forEach((m,i)=>{
          const cx=x+labelW+colW*i,item=images.get(`${m.id}-${kind}`);
          rect(cx,ry,colW,rowH,'#fff','#d1dce7');
          if(item)drawFitted(ctx,item.img,cx+18,ry+18,colW-36,rowH-36,item.fit);
          else{ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle='#cdd3c3';ctx.strokeRect(cx+18,ry+18,colW-36,rowH-36);ctx.restore();text('—',cx+colW/2,ry+rowH/2,28,400,'#a8b199','center');}
        });
      });
      const fy=y+head+memberH+rowH*2;rect(x,fy,w,70,'#fff','#d1dce7');text('MADE BY 이노리',x+30,fy+35,16,500,'#696d65');text('지하아이돌 방송 1주년',x+w-30,fy+35,18,500,'#696d65','right');
      if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(await canvasBlob(canvas));
      document.querySelector('#export-title').textContent='지하돌 첫인상표';
      document.querySelector('#export-eyebrow').textContent='MY FIRST & NOW';
      document.querySelector('#export-image').alt='완성한 지하돌 첫인상표';
      document.querySelector('#export-cafe').href=config.cafeLinks.impressions;
      document.querySelector('#export-image').src=exportUrl;
      const link=document.querySelector('#download-image');link.href=exportUrl;link.download='지하돌_첫인상표.png';
      document.querySelector('#export-dialog').showModal();
    }catch(error){toast(error.message||'저장 중 문제가 생겼어요. 다시 시도해 주세요.');}
    finally{if(button){button.disabled=false;button.innerHTML='<span aria-hidden="true">▧</span> 이미지로 저장';}}
  }

  async function exportQuizResult(){
    const button=main.querySelector('[data-action="export-quiz"]');if(button){button.disabled=true;button.textContent='이미지 만드는 중…';}
    try{
      if(document.fonts)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]);
      const {ranked,matches}=getQuizResult(),tie=matches.length>1;
      const portraits=await loadMemberPortraits(matches);
      const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1840;const ctx=canvas.getContext('2d');
      if(!ctx)throw new Error('이미지 저장을 지원하는 브라우저에서 다시 시도해 주세요.');
      const text=(value,x,y,size=28,weight=500,color='#192b42',align='left')=>{ctx.font=`${weight} ${size}px "Noto Sans KR", Arial, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(value,x,y);};
      const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
      const wrap=(value,x,y,width,size=30,lineHeight=51,weight=500,color='#192b42')=>{ctx.font=`${weight} ${size}px "Noto Sans KR", Arial, sans-serif`;let line='',cy=y;for(const c of value){if(ctx.measureText(line+c).width>width&&line){text(line,x,cy,size,weight,color);cy+=lineHeight;line=c;}else line+=c;}if(line)text(line,x,cy,size,weight,color);return cy+lineHeight;};
      rect(0,0,1200,1840,'#f2f6fa');rect(60,60,1080,1720,'#fff');rect(60,60,1080,585,'#79d9f2');
      text('JIHAIDOL · YOUR TEST RESULT',600,118,23,700,'#1e4a63','center');text('내가 지하돌이라면?',600,192,46,800,'#192b42','center');
      matches.forEach((m,i)=>{const cx=600+(i-(matches.length-1)/2)*135;drawMemberPortrait(ctx,m,portraits.get(m.id),cx,325,54);});
      const rows=tie&&matches.length>2?[matches.slice(0,2),matches.slice(2)]:[matches];
      rows.forEach((row,i)=>text(row.map(m=>m.name).join(' · '),600,455+i*58,tie?39:65,800,'#192b42','center'));
      text(tie?'공동 결과 · 같은 점수의 멤버들':matches[0].resultTitle,600,590,tie?25:29,600,'#1e4a63','center');
      const description=tie?'여러 멤버의 환산 점수가 같아 공동 결과로 표시했습니다.':matches[0].resultDescription;
      wrap(description,110,712,980,29,51);
      text('멤버별 유사도 점수 · 100점 환산',110,982,30,800);
      ranked.forEach((r,i)=>{const y=1056+i*92;text(r.member.name,110,y,26,600);rect(345,y-8,540,16,'#e8f0f8');rect(345,y-8,540*r.normalizedScore/100,16,'#377caf');text(`${r.normalizedScore.toFixed(1)}점`,1084,y,27,600,'#34566e','right');});
      text('획득 점수 ÷ 멤버별 만점 × 100 · 확률이나 심리검사 수치가 아닙니다.',600,1386,19,400,'#5b7084','center');
      rect(105,1430,990,300,'#e5f2fb');rect(105,1430,7,300,'#31739d');
      text(config.resultNotice.title,140,1475,28,800,'#204f70');
      wrap(config.resultNotice.body,140,1535,920,26,43,500,'#204661');
      wrap(config.resultNotice.emphasis,140,1670,920,27,41,800,'#153e5d');
      text('MADE BY 이노리 · 지하아이돌 방송 1주년',600,1764,20,600,'#34566e','center');
      if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(await canvasBlob(canvas));
      document.querySelector('#export-title').textContent='나의 지하돌 테스트 결과';document.querySelector('#export-eyebrow').textContent='IF I WAS A STREAMER';
      const image=document.querySelector('#export-image');image.src=exportUrl;image.alt='나의 지하돌 스트리머 유형 테스트 결과';
      const link=document.querySelector('#download-image');link.href=exportUrl;link.download='지하돌_스트리머유형_결과.png';document.querySelector('#export-cafe').href=config.cafeLinks.quiz;
      document.querySelector('#export-dialog').showModal();
    }catch(error){toast(error.message||'이미지를 저장하지 못했어요. 다시 시도해 주세요.');}
    finally{if(button){button.disabled=false;button.textContent='결과 이미지 저장';}}
  }

  main.addEventListener('input',event=>{if(event.target.id==='nickname'){nickname=event.target.value;document.querySelector('#sheet-by').textContent=nickname?nickname+'의 지하돌 첫인상표':'MY FIRST & NOW';}});
  main.addEventListener('change',event=>{
    if(event.target.dataset.upload)uploadImage(event.target.dataset.upload,event.target.files[0]);
    if(event.target.name==='answer'){quiz.answers[quiz.index]=Number(event.target.value);const next=main.querySelector('[data-action="next-question"]');if(next)next.disabled=false;}
  });
  main.addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
    const action=button.dataset.action,key=button.dataset.key;
    if(action==='export')exportImages();
    if(action==='export-quiz')exportQuizResult();
    if(action==='remove')removeImage(key);
    if(action==='fit'){const image=images.get(key);if(image){image.fit=image.fit==='contain'?'cover':'contain';render();}}
    if(action==='reset-images'){
      if(images.size===0){toast('아직 넣은 이미지가 없어요.');return;}
      if(window.confirm('넣은 이미지를 모두 비울까요?')){config.members.forEach(m=>['first','now'].forEach(k=>removeImage(`${m.id}-${k}`)));toast('이미지를 모두 비웠어요.');}
    }
    if(action==='start-quiz'||action==='restart-quiz'){quiz.phase='questions';quiz.index=0;quiz.answers.fill(null);render(true);}
    if(action==='prev-question'&&quiz.index>0){quiz.index--;render(true);}
    if(action==='next-question'&&quiz.answers[quiz.index]!==null){if(quiz.index===config.questions.length-1)quiz.phase='result';else quiz.index++;render(true);}
    if(action==='review-quiz'){quiz.phase='questions';quiz.index=0;render(true);}
  });
  ['dragenter','dragover'].forEach(type=>main.addEventListener(type,event=>{const zone=event.target.closest('.upload-zone');if(zone){event.preventDefault();zone.classList.add('dragover');}}));
  main.addEventListener('dragleave',event=>{const zone=event.target.closest('.upload-zone');if(zone&&!zone.contains(event.relatedTarget))zone.classList.remove('dragover');});
  main.addEventListener('drop',event=>{const zone=event.target.closest('.upload-zone');if(zone){event.preventDefault();zone.classList.remove('dragover');uploadImage(zone.dataset.key,event.dataTransfer.files[0]);}});
  document.querySelector('#close-export').addEventListener('click',()=>document.querySelector('#export-dialog').close());
  document.querySelector('#export-dialog').addEventListener('click',event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close();}});
  window.addEventListener('hashchange',()=>render(true));
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView({block:'start'});});
  window.addEventListener('beforeunload',event=>{if(images.size){event.preventDefault();event.returnValue='';}});
  render();

  // Browser agents use the exact same scoring and state as the visible quiz.
  if(document.modelContext?.registerTool){
    const controller=new AbortController();
    const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:controller.signal})).catch(()=>{});}catch{}};
    register({name:'get_anniversary_state',description:'Read the current event page, image count, and quiz progress. Does not read uploaded image bytes.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({page,imageCount:images.size,quizPhase:quiz.phase,answered:quiz.answers.filter(x=>x!==null).length,total:config.questions.length})});
    register({name:'complete_streamer_member_quiz',description:'Answer all streamer-scenario questions using integers from 1 to 5, calculate member scores using the same rules as the UI, and display all tied highest-scoring members.',inputSchema:{type:'object',properties:{answers:{type:'array',items:{type:'integer',minimum:1,maximum:5},minItems:config.questions.length,maxItems:config.questions.length}},required:['answers'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{
      if(!input||!Array.isArray(input.answers)||input.answers.length!==config.questions.length||input.answers.some(a=>!Number.isInteger(a)||a<1||a>5))throw new Error(`Provide exactly ${config.questions.length} integer answers between 1 and 5.`);
      quiz.answers=[...input.answers];quiz.index=config.questions.length-1;quiz.phase='result';location.hash='/quiz';render(true);const r=getQuizResult();return {members:r.matches.map(m=>m.name),scores:r.ranked.map(x=>({name:x.member.name,score:x.score,max:x.max,normalizedScore:x.normalizedScore}))};
    }});
    window.addEventListener('pagehide',event=>{if(!event.persisted)controller.abort();},{once:true});
  }
})();
