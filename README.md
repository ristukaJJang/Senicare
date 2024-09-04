# Senicare

### 개요
코리아 아이티 아카데미 부산
[산대특] 빅데이터 활용 클라우드 SaaS 기반 시니어케어 ERP 개발과정  
요양사를 위한 고객, 인사, 물자 관리 ERP 프로젝트

#### Package
reack-router, react-router-dom, react-cookie, zustand, axios, ... 

###### package install
```bash
npm install
```

###### 개발모드 실행
```bash
npm run start
```

###### 개발 빌드
```bash
npm run build
```

#### 내비게이션 구조
**/auth** : 로그인 및 회원가입

**/cs** : 고객 관리(고객 리스트 보기)  
**/cs/write** : 고객 등록 화면  
**/cs/:customNumber** : 고객 상세보기  
**/cs/:customNumber/update** : 고객 수정

**/mm** : 용품 관리(용품 리스트 보기)    

**/hr** : 인사 관리(인사 리스트 보기)  
**/hr/:userId** : 인사 정보 상세 보기  
**/hr/:userId/update** : 인사 정보 수정하기

*** 

### 폴더 구조
###### ㅂ + 한자 -> 특수 문자로 이쁘게 폴더 구조 시각화 가능
  
┌ apis : 외부 API 연결 함수  
├ assets : 컴포넌트에서 사용될 정적 자원  
├ components : 공통 컴포넌트  
├ constants : 공통 상수  
├ hooks : 공통 훅 함수  
├ layouts : 공통 레이아웃 컴포넌트   
├ stores : 글로벌 상태 스토어  
├ types : 공통 타입  
├ utils : 공통 함수  
└ views : 페이지 별 화면 컴포넌트